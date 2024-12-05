<script lang="ts" generics="T">
    import type {  ColumnDef } from "./datagrid/index.svelte";
	import { getContext } from "svelte";
    let columns = getContext<ColumnDef<T>[]>("columns");
    let {  ...rest  }:ColumnDef<T> = $props();
    columns.push(rest);
</script>