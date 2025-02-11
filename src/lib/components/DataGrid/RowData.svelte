<script lang="ts" generics="T">
	import { getContext, type Snippet } from "svelte";
	import CellData from "./CellData.svelte";
	import type { DatagridCore, GridBasicRow } from "./datagrid/index.svelte";

    type Props = {
        expand?:Snippet<[GridBasicRow<T>, DatagridCore<T>]>,
        row: GridBasicRow<T>,
        grid:DatagridCore<T>,
        hovered:'top' | 'middle' | 'bottom';
    }
    let { expand, row, hovered, grid }: Props = $props();
</script>

<div class="flex {hovered.position}" class:hovered>    
    {#each grid.columnManager.getLeafColumnsInOrder() as column}
        <CellData {grid} {row} {column} />
    {/each}
</div>

