<script lang="ts" generics="T">
	import { accessorColumn, computedColumn, displayColumn } from "./datagrid/column-creation";

	import type { CreateComputeColumnProps, CreateAccessorColumnProps, CreateDisplayColumnProps } from "./datagrid/column-creation/types";
    import type {  LeafColumn } from "./datagrid/index.svelte";
	import { getContext } from "svelte";
    let columns = getContext<LeafColumn<T>[]>("columns");
    type CreateColumn<T> = CreateComputeColumnProps<T> | CreateAccessorColumnProps<T> | CreateDisplayColumnProps<T>;
    let { ...rest }:CreateColumn<T>= $props();
   
    
    const createColumn = (config: CreateColumn<T>) =>{
        config = {...config, }
        config.columnId ??= config.header ?? crypto.randomUUID();
        if("accessorKey" in  config)
            return accessorColumn(config);
        if("accessorFn" in config)
            return computedColumn(config);
        return displayColumn(config);

    }
    
    const column = createColumn(rest);   
 
    const index = columns.findIndex(y=>y.columnId == rest.columnId);
    if(index>0)
        columns[index] = column;
    else
        columns.push(column);
</script>