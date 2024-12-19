<script lang="ts" generics="T">
	import type { Column, Datagrid, Row } from "./datagrid/index.svelte";
    let { column, row, grid }: { row:Row<T>; grid:Datagrid<T>, column: Column<T> } = $props();
</script>

<div
    class="grid-cell text-ellipsis text-nowrap"
    class:justify-end={column.align === 'end'}
    class:justify-center={column.align === 'center'}
    class:justify-start={column.align === 'start'}
    class:offset-left={column.pinning.position === 'left'}
    class:offset-right={column.pinning.position === 'right'}
    style:--offset="{column.pinning.offset}px"
    style:--min-width="{column.minWidth}px"
    style:--width={!column.grow ? `${column.width}px` : '50px'}
    style:--max-width={!column.grow ? `${column.width}px` : null}
    style:flex-grow={column.grow ? 1 : null}
    style={`${['left', 'right'].includes(column.pinning.position) && `background-color: black;`}`}
>
    {#if column.component}
        <column.component {row} {grid} {column}/>
    {:else if column.cell}
        {@render column.cell(row, grid, column)}
    {:else if column.formatter}
        {column.formatter(row.original)}
    {:else}
        {column.accessor(row.original)}
    {/if}
</div>

<style>
    /* Grid Cells */
    .grid-cell {
        display: flex;
        padding: 0.5rem;
        border-right: 1px solid (var(--grid-border));
        cursor: pointer;
        width: var(--width);
        margin:auto;
        max-width: var(--max-width);
        min-width: var(--min-width);
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .grid-cell:last-child {
        border-right: none;
    }
</style>