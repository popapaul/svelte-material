<script lang="ts">
    type Props = {
        expand?: Snippet,
        children?: Snippet
    }
    let { expand, children }: Props = $props();
</script>

<div class="grid-row">            
    {#each grid.columnManager.getVisibleColumns() as column}
        <CellData {grid} {row} {column} />
    {/each}
</div>
{#if expand && grid.rowManager.isRowExpanded(String(row?.original?.id))}
    <div transition:slide={{axis:"y"}} class="grid-row">
        {@render expand(row, grid)}
    </div>
{/if}

<style>
    /* Grid Rows */
    .grid-row {
        display: flex;
        border-bottom: 1px solid hsl(var(--grid-border));
        border-top: none;
        min-width: fit-content;
        transition: 150ms;
    }

    .grid-row:last-child {
        border-bottom: none;
    }

    .grid-row:nth-child(odd) {
        background-color: hsl(var(--grid-row-odd-background));
    }

    .grid-row:hover:nth-child(odd) {
        background-color: hsl(var(--grid-row-odd-background-hover));
    }

    .grid-row:nth-child(even) {
        background-color: hsl(var(--grid-row-even-background));
    }

    .grid-row:hover:nth-child(even) {
        background-color: hsl(var(--grid-row-even-background-hover));
    }
</style>