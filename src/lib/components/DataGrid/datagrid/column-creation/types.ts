import type { FormatterFn, AggregationConfig, GetGroupValue, CustomCell, HeaderCell, ColumnId, CellValue, ColumnSizeState, ColumnPinningState, AnyColumn, ParentColumnId, AggregatedCell, GroupedCell, ColumnAlign } from "../types";

type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;
export type DotNestedKeys<T> = (T extends object ? {
  [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<DotNestedKeys<T[K]>>}`;
}[Exclude<keyof T, symbol>] : "") extends infer D ? Extract<D, string> : never;


// Column creation props
export type CreateAccessorColumnProps<TOriginalRow, TKey extends DotNestedKeys<TOriginalRow> = DotNestedKeys<TOriginalRow>, TMeta = any> = {
  accessorKey: TKey;
  header?: string;
  accessorFn?: (row: TOriginalRow) => CellValue;
  getGroupValueFn?: GetGroupValue<TOriginalRow>;
  aggregate?: AggregationConfig;
  cell?: CustomCell<TOriginalRow>;
  aggregatedCell?: AggregatedCell<TOriginalRow>;
  groupedCell?: GroupedCell<TOriginalRow>;
  headerCell?: HeaderCell<TOriginalRow>;
  formatterFn?: FormatterFn<TOriginalRow>;
  options?: {
    calculateFacets?: boolean;
    searchable?: boolean;
    groupable?: boolean;
    sortable?: boolean;
    filterable?: boolean;
    pinnable?: boolean;
    moveable?: boolean;
    hideable?: boolean;
  };
  align?: ColumnAlign
  state?: ColumnCreationStateProps
} & CommonColumnCreationProps<TMeta>



export type CreateComputeColumnProps<TOriginalRow, TMeta = any> = {
  // accessorFn: (row: TOriginalRow) => CellValue;
  accessorFn: (row: TOriginalRow) => CellValue;
  aggregate?: AggregationConfig;
  getGroupValueFn?: GetGroupValue<TOriginalRow>;
  formatterFn?: FormatterFn<TOriginalRow>;
  cell?: CustomCell<TOriginalRow>;
  aggregatedCell?: AggregatedCell<TOriginalRow>;
  groupedCell?: GroupedCell<TOriginalRow>;
  headerCell?: HeaderCell<TOriginalRow>;
  options?: {
    calculateFacets?: boolean;
    searchable?: boolean;
    groupable?: boolean;
    sortable?: boolean;
    filterable?: boolean;
    pinnable?: boolean;
    moveable?: boolean;
    hideable?: boolean;
  };
  align?: ColumnAlign
  header: string;
  state?: ColumnCreationStateProps
} & CommonColumnCreationProps<TMeta>

export type CreateDisplayColumnProps<TOriginalRow, TMeta = any> = {
  cell: CustomCell<TOriginalRow>;
  headerCell?: HeaderCell<TOriginalRow>;
  aggregatedCell?: AggregatedCell<TOriginalRow>;
  groupedCell?: GroupedCell<TOriginalRow>;
  options?: {
    searchable?: false;
    groupable?: false;
    sortable?: false;
    filterable?: false;
    pinnable?: boolean;
    moveable?: boolean;
    hideable?: boolean;
  };
  header: string;
  align?: ColumnAlign
  state?: ColumnCreationStateProps
} & CommonColumnCreationProps<TMeta>

export type CreateGroupColumnProps<TOriginalRow, TMeta> = {
  header: string;
  headerCell?: HeaderCell<TOriginalRow>;
  columns: AnyColumn<TOriginalRow>[];
} & CommonColumnCreationProps<TMeta>


type ColumnCreationStateProps = {
  size?: ColumnSizeState;
  visible?: boolean;
  pinning?: Partial<ColumnPinningState>;
}

type CommonColumnCreationProps<TMeta = any> = {
  _meta?: TMeta;
  parentColumnId?: ParentColumnId
  columnId?: ColumnId;
}