<script lang="ts" generics="T">
	import type { Snippet } from "svelte";
	import CellData from "./CellData.svelte";
	import type { DatagridCore, GridBasicRow } from "./datagrid/core/index.svelte";

    type Props = {
        expand?:Snippet<[GridBasicRow<T>, DatagridCore<T>]>,
        row: GridBasicRow<T>,
        grid:DatagridCore<T>,
        hovered:'top' | 'middle' | 'bottom';
    }
    let { row, hovered, grid }: Props = $props();
</script>

<div class="flex {hovered}" class:hovered>    
    {#each grid.columns.getLeafColumnsInOrder() as column}
        <CellData datagrid={grid} {row} {column} />
    {/each}
</div>

