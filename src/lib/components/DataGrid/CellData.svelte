<script lang="ts" generics="T">
	import type { LeafColumn, DatagridCore, GridBasicRow } from "./datagrid/core/index.svelte";
    import { getCellContent } from './datagrid/core/utils.svelte';
    let { column, row, datagrid }: { row:GridBasicRow<T>; datagrid:DatagridCore<T>, column: LeafColumn<T> } = $props();
</script>

{#if column.isVisible()}
    <div
        class="grid-cell"
        class:justify-end={column.align === 'right'}
        class:justify-center={column.align === 'center'}
        class:justify-start={column.align === 'left'}
        class:offset-left={column.pinning.position === 'left'}
        class:offset-right={column.pinning.position === 'right'}
        style:--offset="{column.pinning.offset}px"
        style={`${['left', 'right'].includes(column.pinning.position) && `background-color: black;`}`}
    >
        {#if column.cell}
             {@render column.cell({ column, row, original:row.original, datagrid })}
        {:else}
            {@html getCellContent(column, row.original)}
        {/if}
    </div>
{/if}

<style>
    /* Grid Cells */
    .grid-cell {
        display: flex;
        padding: 0.2rem;
        border-right: 1px solid (var(--grid-border));
        cursor: pointer;
        margin-top:auto;
        margin-bottom:auto;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .grid-cell:last-child {
        border-right: none;
    }
</style>