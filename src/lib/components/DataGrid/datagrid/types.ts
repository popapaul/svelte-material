import type { Component, Snippet } from "svelte";
import type { AggregationFn } from "./features/grouping-manager.svelte";
import type { SortDirection } from "./features/sorting-manager.svelte";
import type { CategoricalFacet, NumericFacet, Column } from "./processors/column-processor.svelte";
import type { Row } from "./processors/data-processor.svelte";
import type { Datagrid } from "./index.svelte";


type PathImpl<T, K extends keyof T> = 
  K extends string
    ? T[K] extends Record<string, any>
      ? T[K] extends Array<any>
        ? K | `${K}.${PathImpl<T[K], Exclude<keyof T[K], keyof any[]>>}`
        : K | `${K}.${PathImpl<T[K], keyof T[K]>}`
      : K
    : never;

// Modified to only return the full paths, not intermediate objects
export type NestedPaths<T> = {
  [K in PathImpl<T, keyof T>]: K extends keyof T 
    ? T[K] extends Record<string, any>
      ? never 
      : K
    : K
}[PathImpl<T, keyof T>];

// Modified AccessorKey to use NestedPaths
export type AccessorKey<TData, TCustomKeys extends string = never> = NestedPaths<TData> | TCustomKeys;
export type Accessor<TData> = (row: TData) => any
export type AccessorFn<TData> = (row: TData) => any

export type CommonColumnProps<TData> = {
    sortable: boolean;
    resizable: boolean;
    movable: boolean;
    pinnable: boolean;
    hideable: boolean;
    filterable: boolean;
    groupable: boolean;
    searchable?: boolean;
    visible: boolean;
    grow: boolean;
    width: number;
    minWidth: number;
    maxWidth: number;
    formatter?: (row: TData) => any;
    faceting?: NumericFacet | CategoricalFacet;
    allowedSortDirections: SortDirection[];
    header?: Snippet<[{column:Column<TData>,grid:Datagrid<TData>, sorter:Snippet, toggleSort: ()=>void }]>;
    title: string;
    align?: "start" | "center" | "end";
    _meta: any
}


export type ColumnDef<TData, TCustomKeys extends string = never> = {
    id?:string;
    accessorKey?: AccessorKey<TData, TCustomKeys>;
    accessorFn?: AccessorFn<TData>;
    footer?: string;
    pinning?: "left" | "right";
    component?: Component<{grid: Datagrid<TData>, column: Column<TData>, row: Row<TData> }>;
    cell?: Snippet<[Row<TData>, Datagrid<TData>, Column<TData>]>;
    style?: (row: Row<TData>) => any;
    aggregationFn?: AggregationFn;
} & CommonColumnProps<TData> & {
    title: string;
};
