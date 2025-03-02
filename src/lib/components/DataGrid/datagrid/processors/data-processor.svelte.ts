import { sort } from "fast-sort";
import { isGroupColumn } from "../helpers/column-guards";
import type { DatagridCore } from "../index.svelte";
import type { Aggregation, AggregationFn, FilterCondition, GridGroupRow, GridRow } from "../types";
import { findColumnById, flattenColumnStructureAndClearGroups } from "../utils.svelte";
import type { PerformanceMetrics } from "../helpers/performance-metrics.svelte";
import type { AccessorColumn, ComputedColumn } from "../types";
import { aggregationFunctions } from "../helpers/aggregation-functions";

export class DataProcessor<TOriginalRow> {
    private readonly metrics: PerformanceMetrics;
    private customAggregationFns: Map<string, AggregationFn>;

    constructor(private readonly datagrid: DatagridCore<TOriginalRow>) {
        this.metrics = datagrid.metrics;
        this.customAggregationFns = new Map();
    }

    executeFullDataTransformation(): void {
        const shouldRunGrouping = this.datagrid.features.grouping.groupByColumns.length > 0 || this.datagrid.features.grouping.manual;

        this.metrics.clear();

        // Create a copy of the data to avoid mutating the original data
        let data = [...this.datagrid.initial.data];

        if (this.datagrid.cache.filteredData === null) {
            // Apply global search if value is set
            data = this.applyGlobalSearch(data);
            data = this.applyColumnFilters(data);
        } else {
            data = this.datagrid.cache.filteredData;
        }
        data = this.applySorting(data);

        // Cache sorted or sortend and filtered results
        this.datagrid.cache.sortedData = data;

        // Clear hierarchical cache when data changes
        this.datagrid.cache.invalidate('hierarchicalRows');

        // Process grouped or regular data
        if (shouldRunGrouping) this.processGroupedData(data);
        else this.processRegularData(data);


        if (this.datagrid.config.measurePerformance) this.datagrid.metrics.print();
    }

    applyGlobalSearch(data: TOriginalRow[]): TOriginalRow[] {
        data = this.datagrid.lifecycleHooks.executePreGlobalSearch(data);
        console.log("search ", this.datagrid.features.globalSearch.value)
        const isManualSortingEnabled = this.datagrid.features.globalSearch.manual
        const valueIsEmpty = this.datagrid.features.globalSearch.value === ''
       
        if (isManualSortingEnabled || valueIsEmpty) return data

        const searchValue = this.datagrid.features.globalSearch.value.toLowerCase();


        const applyFuzzySearch = () => {
            const fuseInstance = this.datagrid.features.globalSearch.fuseInstance;
            if (!fuseInstance) throw new Error('Fuse instance is not initialized');
            return fuseInstance.search(searchValue).map(result => result.item);
        }

        const applySimpleSearch = (data: TOriginalRow[]) => {
            const searchableColumns = flattenColumnStructureAndClearGroups(this.datagrid.columns).filter(c => ['accessor', 'computed'].includes(c.type)).filter(col => col.options.searchable !== false) as (AccessorColumn<TOriginalRow> | ComputedColumn<TOriginalRow>)[];
            return data.filter(item =>
                searchableColumns.some(column =>
                    String(column.accessorFn(item))
                        .toLowerCase()
                        .includes(searchValue)
                )
            );
        }

        const isFuzzySearchEnabled = this.datagrid.features.globalSearch.fuzzy;

        this.metrics.measure('Global Search', () => {
            if (isFuzzySearchEnabled) {
                data = applyFuzzySearch();
            } else {
                data = applySimpleSearch(data);
            }
        });

        return this.datagrid.lifecycleHooks.executePostGlobalSearch(data);
    }

    applyColumnFilters(data: TOriginalRow[]): TOriginalRow[] {
        data = this.datagrid.lifecycleHooks.executePreFilter(data);

        const isMnualSortingEnabled = this.datagrid.features.globalSearch.manual
        const noFilters = this.datagrid.features.filtering.conditions.length === 0

        if (isMnualSortingEnabled || noFilters) return data

        const filterData = (data: TOriginalRow[], activeFilters: FilterCondition<any>[]) => {
            return data.filter(row =>
                activeFilters.every(filter =>
                    this.datagrid.features.filtering.evaluateCondition(
                        filter.accessorFn(row),
                        filter
                    )
                )
            );
        }

        const getActiveFilters = () => {
            return this.datagrid.features.filtering.conditions
                .filter(condition => condition.value !== null);
        }

        this.metrics.measure('Column Filtering', () => {
            data = filterData(data, getActiveFilters());
        })

        return this.datagrid.lifecycleHooks.executePostFilter(data);
    }

    applySorting(data: TOriginalRow[]): TOriginalRow[] {
        data = this.datagrid.lifecycleHooks.executePreSort(data);

        const isMnualSortingEnabled = this.datagrid.features.sorting.manualSorting;
        const noSorting = this.datagrid.features.sorting.sorted.length === 0
        if (isMnualSortingEnabled || noSorting) return data

        const sortInstructions = this.datagrid.features.sorting.sorted
            .map(config => {
                const column = findColumnById(flattenColumnStructureAndClearGroups(this.datagrid.columns), config.columnId) as (AccessorColumn<TOriginalRow> | ComputedColumn<TOriginalRow>);
                if (!column || isGroupColumn(column) || !column.isSortable()) {
                    return null;
                }

                const accessorFn = (row: TOriginalRow) => column.accessorFn(row);
                return config.desc ? { desc: accessorFn } : { asc: accessorFn };
            })
            .filter(Boolean);

        this.metrics.measure('Sorting', () => {
            data = sort(data).by(sortInstructions as any);
        });

        return this.datagrid.lifecycleHooks.executePostSort(data);

    }


    flattenGridRows(data: GridRow<TOriginalRow>[]): GridRow<TOriginalRow>[] {
        const flattened: GridRow<TOriginalRow>[] = [];

        for (const row of data) {
            flattened.push(row);
            if (row.isGroupRow()) {
                flattened.push(...this.flattenGridRows(row.children));
            }
        }
        return flattened
    }

    processGroupedData(data: TOriginalRow[]): void {
        // Create grouped structure only if not already cached
        let groupedRows = this.datagrid.cache.hierarchicalRows;

        if (!groupedRows) {
            this.metrics.measure('Grouping', () => {
                groupedRows = this.createHierarchicalData(data);
                this.datagrid.cache.hierarchicalRows = groupedRows;
            });
        }

        // Get only visible rows based on expansion state
        const visibleRows = this.getVisibleRows();

        // Update cache and pagination
        this.metrics.measure('Cache Update', () => {
            this.datagrid.cache.rows = visibleRows;
           // this.datagrid.features.pagination.pageCount = this.datagrid.features.pagination.getPageCount(visibleRows);
            this.datagrid.cache.paginatedRows = this.paginateRows(visibleRows);
        });

        // this has to run always
        this.datagrid.features.rowPinning.updatePinnedRows();


    }

    private processRegularData(data: TOriginalRow[]): void {

        // Transform into basic rows
        let basicRows: GridRow<TOriginalRow>[];

        this.metrics.measure('Data Transformation', () => {
            basicRows = this.createBasicRows(data);
            this.datagrid.cache.rows = basicRows;

        });

        // this has to run always
        this.metrics.measure('Row Pinning', () => {
            this.datagrid.features.rowPinning.updatePinnedRows();
        });


        this.datagrid.features.pagination.visibleRowsCount = data!.length;
        //this.datagrid.features.pagination.pageCount = this.datagrid.features.pagination.getPageCount(data);
        // Apply pagination
        this.datagrid.cache.paginatedRows = this.paginateRows(basicRows!);
    }

    // Register custom aggregation function
    registerAggregationFn(name: string, fn: AggregationFn): void {
        this.customAggregationFns.set(name, fn);
    }

    // Get aggregation function
    private getAggregationFn(aggregateType: string | { type: string, fn?: AggregationFn }): AggregationFn | null {
        if (typeof aggregateType === 'string') {
            return aggregationFunctions[aggregateType] || this.customAggregationFns.get(aggregateType) || null;
        }

        if (aggregateType.fn) {
            return aggregateType.fn;
        }

        return aggregationFunctions[aggregateType.type] ||
            this.customAggregationFns.get(aggregateType.type) ||
            null;
    }


    private calculateAggregations(
        column: AccessorColumn<TOriginalRow> | ComputedColumn<TOriginalRow>,
        groupRows: TOriginalRow[]
    ): Aggregation[] {
        const config = column.aggregate;
        if (!config) return [];

        // Handle array of aggregations
        if (Array.isArray(config)) {
            return config.map(aggConfig => {
                const aggType = typeof aggConfig === 'string' ? aggConfig : aggConfig.type;
                const aggFn = this.getAggregationFn(aggConfig);
                if (!aggFn) return null;

                const values = groupRows.map(row => column.accessorFn(row));
                return {
                    type: aggType,
                    value: aggFn(values),
                    columnId: column.columnId
                };
            }).filter((agg): agg is Aggregation => agg !== null);
        }

        // Handle single aggregation
        const aggType = typeof config === 'string' ? config : config.type;
        const aggFn = this.getAggregationFn(config);
        if (!aggFn) return [];

        const values = groupRows.map(row => column.accessorFn(row));
        return [{
            type: aggType,
            value: aggFn(values),
            columnId: column.columnId
        }];
    }

    createHierarchicalData(data: TOriginalRow[]): GridRow<TOriginalRow>[] {
        const groupCols = this.datagrid.features.grouping.groupByColumns;
        if (!groupCols.length) return this.createBasicRows(data);

        const groupByLevel = (
            rows: TOriginalRow[],
            depth: number,
            parentPath = ''
        ): GridRow<TOriginalRow>[] => {
            const groups = new Map<string, TOriginalRow[]>();

            if (depth >= groupCols.length) return this.createBasicRows(rows, parentPath);

            const column = findColumnById(flattenColumnStructureAndClearGroups(this.datagrid.columns), groupCols[depth]);

            if (!column) throw new Error(`Invalid group column: ${groupCols[depth]}`);
            if (isGroupColumn(column)) throw new Error(`Cannot group by group column: ${groupCols[depth]}`);
            if (column.type === 'display') throw new Error(`Cannot group by display column: ${groupCols[depth]}`);

            // Group rows by current column using getGroupValueFn if available
            rows.forEach(row => {
                const groupValue = column.getGroupValueFn
                    ? column.getGroupValueFn(row)
                    : column.accessorFn(row);

                const groupKey = String(groupValue ?? 'Unknown');
                const group = groups.get(groupKey) ?? [];
                group.push(row);
                groups.set(groupKey, group);
            });

            // Create group rows with aggregation
            return Array.from(groups.entries()).map(([key, groupRows], index) => {
                const aggregations = flattenColumnStructureAndClearGroups(this.datagrid.columns)
                    .filter(col =>
                        (col.type === 'accessor' || col.type === 'computed') &&
                        col.aggregate
                    )
                    .flatMap(col => {
                        col = col as AccessorColumn<TOriginalRow> | ComputedColumn<TOriginalRow>;
                        return this.calculateAggregations(col, groupRows);
                    });

                return {
                    index: parentPath ? `${parentPath}-${index + 1}` : String(index + 1),
                    identifier: depth === 0 ? key : `${parentPath}|${key}`,
                    groupKey: groupCols[depth],
                    groupValue: [key],
                    depth,
                    // isExpanded: false,
                    children: groupByLevel(groupRows, depth + 1, `${parentPath}${index + 1}`),
                    aggregations: aggregations,
                    isExpanded: () => this.datagrid.features.rowExpanding.isRowExpanded(key),
                    isGroupRow: function (): this is GridGroupRow<TOriginalRow> {
                        return true;
                    },
                };
            });
        };

        return groupByLevel(data, 0);
    }

    private isGroupRow(row: GridRow<TOriginalRow>): row is GridGroupRow<TOriginalRow> {
        return 'groupKey' in row && 'children' in row;
    }

    private flattenExpandedGroups(rows: GridRow<TOriginalRow>[]): GridRow<TOriginalRow>[] {
        const flattened: GridRow<TOriginalRow>[] = [];

        for (const row of rows) {
            flattened.push(row);

            if (this.isGroupRow(row) && this.datagrid.features.grouping.expandedGroups.has(row.identifier)) {
                flattened.push(...this.flattenExpandedGroups(row.children));
            }
        }

        return flattened;
    }

    private createBasicRows(rows: TOriginalRow[], parentIndex?: string): GridRow<TOriginalRow>[] {

        return rows.map((row, i) => {
            const identifier = this.datagrid.config.createBasicRowIdentifier(row);
            return {
                identifier,
                index: this.datagrid.config.createBasicRowIndex(row, parentIndex || null, i),
                parentIndex: parentIndex ?? null,
                original: row,
                isExpanded: () => this.datagrid.features.rowExpanding.isRowExpanded(identifier),
                isGroupRow: () => false
            }
        });
    }

    private paginateRows(rows: GridRow<TOriginalRow>[]): GridRow<TOriginalRow>[] {
        const { page, pageSize, manual } = this.datagrid.features.pagination;
        if(manual) return rows;
        const start = (page - 1) * pageSize;
        return rows.slice(start, start + pageSize);
    }


    // Handlers

    handleGroupExpansion(): void {
        const hierarchicalRows = this.datagrid.cache.hierarchicalRows;
        if (!hierarchicalRows) {
            this.processGroupedData(this.datagrid.cache.sortedData || []);
            return;
        }

        this.metrics.measure('Group Expansion', () => {
            const visibleRows = this.getVisibleRows();
            this.datagrid.cache.rows = visibleRows;
           // this.datagrid.features.pagination.pageCount = this.datagrid.features.pagination.getPageCount(visibleRows);
            this.datagrid.cache.paginatedRows = this.paginateRows(visibleRows);
        });
    }

    handlePaginationChange(): void {
        const visibleRows = this.getVisibleRows();
        this.metrics.measure('Pagination', () => {
            this.datagrid.cache.paginatedRows = this.paginateRows(visibleRows);
        });
    }

    // New method to get only the visible rows based on group expansion state
    private getVisibleRows(): GridRow<TOriginalRow>[] {
        if (!this.datagrid.cache.hierarchicalRows) {
            return this.datagrid.cache.rows;
        }

        return this.flattenExpandedGroups(this.datagrid.cache.hierarchicalRows);
    }




}