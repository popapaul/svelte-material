import { untrack } from "svelte";
import { ColumnManager } from "./features/column-manager.svelte";
import { FilteringManager, type FilteringFeature, type FilteringState } from "./features/filtering-manager.svelte";
import { GroupingManager, type GroupingFeature, type GroupingManagerState } from "./features/grouping-manager.svelte";
import { PaginationManager, type PaginationFeature, type PaginationState } from "./features/pagination-manager.svelte";
import { RowManager, type RowExpansionMode, type RowManagerState, type RowSelectionMode } from "./features/row-manager.svelte";
import { SortingManager, type SortingFeature, type SortingState } from "./features/sorting-manager.svelte";
import { ColumnProcessor, type Column, type ColumnProcessorInstance } from "./processors/column-processor.svelte";
import { DataProcessor, type DataProcessorInstance, type Row } from "./processors/data-processor.svelte";
import type { ColumnDef } from "./types";
export * from "./types";
export type { Row, Column };
export interface DatagridOriginal<TData, TCustomKeys extends string = never> {
    data: TData[];
    columns: ColumnDef<TData, TCustomKeys>[]
}

export interface DatagridInstance<TData, TCustomKeys extends string = never> {
    original: DatagridOriginal<TData, TCustomKeys>

    rows: Row<TData>[]
    columns: Column<TData, TCustomKeys>[]

    sorting: SortingFeature<TData>
    filtering: FilteringFeature<TData>;
    grouping: GroupingFeature
    pagination: PaginationFeature

    columnManager: ColumnManager<TData>


    dataProcessor: DataProcessorInstance<TData>
    columnsProcessor: ColumnProcessorInstance<TData>


    isRowVisible(row: Row<TData>): boolean
    getVisibleRows(page: number, pageSize: number): Row<TData>[]
    getVisibleRowCount(): number
}

export type PaginationStateConfig = Partial<Omit<PaginationState, 'pageCount'>>
export type GroupingStateConfig = Partial<Omit<GroupingManagerState, '_groupedDataCache'>>
export type FilteringStateConfig<TData> = Partial<FilteringState<TData>>
export type RowManagerStateConfig = Partial<RowManagerState> & {
    selectionMode?: RowSelectionMode
    expansionMode?: RowExpansionMode
}
export type SortingStateConfig<TData> = Partial<SortingState<TData>>

export type DatagridConfig<T, C> = {
    columns: C[];
    data: T[];
    pagination?: PaginationStateConfig;
    grouping?: GroupingStateConfig;
    filtering?: FilteringStateConfig<T>;
    rowManager?: RowManagerStateConfig;
    sorting?: SortingStateConfig<T>;
};

export class Datagrid<TData, TCustomKeys extends string = never> implements DatagridInstance<TData, TCustomKeys> {
   

    rows = $state<Row<TData>[]>([]);
    columns = $state<Column<TData, TCustomKeys>[]>([]);
    original: DatagridOriginal<TData, TCustomKeys> = $state({
        data: [] as TData[],
        columns: [] as ColumnDef<TData, TCustomKeys>[],
    })
    sorting: SortingFeature<TData> = new SortingManager(this);
    filtering: FilteringFeature<TData> = new FilteringManager(this);
    grouping: GroupingFeature = new GroupingManager(this);
    pagination: PaginationFeature = new PaginationManager(this);
    columnManager: ColumnManager<TData> = new ColumnManager<TData>(this);
    rowManager: RowManager<TData> = new RowManager(this);

    dataProcessor: DataProcessorInstance<TData> = new DataProcessor(this);
    columnsProcessor: ColumnProcessorInstance<TData> = new ColumnProcessor<TData>(this);

    constructor(config: DatagridConfig<TData, ColumnDef<TData, TCustomKeys>>) {
        this.original = { data: config.data, columns: config.columns };
       
        $effect(()=>{
            this.original.data;
            untrack(()=>{
                this.initialize(config);
            })
        })
    }

    private initialize(config: DatagridConfig<TData, ColumnDef<TData, TCustomKeys>>): void {
        this.pagination.initialize(config.pagination || {});
        this.grouping.initialize(config.grouping || {});
        this.filtering.initialize(config.filtering || {});
        this.rowManager.initialize(config.rowManager || {});
        this.sorting.initialize(config.sorting || {});

        //this.columnsProcessor.transform();
        this.dataProcessor.process();
        this.columnsProcessor.calculateFacets(this.dataProcessor.processedRowsCache);
        this.filtering.assignFuseInstance(this.original.data);
        this.pagination.updatePageCount()
    }

    refreshVisibleRows(): void {
        this.rows = this.getVisibleRows(this.pagination.page, this.pagination.pageSize);
    }


    // Used when the data should be updated eg. pagination
    refresh(operation: () => void): void {
        const timeStart = performance.now();
        operation();
        this.refreshVisibleRows();
        console.log(`Operation took ${performance.now() - timeStart}ms`)
    }

    // Used when the data should be reloaded
    reload(command: () => void): void {
        const timeStart = performance.now();
        command();
        this.dataProcessor.process()
        this.pagination.updatePageCount()
        console.log(`Execution took ${performance.now() - timeStart}ms`)

    }


    getVisibleRows(page: number, pageSize: number): Row<TData>[] {
        const visibleRows = this.dataProcessor.processedRowsCache.filter(row => this.isRowVisible(row));
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return visibleRows.slice(startIndex, endIndex);
    }

    isRowVisible(row: Row<TData>): boolean {
        if (!row.parentId) return true;

        let currentParentId: string | null = row.parentId;
        while (currentParentId) {
            if (!this.grouping.state.expandedRows.has(currentParentId)) {
                return false;
            }
            const parentRow = this.dataProcessor.rowsMap.get(currentParentId);
            currentParentId = parentRow?.parentId ?? null;
        }

        return true;
    }
    getVisibleRowCount(): number {
        return this.dataProcessor.processedRowsCache.filter(row => this.isRowVisible(row)).length;
    }
}