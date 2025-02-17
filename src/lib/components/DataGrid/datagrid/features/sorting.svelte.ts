import type { DatagridCore } from "../index.svelte";
import type { ColumnId, SortDirection } from "../types";


export type SortingPluginConfig = {
    manualSorting: boolean;
    sortings?: Record<ColumnId,SortDirection>;

    enableMultiSort?: boolean;

    isMultiSortEvent?: (e: unknown) => boolean;
    maxMultiSortColCount?: number;
    onSortingChange?(config: SortingFeature): void;

}

/**
 * This class manages the sorting behavior within the data grid.
 * It allows adding, removing, and changing the sorting direction of columns.
 */
export class SortingFeature {
    datagrid: DatagridCore<any>;
    manualSorting: boolean = $state(false);
    
    sortings: Record<ColumnId, SortDirection> = $state({}); // List of sort configurations, each representing a column's sort state
    sorted = $derived(Object.entries(this.sortings).map(([columnId,value])=> ({ columnId, desc: value == "desc" })));

    enableMultiSort: boolean = $state(true);
    maxMultiSortColCount: number = $state(99);
    onSortingChange: (config: SortingFeature) => void = () => { };
    isMultiSortEvent: (e: unknown) => boolean = $state((e: unknown) => e instanceof MouseEvent && e.shiftKey);

    /**
     * Constructor to initialize the sorting feature with a reference to the data grid.
     * @param datagrid - The data grid instance to associate with this sorting feature.
     */
    constructor(datagrid: DatagridCore<any>, config?: SortingPluginConfig) {
        this.datagrid = datagrid;
        this.initialize(config);
    }

    initialize(config?: SortingPluginConfig) {
        Object.assign(this, config);
    }


    /**
     * Refreshes the indices of the sort configurations, ensuring each config has an up-to-date index.
     */
    refreshIndices() {
       // this.sorted.forEach((config, index) => {
         //   this.sortings[config.columnId].index = index;
       // });
    }

    /**
     * Clears all the sorting configurations, effectively removing any sorting from the grid.
     */
    clearSorting() {
        this.sortings = {};
    }

    /**
     * Removes the sort configuration for a given column.
     * @param columnId - The ID of the column to remove from sorting.
     */
    removeSortConfig(columnId: ColumnId) {
        this.sortings[columnId] = null;
        delete this.sortings[columnId];
        this.refreshIndices(); // Refresh indices after removing a sort config
    }

    // /**
    //  * Finds the index of a given column in the sorting configuration.
    //  * @param columnId - The ID of the column to find.
    //  * @returns The index of the column in the sort configuration array, or -1 if not found.
    //  */
    // findIndex(columnId: ColumnId): number {
    //     return this.sortings.findIndex((config) => config.columnId === columnId);
    // }

    /**
     * Changes the sorting direction (ascending/descending) for a specified column.
     * @param columnId - The ID of the column to update.
     * @param desc - The desired sorting direction; true for descending, false for ascending.
     */
    changeDirection(columnId: ColumnId, desc: SortDirection) {
        // Update the sort direction for the specified column
        this.sortings[columnId] = desc;
    }

    /**
     * Adds a new sort configuration for a specified column.
     * @param columnId - The ID of the column to add a sorting configuration for.
     * @param desc - The sorting direction; true for descending, false for ascending.
     */
    addSortConfig(columnId: ColumnId, desc: SortDirection) {
        const size = this.sorted.length;
        if (size >= this.maxMultiSortColCount) return;
        this.sortings = {...this.sortings, [columnId]: desc};
    }

    /**
     * Checks if a given column is currently sorted.
     * Optionally checks the sorting direction (ascending or descending).
     * @param columnId - The ID of the column to check.
     * @param desc - Optional; if specified, checks for the sorting direction.
     * @returns True if the column is sorted, optionally with the specified direction.
     */
    isColumnSorted(columnId: ColumnId, desc?: SortDirection): boolean {
        if (desc === undefined) {
            // Return true if the column is sorted in any direction
            return !!this.sortings?.[columnId];
        }
        
        // Return true if the column is sorted with the specified direction
        return this.sortings?.[columnId] == desc;
    }
}
