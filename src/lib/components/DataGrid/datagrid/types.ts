import type { Component, Snippet } from "svelte";
import type { DatagridCore } from "./index.svelte";

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
    width: number;
    minWidth: number;
    maxWidth: number;
    grow: boolean;
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
export type GridBasicRowIdentifier = string | number;
export type RowPinningPosition = "top" | "bottom" | false;

export type GridGroupRow<TOriginalRow> = {
    index: string;
    identifier: GridGroupRowIdentifier;
    groupKey: string;
    groupValue: any[];
    depth: number;
    children: GridRow<TOriginalRow>[];
    aggregations: Aggregation[];
    isExpanded: () => boolean;
    isGroupRow: () => this is GridGroupRow<TOriginalRow>;
};

export type GridBasicRow<TOriginalRow> = {
    identifier: GridRowIdentifier;
    index: string;
    parentIndex: string | null;
    original: TOriginalRow;
    isExpanded: () => boolean;
    isGroupRow: () => false
};

export type GridRow<TOriginalRow> =
    | GridGroupRow<TOriginalRow>
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
    props?: object;
};


// Cell
export type CustomCellProps<TOriginalRow> = {
    datagrid: DatagridCore<TOriginalRow>;
    column: LeafColumn<TOriginalRow>;
    row: GridBasicRow<TOriginalRow>;
    original: TOriginalRow;
};

export type CustomCell<TOriginalRow> = Snippet<[CustomCellProps<TOriginalRow>]>

// Aggregated Cell
export type AggregateCellProps<TOriginalRow> = {
    datagrid: DatagridCore<any>;
    column: LeafColumn<any>;
    row: GridGroupRow<TOriginalRow>;
};
export type AggregatedCell<TOriginalRow> = (
    props: AggregateCellProps<TOriginalRow>
) => string | HTMLElement | CustomCellComponentWithProps;

// Grouped Cell
export type GroupedCellProps<TOriginalRow> = {
    datagrid: DatagridCore<any>;
    column: LeafColumn<any>;
    row: GridGroupRow<TOriginalRow>;
};

export type GroupedCell<TOriginalRow> = (
    props: GroupedCellProps<TOriginalRow>
) => string | HTMLElement | CustomCellComponentWithProps;

// Header Cell
export type HeaderCellProps<TOriginalRow> = {
    column: AnyColumn<TOriginalRow>;
    datagrid: DatagridCore<TOriginalRow>;
};

export type HeaderCell<TOriginalRow> = Snippet<[HeaderCellProps<TOriginalRow>]>;

/**
 * Sorting Types
 */
export interface Sorting {
    columnId: ColumnId;
    desc: boolean;
    index: number;
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
    accessorFn: GetValueFn<TOriginalRow>;
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



// Columns
type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;

export type DotNestedKeys<T, Seen = never> = 
  T extends object 
    ? T extends Seen // Prevent infinite recursion
      ? never
      : {
          [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<DotNestedKeys<T[K], Seen | T>>}`;
        }[Exclude<keyof T, symbol>]
    : "";
// Specific interfaces for different column types

export type ColumnAlign = 'left' | 'center' | 'right';

export interface AccessorColumn<TOriginalRow, TMeta = any> {
  type: 'accessor';
  header: string;
  // columnId: DotNestedKeys<TOriginalRow>;
  columnId: ColumnId;
  parentColumnId: string | null;
  accessorKey: DotNestedKeys<TOriginalRow>;
  accessorFn: GetValueFn<TOriginalRow>;
  formatterFn?: FormatterFn<TOriginalRow>;
  aggregate?: AggregationConfig;
  getGroupValueFn?: GetGroupValue<TOriginalRow>;
  cell?: CustomCell<TOriginalRow>;
  aggregatedCell?: AggregatedCell<TOriginalRow>;
  groupedCell?: GroupedCell<TOriginalRow>;
  headerCell?: HeaderCell<TOriginalRow>;
  options: {
    calculateFacets?: boolean;
    searchable?: boolean;
    groupable?: boolean;
    sortable?: boolean;
    filterable?: boolean;
    pinnable?: boolean;
    moveable?: boolean;
    hideable?: boolean;
  };
  state: {
    size: ColumnSizeState
    visible: boolean;
    pinning: ColumnPinningState
  };
  align: ColumnAlign
  _meta: TMeta
  isVisible(): boolean;
  isSortable(): boolean;
  isFilterable(): boolean
}

export interface ComputedColumn<TOriginalRow, TMeta = any> {
  type: 'computed';
  header: string;
  columnId: ColumnId
  parentColumnId: ColumnId | null;
  // accessorFn: AccessorFn<TOriginalRow>;
  accessorFn: GetValueFn<TOriginalRow>;
  getGroupValueFn?: GetGroupValue<TOriginalRow>;
  cell?: CustomCell<TOriginalRow>;
  aggregatedCell?: AggregatedCell<TOriginalRow>;
  groupedCell?: GroupedCell<TOriginalRow>;
  headerCell?: HeaderCell<TOriginalRow>;
  formatterFn?: FormatterFn<TOriginalRow>;
  aggregate?: AggregationConfig;
  options: {
    calculateFacets: boolean;
    searchable: boolean;
    groupable: boolean;
    sortable: boolean;
    filterable: boolean;
    pinnable: boolean;
    moveable: boolean;
    hideable: boolean;
  };
  state: {
    size: ColumnSizeState
    visible: boolean;
    pinning: ColumnPinningState
  };
  align: ColumnAlign
  _meta: TMeta;
  isVisible(): boolean;
  isSortable(): boolean;
  isFilterable(): boolean
}

export interface DisplayColumn<TOriginalRow, TMeta = any> {
  type: 'display';
  header: string;
  columnId: ColumnId
  parentColumnId: string | null;
  cell: CustomCell<TOriginalRow>;
  aggregatedCell?: AggregatedCell<TOriginalRow>;
  groupedCell?: GroupedCell<TOriginalRow>;
  headerCell?: HeaderCell<TOriginalRow>;
  options: {
    calculateFacets: null;
    searchable: null;
    groupable: null;
    sortable: null;
    filterable: null;
    pinnable: boolean;
    moveable: boolean;
    hideable: boolean;
  };
  state: {
    size: ColumnSizeState
    visible: boolean;
    pinning: ColumnPinningState

  };
  align: ColumnAlign
  _meta: TMeta;
  isVisible(): boolean;
  isSortable(): boolean;
  isFilterable(): boolean
}

export interface GroupColumn<TOriginalRow, TMeta = any> {
  type: 'group';
  header: string;
  headerCell?: HeaderCell<TOriginalRow>;
  columnId: ColumnId
  parentColumnId: string | null;
  columns: AnyColumn<TOriginalRow>[];
  options: {
    searchable: null;
    groupable: null;
    sortable: null;
    filterable: null;
    pinnable: null;
    moveable: boolean;
  };
  state: {
    size: ColumnSizeState
    visible: null;
    pinning: ColumnPinningState;
  };
  _meta: TMeta
  isVisible(): boolean;
  isSortable(): boolean;
  isFilterable(): boolean;
}
// Union type for all column types

export type AnyColumn<TOriginalRow, TMeta = any> =
  AccessorColumn<TOriginalRow, TMeta> |
  ComputedColumn<TOriginalRow, TMeta> |
  DisplayColumn<TOriginalRow, TMeta> |
  GroupColumn<TOriginalRow, TMeta>;


export type ParentColumnId = string | null;