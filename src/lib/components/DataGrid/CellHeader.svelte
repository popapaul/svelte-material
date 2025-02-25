<script lang="ts" generics="T">
    import type { LeafColumn, DatagridCore } from "./datagrid/index.svelte";
    
    import Button from "../Button/Button.svelte";
    import Icon from "../Icon/Icon.svelte";
     let { column, grid }: { grid:DatagridCore<T>, column: LeafColumn<T>} = $props();
     import {ArrowDropUp, Sort} from "@paulpopa/icons/md/outlined"   
    
    const toggleSort = () => grid.handlers.sorting.toggleColumnSorting(column, false);
 
</script>
{#snippet sorter()}
   
    {#if column.isSortable() && grid.features.sorting.sortings[column.columnId]}
        <Button  fab depressed size="x-small">
            <Icon path={ArrowDropUp} rotate={grid.features.sorting.sortings[column.columnId] == "desc" ? 180 : 0} />
        </Button>
    {/if}
{/snippet}
<div
    class="grid-header-cell cursor-pointer"
    style="{['left', 'right'].includes(column.state.pinning.position) && `background-color: black;`}"
    class:offset-left={column.state.pinning.position === 'left'}
    class:offset-right={column.state.pinning.position === 'right'}
    style:--offset={`${column.state.pinning.offset}px`}
    >

    {#if column.headerCell}
        {@render column.headerCell({ column, datagrid:grid })}
    {:else}
        <div
            aria-label="Click to sort column"
            role="button"
            tabindex="0"
            class="flex w-full items-center gap-1 overflow-hidden"
            class:justify-end={column.align === 'right'}
            class:justify-center={column.align === 'center'}
            class:justify-start={column.align === 'left'}
            onclick={toggleSort}
            onkeydown={(e) => {
                if (e.key === 'Enter') toggleSort();
                else if (e.key === 'Escape')  grid.handlers.sorting.unSortColumn(column);
            }}
        >   
            <div class="overflow-hidden inline-flex items-center text-ellipsis" style="height:35px;">{column.header}</div>

            {@render sorter()}
            {@render column?.menu()}
        </div>
    {/if}
</div>

<style>
    .grid-header-cell {
        display: flex;
        flex-direction: column;
        padding: 0.5rem;
        --border-right: 1px solid hsl(var(--grid-border));

        min-width: 0;
        max-width: 100%;
        align-items: center;
        justify-content: center;
        gap: 0.25rem;
    }

    .grid-header-cell:last-child {
        border-right: none;
    }
</style>