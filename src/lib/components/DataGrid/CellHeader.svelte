<script lang="ts" generics="T">
    import type { Column, Datagrid } from "./datagrid/index.svelte";

    let { column, grid }: { grid:Datagrid<T>, column: Column<T>} = $props();
        
    
    const toggleSort = () => {
        if (column.sortable === false) return;
        grid.reload(() => grid.sorting.toggleSort(column.columnId));
    }
</script>
{#snippet sorter()}
    {#if column.isSorted()}
    <span class="text-nowrap w-2 text-xs">
        {column.getSortingDirection() === 'asc'
            ? `▲`
            : column.getSortingDirection() === 'desc'
                ? `▼`
                : ' '}
    </span>
    {/if}
{/snippet}
<div
    class="grid-header-cell"
    style="{column.grow === false
        ? `--width:${column.width}px; --max-width:${column.width}px;`
        : 'flex-grow:1; width:50px;'} --min-width:{column.minWidth}px; 
        {['left', 'right'].includes(column.pinning.position) && `background-color: black;`}"
    class:offset-left={column.pinning.position === 'left'}
    class:offset-right={column.pinning.position === 'right'}
    style:--offset={`${column.pinning.offset}px`}
    >
    {#if column.header}
        {@render column.header({column, grid, toggleSort, sorter})}
    {:else}
        <div
            aria-label="Click to sort column"
            role="button"
            tabindex="0"
            class="flex w-full items-center gap-1 overflow-hidden"
            class:justify-end={column.align === 'end'}
            class:justify-center={column.align === 'center'}
            class:justify-start={column.align === 'start'}
            onclick={() => {
                if (column.sortable === false) return;
                grid.reload(() => grid.sorting.toggleSort(column.columnId));
            }}
            onkeydown={(e) => {
                if (column.sortable === false) return;
                if (e.key === 'Enter') grid.reload(() => grid.sorting.toggleSort(column.columnId));
                else if (e.key === 'Escape') grid.reload(() => grid.sorting.clearSort());
            }}
        >   
            <span class="overflow-hidden text-ellipsis">{column.title}</span>
            {@render sorter()}
        </div>
    {/if}
</div>

<style>
    .grid-header-cell {
        display: flex;
        flex-direction: column;
        padding: 0.5rem;
        --border-right: 1px solid hsl(var(--grid-border));
        width: var(--width);
        max-width: var(--max-width);
        min-width: var(--min-width);
        align-items: center;
        gap: 0.25rem;
    }

    .grid-header-cell:last-child {
        border-right: none;
    }
</style>