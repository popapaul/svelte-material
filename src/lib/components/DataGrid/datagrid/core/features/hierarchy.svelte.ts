import { SvelteSet } from "svelte/reactivity";
import type { DatagridCore } from "../index.svelte";
import type { GridHierarchyRow, GridRow, GridRowIdentifier } from "../types";


/**
 * Represents the state of row expansion functionality within the grid,
 * including expanded row identifiers, expansion mode, and max expanded rows.
 */
export type HierarchyState<TOriginalRow> = {

    hasChildren: (row: GridRow<TOriginalRow>)=> boolean;

    getChildren: (row: GridRow<TOriginalRow>)=> Promise<TOriginalRow[]>|TOriginalRow[];
};

/**
 * Partial configuration for row expansion, allowing for customized initial state.
 */
export type HierarchyFeatureConfig<TOriginalRow> = Partial<HierarchyState<TOriginalRow>>;

/**
 * Interface extending RowExpansionState for row expansion functionality in the grid.
 */
export type IHierarchyFeature<TOriginalRow> = HierarchyState<TOriginalRow>;

/**
 * Manages row expansion functionality within the data grid.
 * Allows expanding and collapsing rows, with the state tracked via expanded row IDs.
 * 
 * @template TOriginalRow The type of the original row data in the grid.
 */
export class HierarchyFeature<TOriginalRow = any> implements IHierarchyFeature<TOriginalRow> {
    /** The data grid instance this feature belongs to */
    datagrid: DatagridCore<TOriginalRow>;

    enabled: boolean = $state(false);

      /** Set containing the IDs of currently expanded rows */
    expandedRowIds: SvelteSet<GridRowIdentifier> = new SvelteSet();

    hasChildren: (row: GridRow<TOriginalRow>)=> boolean;

    getChildren: (row: GridRow<TOriginalRow>)=> Promise<TOriginalRow[]>;

    /**
     * Creates an instance of the HierarchyFeature.
     * 
     * @param {DatagridCore<TOriginalRow>} datagrid The data grid instance.
     * @param {RowExpansionConfig} [config] Optional configuration to initialize the state.
     */
    constructor(datagrid: DatagridCore<TOriginalRow>, config?: HierarchyFeatureConfig<TOriginalRow>) {
        this.datagrid = datagrid;
        Object.assign(this, config);
        this.enabled = !!config.getChildren && !!config.hasChildren;
    }

    /**
     * Expands a specific row by its identifier.
     * 
     * @param {GridRowIdentifier} identifier The identifier of the row to expand.
     * Emits 'onRowExpand' and adds the row to the expanded rows set.
     * If the expansion limit is reached, an event 'onRowExpansionLimitExceeded' is emitted.
     */
    private async expandRow(identifier: GridRowIdentifier) {
        const row = this.datagrid.rows.findRowById(identifier); // Get the row object by its identifier
        const children = await this.getChildren(row); // Fetch the children of the row
    
        const hierarchyRow = this.makeHierarchyRow(row, children); // Create a hierarchy row with the fetched children
        Object.assign(row, hierarchyRow); // Update the original row with the hierarchy row properties
        this.expandedRowIds.add(identifier); // Add the identifier to the expanded rows set

        this.datagrid.processors.data.processHiearchyData(); // Process the hierarchy data
    }

    private makeHierarchyRow(row: GridRow<TOriginalRow>, childRows: TOriginalRow[]): GridHierarchyRow<TOriginalRow> {
        const depth = "depth" in row ? row.depth : 0;
        const children = this.datagrid.processors.data.createBasicRows(childRows, row.index).map((childRow, index) => {
            return {
                ...childRow,
                depth: depth + 1,
            }
        });

        const parentRow: GridHierarchyRow<TOriginalRow> = {
            ...row,
            identifier:String(row.identifier),
            depth,
            isExpanded: () => this.isRowExpanded(row.identifier), // Check if the row is expanded
            isHierarchyRow: function (): this is GridHierarchyRow<TOriginalRow> {
                return true;
            },
            children
        };
        return parentRow;
    }

     /**
     * Toggles the expansion state of a specific row.
     * If the row is expanded, it will be collapsed. If it is collapsed, it will be expanded.
     * 
     * @param {GridRowIdentifier} identifier The identifier of the row to toggle.
     */
     toggleRowExpansion(identifier: GridRowIdentifier): void {
        if (this.isRowExpanded(identifier)) {
            this.collapseRow(identifier);
        } else {
            this.expandRow(identifier);
        }
    }
    /**
     * Collapses a specific row by its identifier.
     * 
     * @param {GridRowIdentifier} identifier The identifier of the row to collapse.
     * Emits 'onRowCollapse' and removes the row from the expanded rows set.
     */
    private collapseRow(identifier: GridRowIdentifier): void {
        this.expandedRowIds.delete(identifier);
        this.datagrid.processors.data.processHiearchyData(); // Process the hierarchy data
    }
    isRowExpanded(rowId: GridRowIdentifier): boolean {
        return this.expandedRowIds.has(rowId); // Check if the row ID is in the expanded set
    }
}
