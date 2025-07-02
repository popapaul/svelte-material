import type { FormatterFn, AggregationConfig, GetGroupValue, CustomCell, HeaderCell, ColumnId, CellValue, ColumnSizeState, ColumnPinningState, ColumnDef, ParentColumnId, AggregatedCell, GroupedCell, ColumnAlign, FilterOperator } from "../types";

// Columns
type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;

type MaxDepth = 3;

type IsPlainObject<T> = T extends object
  ? T extends Date
    ? false
    : T extends Function // skip functions
    ? false
    : true
  : false;

export type DotNestedKeys<T, Depth extends number[] = []> =
  Depth["length"] extends MaxDepth
    ? ""
    : T extends object
    ? {
        [K in Extract<keyof T, string>]:
          IsPlainObject<T[K]> extends true
            ? `${K}${DotPrefix<DotNestedKeys<T[K], [...Depth, 1]>>}`
            : K; // just return the key if not plain object
      }[Extract<keyof T, string>]
    : "";

export type CreateAccessorColumnProps<TOriginalRow, TKey extends DotNestedKeys<TOriginalRow> = DotNestedKeys<TOriginalRow>, TMeta = any> = SharedDataLogicProps<TOriginalRow> & SharedCellProps<TOriginalRow> & CommonColumnCreationProps<TMeta> &
{ 
  accessorKey: TKey; 
  getValueFn?: (row: TOriginalRow) => CellValue; 
};

export type CreateComputeColumnProps<TOriginalRow, TMeta = any> =  SharedDataLogicProps<TOriginalRow> & SharedCellProps<TOriginalRow> & CommonColumnCreationProps<TMeta> & {
  getValueFn: (row: TOriginalRow) => CellValue;
};

export type CreateDisplayColumnProps<TOriginalRow,TMeta = any> = SharedCellProps<TOriginalRow> & CommonColumnCreationProps<TMeta>;

export type CreateGroupColumnProps<TOriginalRow, TMeta = any> = CommonColumnCreationProps<TMeta> & {
  columns: ColumnDef<TOriginalRow>[];
  headerCell?: HeaderCell<TOriginalRow>;
};

type SharedCellProps<TOriginalRow> = {
  cell?: CustomCell<TOriginalRow>;
  aggregatedCell?: AggregatedCell<TOriginalRow>;
  groupedCell?: GroupedCell<TOriginalRow>;
  headerCell?: HeaderCell<TOriginalRow>;
};

type SharedDataLogicProps<TOriginalRow> = {
  getGroupValueFn?: GetGroupValue<TOriginalRow>;
  aggregate?: AggregationConfig;
  formatterFn?: FormatterFn<TOriginalRow>;
};

export type FilterableOptions =
  | boolean
  | {
      operators: FilterOperator[];
      type: "date";
      options?: { name: string; value: Date }[];
    }
  | {
      operators: FilterOperator[];
      type: "number";
      options?: { name: string; value: number }[];
    }
  | {
      operators: FilterOperator[];
      type: "string";
      options?: { name: string; value: string }[];
    };

export type ColumnOptions = {
  calculateFacets?: boolean;
  searchable?: boolean;
  groupable?: boolean;
  sortable?: boolean;
  filterable?: FilterableOptions;
  pinnable?: boolean;
  moveable?: boolean;
  hideable?: boolean;
  resizable?: boolean;
  align?: ColumnAlign;
  visible?: boolean;
  pinning?: Partial<ColumnPinningState>;
}


export type CommonColumnCreationProps<TMeta> = ColumnOptions & ColumnSizeState &{
  _meta?: TMeta;
  parentColumnId?: ParentColumnId
  columnId?: ColumnId;
  header?: string;

  align?: ColumnAlign;
}