import type { Component, Snippet } from "svelte";
import type { DatagridCore } from "./index.svelte";
import type { LifecycleHooks } from "./managers/lifecycle-hooks-manager.svelte";
import type { SortingFeature } from "./features";
import type { PaginationFeature, PaginationFeatureConfig } from "./features/pagination.svelte";
import type { ColumnFilteringFeature, ColumnFilteringFeatureConfig } from "./features/column-filtering.svelte";
import type { ColumnFacetingFeature, ColumnFacetingFeatureConfig } from "./features/column-faceting.svelte";
import type { GlobalSearchFeature, GlobalSearchFeatureConfig } from "./features/global-search.svelte";
import type { GroupingFeature, GroupingFeatureConfig } from "./features/grouping.svelte";
import type { RowExpansionFeature, RowExpansionConfig } from "./features/row-expanding.svelte";
import type { RowSelectionFeature, RowSelectionFeatureConfig } from "./features/row-selection.svelte";
import type { RowPinningFeature, RowPinningFeatureConfig } from "./features/row-pinning.svelte";
import type { ColumnMovementDirection, ColumnOrderingFeature, ColumnOrderingFeatureConfig } from "./features/column-ordering.svelte";
import type { ColumnGroupingFeature, ColumnGroupingPluginConfig } from "./features/column-grouping.svelte";
import type { ColumnPinningFeature, ColumnPinningFeatureConfig } from "./features/column-pinning.svelte";
import type { ColumnSizingFeature, ColumnSizingFeatureConfig } from "./features/column-sizing.svelte";
import type { ColumnVisibilityFeature, ColumnVisibilityPluginConfig } from "./features/column-visibility.svelte";
import type { SortingFeatureConfig } from "./features/sorting.svelte";
import type { CommonColumnCreationProps, DotNestedKeys } from "./column-creation/types";
import type { HierarchyFeatureConfig } from "./features/hierarchy.svelte";

// Specific interfaces for different column types


/**
 * Column and Identifier Types
 */
// export type ColumnId<T = any> = keyof T | (string & {})
export type ColumnId = string
export type ExtractColumnIds<T> = T extends AccessorColumn<any, any>[]
    ? T[number]["columnId"]
    : never;
export type ColumnType = "accessor" | "computed" | "display" | "group";

/**
 * Primitive and Cell Value Types
 */
export type Primitive = string | number | boolean | null | undefined;
export type CellValue = Primitive | Record<string, any> | Array<any>;
export type GetValueFn<TOriginalRow> = (row: TOriginalRow) => CellValue;
export type GetGroupValue<TOriginalRow> = (row: TOriginalRow) => CellValue;
export type FormatterFn<TOriginalRow> = (row: TOriginalRow) => CellValue;

/**
 * Column State Types
 */
export type ColumnSizeState = {
    width?: number;
    minWidth?: number;
    maxWidth?: number;
    grow?: boolean;
};

export type ColumnPinningPosition = "left" | "right" | "none";

export type ColumnPinningState = {
    position: ColumnPinningPosition
    offset: number;
};

/**
 * Row and Group Types
 */
export type GridRowIdentifier = GridGroupRowIdentifier | GridBasicRowIdentifier;
export type GridGroupRowIdentifier = string;
export type GridBasicRowIdentifier = string;
export type RowPinningPosition = "top" | "bottom" | false;

export type GridGroupRow<TOriginalRow> =  Omit<GridBasicRow<TOriginalRow>, "original"> & {
    identifier: GridGroupRowIdentifier;
    groupKey: string;
    groupValue: any[];
    depth: number;
    original?: TOriginalRow;
    children: GridRow<TOriginalRow>[];
    aggregations: Aggregation[];
};

export type GridHierarchyRow<TOriginalRow> = GridBasicRow<TOriginalRow> & {
    identifier: GridGroupRowIdentifier;
    depth: number;
    children: GridRow<TOriginalRow>[];
};

export type GridBasicRow<TOriginalRow> = {
    identifier: GridRowIdentifier;
    index: string;
    depth?: number;
    parentIndex?: string;
    original: TOriginalRow;
    isExpanded: () => boolean;
    isGroupRow: () => this is GridGroupRow<TOriginalRow>;
    isHierarchyRow: () => this is GridHierarchyRow<TOriginalRow>;
};

export type GridRow<TOriginalRow> =
    | GridGroupRow<TOriginalRow>
    | GridHierarchyRow<TOriginalRow>
    | GridBasicRow<TOriginalRow>;

/**
 * Leaf Column Types
 */
export type LeafColumn<TOriginalRow, TMeta = any> =
    | AccessorColumn<TOriginalRow, TMeta>
    | ComputedColumn<TOriginalRow, TMeta>
    | DisplayColumn<TOriginalRow, TMeta>;

export type SortableColumn<TOriginalRow> =
    | AccessorColumn<TOriginalRow>
    | ComputedColumn<TOriginalRow>;

export type FilterableColumn<TOriginalRow> =
    | AccessorColumn<TOriginalRow>
    | ComputedColumn<TOriginalRow>;

/**
 * Aggregation Types
 */
export type Aggregation = {
    type: string;
    value: number;
    columnId: ColumnId;
};

export type AggregationFn = (values: any[]) => any;

export type BaseAggregationConfig =
    | "sum"
    | "min"
    | "max"
    | "extent"
    | "mean"
    | "median"
    | "unique"
    | "uniqueCount"
    | "count"
    | { type: string; fn?: AggregationFn };

export type AggregationConfig =
    | BaseAggregationConfig
    | BaseAggregationConfig[];

/**
 * Custom Cell and Header Types
 */
export type CustomCellComponentWithProps = {
    component: Component<any>;
    props?: any;
};


// Cell
export type CustomCellProps<TOriginalRow> = {
    datagrid: DatagridCore<TOriginalRow>;
    column: LeafColumn<TOriginalRow>;
    row: GridBasicRow<TOriginalRow>;
    original: TOriginalRow;
};

export type CustomCell<TOriginalRow> = Snippet<[CustomCellProps<TOriginalRow>]>// | ((props:CustomCellProps<TOriginalRow>)=> | string | HTMLElement | CustomCellComponentWithProps);

// Aggregated Cell
export type AggregateCellProps<TOriginalRow> = {
    datagrid: DatagridCore<TOriginalRow>;
    column: LeafColumn<TOriginalRow>;
    row: GridGroupRow<TOriginalRow>;
};
export type AggregatedCell<TOriginalRow> = Snippet<[AggregatedCell<TOriginalRow>]> //( props: AggregateCellProps<TOriginalRow>) => string | HTMLElement | CustomCellComponentWithProps;

// Grouped Cell
export type GroupedCellProps<TOriginalRow> = {
    datagrid: DatagridCore<TOriginalRow>;
    column: LeafColumn<TOriginalRow>;
    row: GridGroupRow<TOriginalRow>;
};

export type GroupedCell<TOriginalRow> =  Snippet<[GroupedCellProps<TOriginalRow>]> // ( props: GroupedCellProps<TOriginalRow>) => string | HTMLElement | CustomCellComponentWithProps;

// Header Cell
export type HeaderCellProps<TOriginalRow> = {
    column: ColumnDef<TOriginalRow>;
    datagrid: DatagridCore<TOriginalRow>;
};

export type HeaderCell<TOriginalRow> = Snippet<[HeaderCellProps<TOriginalRow>]> // (props: HeaderCellProps) => string | HTMLElement | CustomCellComponentWithProps;

/**
 * Sorting Types
 */

export type SortingDirection = "ascending" | "descending" | "intermediate";
export interface Sorting {
    columnId: ColumnId;
    direction: SortingDirection
}

/**
 * Pinning Types
 */
export type PinningPosition = "left" | "right" | "none";

/**
 * Filtering Types
 */
export type FilterOperator =
    | "equals"
    | "notEquals"
    | "contains"
    | "notContains"
    | "startsWith"
    | "endsWith"
    | "greaterThan"
    | "lessThan"
    | "greaterThanOrEqual"
    | "lessThanOrEqual"
    | "between"
    | "inList"
    | "notInList"
    | "empty"
    | "notEmpty";

export interface FilterCondition<TOriginalRow> {
    columnId: ColumnId;
    getValueFn: GetValueFn<TOriginalRow>;
    operator: FilterOperator;
    value: any;
    valueTo?: number; // For 'between' operator
}

export type FilteringState<TOriginalRow> = {
    conditions: FilterCondition<TOriginalRow>[];
};

/**
 * Search State
 */
export interface SearchState {
    value: string;
    fuzzy: boolean;
    delay: number;
}

/**
 * Filter Operators
 */
export const filterOperators: FilterOperator[] = [
    "equals",
    "notEquals",
    "contains",
    "notContains",
    "startsWith",
    "endsWith",
    "greaterThan",
    "lessThan",
    "greaterThanOrEqual",
    "lessThanOrEqual",
    "between",
    "inList",
    "notInList",
    "empty",
    "notEmpty",
];

export const numberFilterOperators: FilterOperator[] = [
    "equals",
    "notEquals",
    "greaterThan",
    "lessThan",
    "greaterThanOrEqual",
    "lessThanOrEqual",
    "between",
    "empty",
    "notEmpty",
];

export const stringFilterOperators: FilterOperator[] = [
    "equals",
    "notEquals",
    "contains",
    "notContains",
    "startsWith",
    "endsWith",
    "empty",
    "notEmpty",
];


export type ColumnAlign = 'left' | 'center' | 'right';

export interface AccessorColumn<TOriginalRow, TMeta = any> extends CommonColumnCreationProps<TMeta> {
    type: 'accessor';
    accessorKey: DotNestedKeys<TOriginalRow>;
    getValueFn: GetValueFn<TOriginalRow>;
    formatterFn?: FormatterFn<TOriginalRow>;
    aggregate?: AggregationConfig;
    getGroupValueFn?: GetGroupValue<TOriginalRow>;
    cell?: CustomCell<TOriginalRow>;
    aggregatedCell?: AggregatedCell<TOriginalRow>;
    groupedCell?: GroupedCell<TOriginalRow>;
    headerCell?: HeaderCell<TOriginalRow>;

    isVisible(): boolean;
    isSortable(): boolean;
    isFilterable(): boolean
}

export interface ComputedColumn<TOriginalRow, TMeta = any> extends CommonColumnCreationProps<TMeta> {
    type: 'computed';
    getValueFn: GetValueFn<TOriginalRow>;
    getGroupValueFn?: GetGroupValue<TOriginalRow>;
    cell?: CustomCell<TOriginalRow>;
    aggregatedCell?: AggregatedCell<TOriginalRow>;
    groupedCell?: GroupedCell<TOriginalRow>;
    headerCell?: HeaderCell<TOriginalRow>;
    formatterFn?: FormatterFn<TOriginalRow>;
    aggregate?: AggregationConfig;
   
    isVisible(): boolean;
    isSortable(): boolean;
    isFilterable(): boolean
}

export interface DisplayColumn<TOriginalRow, TMeta = any> extends CommonColumnCreationProps<TMeta> {
    type: 'display';
    cell: CustomCell<TOriginalRow>;
    aggregatedCell?: AggregatedCell<TOriginalRow>;
    groupedCell?: GroupedCell<TOriginalRow>;
    headerCell?: HeaderCell<TOriginalRow>;
  
    isVisible(): boolean;
    isSortable(): boolean;
    isFilterable(): boolean
}

export interface ColumnGroup<TOriginalRow, TMeta = any> extends CommonColumnCreationProps<TMeta> {
    type: 'group';
    headerCell?: HeaderCell<TOriginalRow>;
    columns: ColumnDef<TOriginalRow>[];
    isVisible(): boolean;
    isSortable(): boolean;
    isFilterable(): boolean;
}
// Union type for all column types

export type ColumnDef<TOriginalRow, TMeta = any> =
    AccessorColumn<TOriginalRow, TMeta> |
    ComputedColumn<TOriginalRow, TMeta> |
    DisplayColumn<TOriginalRow, TMeta> |
    ColumnGroup<TOriginalRow, TMeta>;


export type ParentColumnId = string | null;



export type FeatureConstructor<T> = {
    new(datagrid: DatagridCore<any>, config?: any): T;  // Class signature
};

export type InitialState<TOriginalRow> = {
    sorting?: SortingFeatureConfig,
    pagination?: PaginationFeatureConfig,
    filtering?: ColumnFilteringFeatureConfig,
    faceting?: ColumnFacetingFeatureConfig,
    globalSearch?: GlobalSearchFeatureConfig,
    grouping?: GroupingFeatureConfig,
    hierarchy?: HierarchyFeatureConfig<TOriginalRow>,
    rowExpanding?: RowExpansionConfig,
    rowSelection?: RowSelectionFeatureConfig,
    rowPinning?: RowPinningFeatureConfig,
    columnOrdering?: ColumnOrderingFeatureConfig,
    columnGrouping?: ColumnGroupingPluginConfig,
    columnPinning?: ColumnPinningFeatureConfig,
    columnSizing?: ColumnSizingFeatureConfig,
    columnVisibility?: ColumnVisibilityPluginConfig
}


export type DatagridCoreConfig<TOriginalRow, C extends ColumnDef<TOriginalRow> = ColumnDef<TOriginalRow>> = {
    columns: C[];
    data: TOriginalRow[];
    lifecycleHooks?: LifecycleHooks<TOriginalRow>;

    initialState?: InitialState<TOriginalRow>

    measurePerformance?: boolean
    rowIdGetter?: (row: TOriginalRow) => string
    rowIndexGetter?: (row: TOriginalRow) => string

    features?: {
        sorting?: FeatureConstructor<SortingFeature>,
        pagination?: FeatureConstructor<PaginationFeature>,
        filtering?: FeatureConstructor<ColumnFilteringFeature>,
        faceting?: FeatureConstructor<ColumnFacetingFeature>,
        globalSearch?: FeatureConstructor<GlobalSearchFeature>,
        grouping?: FeatureConstructor<GroupingFeature>,
        rowExpanding?: FeatureConstructor<RowExpansionFeature>,
        rowSelection?: FeatureConstructor<RowSelectionFeature>,
        rowPinning?: FeatureConstructor<RowPinningFeature>,
        columnOrdering?: FeatureConstructor<ColumnOrderingFeature>,
        columnGrouping?: FeatureConstructor<ColumnGroupingFeature>,
        columnPinning?: FeatureConstructor<ColumnPinningFeature>,
        columnSizing?: FeatureConstructor<ColumnSizingFeature>,
        columnVisibility?: FeatureConstructor<ColumnVisibilityFeature>,
    }
}

export interface Command {
    execute(): void;
    undo?(): void;
}

export type CommandPayload = {
    type: string;
    payload: any;
}

export type GridEventCallback<T = any> = (data: T) => void;

export type OnPageChangePayload = { prevPage: number; newPage: number };

export type EventPayloadMap = {
    'onColumnSort': { column: LeafColumn<any>, multisort?: boolean };

    'onRowPin': { rowId: GridRowIdentifier };
    'onRowUnpin': { rowIdentifier: GridRowIdentifier };

    'onRowSelect': { rowIdentifier: GridRowIdentifier };
    'onRowDeselect': { rowIdentifier: GridRowIdentifier };
    'onRowSelectionLimitExceeded': { rowIdentifier: GridRowIdentifier };

    'onRowExpand': { rowIdentifier: GridRowIdentifier };
    'onRowCollapse': { rowIdentifier: GridRowIdentifier };
    'onRowExpansionLimitExceeded': { rowIdentifier: GridRowIdentifier };

    'onPageChange': OnPageChangePayload;
    'onPageSizeChange': { prevSize: number, pageSize: number };

    'onGroupExpand': { groupIdentifier: GridGroupRowIdentifier };
    'onGroupCollapse': { groupIdentifier: GridGroupRowIdentifier };
    'onGroupExpansionLimitExceeded': { maxExpandedGroups: number };
    'onActiveGroupsLimitExceeded': { maxActiveGroups: number };

    'onGroupingChange': { activeGroups: ColumnId[] };

    'onSearchQueryChange': { prevQuery: string, newQuery: string };

    'onFilterChange': { column: LeafColumn<any> };
    'onColumnResize': { column: LeafColumn<any> };
    'onColumnVisibilityChange': { column: LeafColumn<any> };

    'onColumnGroupCreation': { columnGroup: ColumnGroup<any> };
    'onColumnGroupDeletion': { columnGroup: ColumnGroup<any> };
    'onColumnPinningChange': { column: LeafColumn<any> };
    'onColumnReorder': { columnId: ColumnId, direction: ColumnMovementDirection };

    'onCellEdit': { prevOriginalRow: any, newOriginalRow: any, prevValue: any, newValue: any };

};


