import type { AnyColumn, GroupColumn } from "../types";
import type { DatagridCore } from "../index.svelte";
import type { ColumnId, FilterableColumn, FilterOperator, GridBasicRow, GridGroupRow, GridRowIdentifier, LeafColumn, PinningPosition } from "../types";
import { findColumnById, flattenColumnStructureAndClearGroups, flattenColumnStructurePreservingGroups } from "../utils.svelte";
import type { CreateGroupParams } from "../features/column-grouping.svelte";



export class HandlersManager {
    datagrid: DatagridCore<any>;

    constructor(datagrid: DatagridCore<any>) {
        this.datagrid = datagrid;
    }

    sorting = {
        toggleColumnSorting: (column: LeafColumn<any>, multisort: boolean) => {
            multisort = this.datagrid.features.sorting.isMultiSortEvent(multisort);
            const datagrid = this.datagrid;
            const columnId = column.columnId;

            if (!column.options.sortable) return;


            const isColumnSorted = this.datagrid.features.sorting.sortings[columnId] != undefined;
            const isColumnSortedAscending = this.datagrid.features.sorting.sortings[columnId] == "asc";
          
          
            const singleColumnSort = () => {
               delete this.datagrid.features.sorting.sortings[columnId] ;
                if (!isColumnSorted) {
                    this.datagrid.features.sorting.sortings = {[columnId]: "asc"};
                }
                else if (isColumnSortedAscending) {
                    this.datagrid.features.sorting.sortings = {[columnId]: "desc"};
                }
            }   
            

            const multipleColumnSort = () => {
                if (!isColumnSorted) {
                    const isOverMaxColCount = Object.keys(datagrid.features.sorting.sortings).length >= datagrid.features.sorting.maxMultiSortColCount;
                    if (isOverMaxColCount) {
                        // remove first sorting config
                        console.log('removing first sorting config');
                        datagrid.features.sorting.removeSortConfig(datagrid.features.sorting.sorted[0].columnId);
                    }

                    datagrid.features.sorting.addSortConfig(columnId, false);
                } else if (isColumnSortedAscending) {
                    datagrid.features.sorting.changeDirection(columnId, true);
                } else {
                    datagrid.features.sorting.removeSortConfig(columnId);

                }
            }

            if (multisort) multipleColumnSort();
            else singleColumnSort();

            datagrid.cache.invalidate('sortedData');
            datagrid.processors.data.executeFullDataTransformation();

            datagrid.features.sorting.onSortingChange(datagrid.features.sorting);
        },


        sortColumnAscending: (column: LeafColumn<any>) => {
            const isColumnSorted = this.datagrid.features.sorting.isColumnSorted(column.columnId);
            if (isColumnSorted) this.datagrid.features.sorting.changeDirection(column.columnId, false);
            else this.datagrid.features.sorting.addSortConfig(column.columnId, true);

            this.datagrid.processors.data.executeFullDataTransformation();
        },

        sortColumnDescending: (column: LeafColumn<any>) => {
            const isColumnSorted = this.datagrid.features.sorting.isColumnSorted(column.columnId);
            if (isColumnSorted) this.datagrid.features.sorting.changeDirection(column.columnId, true);
            else this.datagrid.features.sorting.addSortConfig(column.columnId, false);

            this.datagrid.processors.data.executeFullDataTransformation();
        },


        sortColumn: (column: LeafColumn<any>, desc: boolean) => {
            if (desc) {
                const isColumnSorted = this.datagrid.features.sorting.isColumnSorted(column.columnId);
                if (isColumnSorted) this.datagrid.features.sorting.changeDirection(column.columnId, true);
                else this.datagrid.features.sorting.addSortConfig(column.columnId, true);
            } else {
                const isColumnSorted = this.datagrid.features.sorting.isColumnSorted(column.columnId);
                if (isColumnSorted) this.datagrid.features.sorting.changeDirection(column.columnId, false);
                else this.datagrid.features.sorting.addSortConfig(column.columnId, false);
            }
            this.datagrid.processors.data.executeFullDataTransformation();
        },


        unSortColumn: (column: LeafColumn<any>) => {
            this.datagrid.features.sorting.removeSortConfig(column.columnId);
            this.datagrid.processors.data.executeFullDataTransformation();
        }

    }
    filtering = {
        changeFilterOperator: (columnId: string, operator: FilterOperator) => {
            this.datagrid.features.filtering.changeConditionOperator(columnId, operator);
            this.datagrid.cache.invalidate('filteredData');
            this.datagrid.processors.data.executeFullDataTransformation();
        },

        updateFilterCondition: (props: {
            column: AnyColumn<any>,
            value: any,
        }) => {
            // TODO this should be rewritten and placed somewhere else, maybe in filtering feature
            // TODO handle eg empty without value etc
            const { value } = props;
            let column = props.column
            if (column === null || !column.isFilterable()) return;
            column = column as FilterableColumn<any>

            if (!column) return;
            // Find existing condition
            const conditionIndex = this.datagrid.features.filtering.conditions.findIndex(c => c.columnId === column.columnId);

            // if (value === '' || value === null || value === undefined) {
            //     // If value is empty, remove the condition (do not filter)
            //     if (conditionIndex > -1) {
            //         this.datagrid.features.filtering.conditions.splice(conditionIndex, 1);
            //     }
            //     return;
            // }

            if (conditionIndex === -1) {
                // If condition doesn't exist, add a new one
                this.datagrid.features.filtering.conditions.push({
                    columnId: String(column.columnId),
                    operator: 'contains',
                    accessorFn: column.accessorFn,
                    value
                });
            } else {
                // Update existing condition value
                this.datagrid.features.filtering.conditions[conditionIndex].value = value;
            }
        }
    }
    grouping = {
        change: (values: string[]) => {

            const newGroupBy: ColumnId[] = values
                .map((option) => {
                    const column = findColumnById(flattenColumnStructureAndClearGroups(this.datagrid.columns), option);
                    if (!column) return null;
                    if (column.options.groupable === false) return null;
                    return option;
                })
                .filter((group): group is ColumnId => group !== null); // Type guard to filter out null values

            this.datagrid.features.grouping.groupByColumns = newGroupBy;
            this.datagrid.features.pagination.goToFirstPage();
            this.datagrid.cache.invalidateGroupedRowsCache();
            this.datagrid.processors.data.executeFullDataTransformation();
        },
        toggle: (columnId: ColumnId) => {
            const column = findColumnById(flattenColumnStructureAndClearGroups(this.datagrid.columns), columnId);
            if (!column) return;
            if (column.options.groupable === false) return;

            if (this.datagrid.features.grouping.groupByColumns.includes(columnId)) {
                this.datagrid.features.grouping.groupByColumns = this.datagrid.features.grouping.groupByColumns.filter((id) => id !== columnId);
            } else {
                this.datagrid.features.grouping.groupByColumns = [...this.datagrid.features.grouping.groupByColumns, columnId];
            }
            this.datagrid.features.pagination.goToFirstPage();
            this.datagrid.cache.invalidateGroupedRowsCache();
            this.datagrid.processors.data.executeFullDataTransformation();
        }
    }
    columnPinning = {
        pinColumn: (columnId: string, position: PinningPosition) => {
            const column = findColumnById(flattenColumnStructurePreservingGroups(this.datagrid.columns), columnId);
            if (!column) return;
            this.datagrid.features.columnPinning.changeColumnPinningPosition(column, position);
            this.datagrid.processors.column.refreshColumnPinningOffsets();

        },
        changeColumnPinningPosition: (columnId: string, position: PinningPosition) => {
            const column = findColumnById(flattenColumnStructureAndClearGroups(this.datagrid.columns), columnId);
            if (!column) throw new Error(`Column ${columnId} not found`);
            this.datagrid.features.columnPinning.changeColumnPinningPosition(column, position);
            this.datagrid.processors.column.refreshColumnPinningOffsets();
        }
    }
    columnOrdering = {
        moveLeft: (columnId: ColumnId) => {
            this.datagrid.features.columnOrdering.moveLeft(columnId);
        },
        moveRight: (columnId: ColumnId) => {
            this.datagrid.features.columnOrdering.moveRight(columnId)
        },
        moveColumnToPosition: ({ columnId, targetGroupColumnId }: { columnId: ColumnId, targetGroupColumnId: string }) => {
            this.datagrid.features.columnOrdering.moveColumnToPosition(columnId, targetGroupColumnId);
        }
    }
    columnGrouping = {
        createGroup: ({ newGroupName, selectedColumns }: CreateGroupParams) => {
            this.datagrid.features.columnGrouping.createGroup({ newGroupName, selectedColumns });
        },
        deleteGroupColumn: (groupColumn: GroupColumn<any>) => {
            this.datagrid.features.columnGrouping.deleteGroupColumn(groupColumn);
        }
    }
    rowSelection = {
        selectRowsOnPage: () => {
            const rowsOnPage = (this.datagrid.cache.paginatedRows || []).filter(row => !row.isGroupRow()) as GridBasicRow<any>[];
            const ids = rowsOnPage.map(row => row.identifier);
            this.datagrid.features.rowSelection.selectRows(ids);
        },
        unselectRowsOnPage: () => {
            const rowsOnPage = (this.datagrid.cache.paginatedRows || []).filter(row => !row.isGroupRow()) as GridBasicRow<any>[];
            const ids = rowsOnPage.map(row => row.identifier);
            this.datagrid.features.rowSelection.unselectRows(ids);
        },
        selectAllRows: () => {
            const rows = (this.datagrid.cache.rows || []).filter(row => !row.isGroupRow()) as GridBasicRow<any>[];
            const ids = rows.map(row => row.identifier);
            this.datagrid.features.rowSelection.selectRows(ids);
        },
        unselectAllRows: () => {
            const rows = (this.datagrid.cache.rows || []).filter(row => !row.isGroupRow()) as GridBasicRow<any>[];
            const ids = rows.map(row => row.identifier);
            this.datagrid.features.rowSelection.unselectRows(ids);
        },
        toggleRowSelection: (rowIdentifier: GridRowIdentifier) => {
            this.datagrid.features.rowSelection.toggleRowSelection(rowIdentifier);
            this.datagrid.features.rowSelection.onRowSelectionChange?.();
        }
    }
    rowPinning = {
        pinRowTop: (rowIdentifier: GridRowIdentifier) => {
            this.datagrid.features.rowPinning.pinRowTop(rowIdentifier);
        },
        pinRowBottom: (rowIdentifier: GridRowIdentifier) => {
            this.datagrid.features.rowPinning.pinRowBottom(rowIdentifier);
        },
        unpinRow: (rowIdentifier: GridRowIdentifier) => {
            this.datagrid.features.rowPinning.unpinRow(rowIdentifier);
        }
    }
    rowExpanding = {
        toggleRowExpansion: (rowIdentifier: GridRowIdentifier) => {
            this.datagrid.features.rowExpanding.toggleRowExpansion(rowIdentifier);
        },
        toggleGroupRowExpansion: (row: GridGroupRow<any>) => {
            this.datagrid.rows.toggleGroupRowExpansion(row);
        }
    }
    columnSizing = {
        updateColumnSize: (columnId: ColumnId, width: number) => {
            this.datagrid.features.columnSizing.updateColumnSize(columnId, width);
            this.datagrid.processors.column.refreshColumnPinningOffsets();

        }
    }
    columnVisibility = {
        toggleColumnVisibility: (columnId: ColumnId) => {
            this.datagrid.features.columnVisibility.toggleColumnVisibility(columnId);
        }
    }
    globalSearch = {
        updateValue: (value: string) => {
            this.datagrid.features.globalSearch.value = value;
            this.datagrid.features.pagination.goToFirstPage();
            this.datagrid.cache.invalidate('filteredData');
            this.datagrid.processors.data.executeFullDataTransformation();
        }
    }
    pagination = {
        goToPrevPage: () => {
            this.datagrid.refresh(() => this.datagrid.features.pagination.goToPrevPage(), {
                recalculateAll: false,
                recalculateGroups: false,
                recalculatePagination: true
            })
        },
        goToNextPage: () => {
            this.datagrid.refresh(() => this.datagrid.features.pagination.goToNextPage(), {
                recalculateAll: false,
                recalculateGroups: false,
                recalculatePagination: true
            })
        },
        changePageSize: (newPageSize: number) => {
            this.datagrid.refresh(() => this.datagrid.features.pagination.setPageSize(newPageSize), {
                recalculatePagination: true
            });
        },
        goToPage: (newPage: number) => {
            this.datagrid.refresh(() => {
                this.datagrid.features.pagination.page = Math.min(
                    Math.max(newPage, 1),
                    this.datagrid.features.pagination.pageCount
                );
            });
        }

    }
}

