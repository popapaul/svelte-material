<script lang="ts" generics="T">
    import type {  ColumnDef } from "./datagrid/index.svelte";
	import { getContext } from "svelte";
    let columns = getContext<ColumnDef<T>[]>("columns");
    let {  ...rest  }:ColumnDef<T> = $props();
        

    if(rest.id)
    {
        const index = columns.findIndex(y=>y.id == rest.id);
        if(index>0)
            columns[index] = rest;
        else
        columns.push(rest);
    }  
    else
    columns.push(rest);
$inspect(columns)
</script>