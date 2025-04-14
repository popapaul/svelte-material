<script lang="ts" generics="T">
	import { accessorColumn, computedColumn, displayColumn } from "./datagrid/core/column-creation";

	import type { CreateComputeColumnProps, CreateAccessorColumnProps, CreateDisplayColumnProps } from "./datagrid/core/column-creation/types";
    import type { DatagridCore } from "./datagrid/core/index.svelte";
	import { getContext } from "svelte";
  
    type Props = CreateAccessorColumnProps<T> | CreateComputeColumnProps<T> | CreateDisplayColumnProps<T>;
    let options:Props = $props();

    const createColumn = (config: Props) =>{

        if("accessorKey" in  config)
            return accessorColumn(config);
        if("getValueFn" in config)
            return computedColumn(config);
        return displayColumn(config);
    }
    
    const datagrid = getContext<DatagridCore<T>>("datagrid");
        const column = createColumn(options);
 
        const index = datagrid._columns.findIndex(y=>y.columnId == column.columnId) ?? datagrid._columns.length;
        if(index == -1)
            datagrid._columns.push(column);
        else
        datagrid._columns[index] = column;
        
    const _ = $derived.by(()=>{
       
    });
</script>