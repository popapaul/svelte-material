<script lang="ts" generics="T">
	import { accessorColumn, computedColumn, displayColumn } from "./datagrid/column-creation";

	import type { CreateComputeColumnProps, CreateAccessorColumnProps, CreateDisplayColumnProps } from "./datagrid/column-creation/types";
    import type {  ColumnSizeState, DatagridCore } from "./datagrid/index.svelte";
	import { getContext } from "svelte";
  
    type CreateColumn<T> = CreateComputeColumnProps<T> | CreateAccessorColumnProps<T> | CreateDisplayColumnProps<T>;
    let {  minWidth, maxWidth, width, grow, ...rest }:CreateColumn<T> & ColumnSizeState = $props();
   const datagrid = getContext<DatagridCore<T>>("datagrid");
    
    const createColumn = (config: CreateColumn<T>) =>{
        config = {...config }
        if(minWidth || maxWidth || width ||grow)
        config.state = { size: {minWidth, maxWidth, width, grow }};
        config.columnId ??= config.header ?? crypto.randomUUID();
        if("accessorKey" in  config)
            return accessorColumn(config);
        if("accessorFn" in config)
            return computedColumn(config);
        return displayColumn(config);

    }
    
    const column = createColumn(rest);   
 
    const index = datagrid.columns.findIndex(y=>y.columnId == rest.columnId);
    if(index>0)
        datagrid.columns[index] = column;
    else
        datagrid.columns.push(column);
</script>