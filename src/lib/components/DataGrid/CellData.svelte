<script lang="ts" generics="T">
	import type { LeafColumn, DatagridCore, GridBasicRow } from "./datagrid/index.svelte";
    let { column, row, datagrid }: { row:GridBasicRow<T>; datagrid:DatagridCore<T>, column: LeafColumn<T> } = $props();
      
</script>

{#if column.isVisible()}
    <div
        class="grid-cell"
        class:justify-end={column.align === 'right'}
        class:justify-center={column.align === 'center'}
        class:justify-start={column.align === 'left'}
        class:offset-left={column.state.pinning.position === 'left'}
        class:offset-right={column.state.pinning.position === 'right'}
        style:--offset="{column.state.pinning.offset}px"
        style:--min-width="{column.state.size.minWidth}px"
        style:--width={!column.state.size.grow ? `${column.state.size.width}px` : '50px'}
        style:--max-width={`${column.state.size.maxWidth}px`}
        style:flex-grow={column.state.size.grow ? 1 : null}
        style={`${['left', 'right'].includes(column.state.pinning.position) && `background-color: black;`}`}
    >
        {#if column.cell}
            {@render column.cell({row, original:row.original, datagrid, column})}
        {:else if column.formatterFn}
            {column.formatterFn(row.original)}
        {:else}
            {column.accessorFn(row.original)}
        {/if}
    </div>
{/if}

<style>
    /* Grid Cells */
    .grid-cell {
        display: flex;
        padding: 0.5rem;
        border-right: 1px solid (var(--grid-border));
        cursor: pointer;
        width: var(--width);
        margin-top:auto;
        margin-bottom:auto;
        max-width: var(--max-width);
        min-width: var(--min-width);
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .grid-cell:last-child {
        border-right: none;
    }
</style>