<script lang="ts" generics="T">
	import { accessorColumn, computedColumn, displayColumn } from "./datagrid/core/column-creation";

	import type { CreateComputeColumnProps, CreateAccessorColumnProps, CreateDisplayColumnProps } from "./datagrid/core/column-creation/types";
    import type { DatagridCore } from "./datagrid/core/index.svelte";
	import { getContext, untrack } from "svelte";
	import { createColumnId } from "./datagrid/core/column-creation/accessor-column-creator";
  
    type Props = CreateAccessorColumnProps<T> | CreateComputeColumnProps<T> | CreateDisplayColumnProps<T>;
    let options:Props = $props();
    const store = getContext<Record<string, ColumnStore>>("datagrid-columns");   

    const createColumn = (config: Props) =>{
        const id = createColumnId(config);

        const options = store.current[id] ? {...config, ...$state.snapshot(store.current[id])} : config

        if("accessorKey" in  config)
            return accessorColumn(options);
        if("getValueFn" in config)
            return computedColumn(options);
        return displayColumn(options);
    }
    
    const datagrid = getContext<DatagridCore<T>>("datagrid");
    const column = $state(createColumn(options));
    type ColumnStore = {
        width: number;
        visible: boolean;
        order: number;
    };
  

    $effect(() => {

        column.visible; column.order; column.width;
        untrack(()=>{
            store.current[column.columnId] = {
                visible: column.visible,
                order: column.order,
                width: column.width
            };
        });
    })
 
    const index = datagrid._columns.findIndex(y=>y.columnId == column.columnId) ?? datagrid._columns.length;
    if(index == -1)
        datagrid._columns.push(column);
    else
        datagrid._columns[index] = column;
</script>