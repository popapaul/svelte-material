<script lang="ts" generics="T">
	import { Settings } from "@paulpopa/icons/md/outlined";
	import { Button } from "../Button";
	import ItemGroup from "../ItemGroup/ItemGroup.svelte";
	import ListItem from "../List/ListItem.svelte";
	import Menu from "../Menu/Menu.svelte";
    import CellHeader from "./CellHeader.svelte";
	import type { DatagridCore } from "./datagrid/core/index.svelte";
	import type { LeafColumn } from "./datagrid/core/types";
	import { Icon } from "../Icon";
	import { Checkbox } from "../Checkbox";
	import { Tooltip } from "../Tooltip";
    let { grid, leafColumns, hasExpand }:{leafColumns: LeafColumn<T>[], hasExpand:boolean, grid: DatagridCore<T>} = $props();

    
</script>



<div class="grid-header">
     <Menu closeOnClick={false}>
        {#snippet activator()}
            <Tooltip  wrapperClass="!absolute top-1/2 -translate-y-1/2 right-2 z-10" text="Vizibilitate coloane" placement="bottom">
                <Button size="x-small" fab depressed>
                    <Icon size={18} path={Settings}/>
                </Button>
            </Tooltip>
        {/snippet}
        <ItemGroup>
            {#each grid.columns.getLeafColumnsInOrder.filter(x=>x.header) as column}
                <ListItem onclick={()=>column.visible = !column.visible}>
                     {#snippet prepend()}
                        <Checkbox checked={column.visible} />
                    {/snippet}
                    {column.header}
                </ListItem>
            {/each}
        </ItemGroup>
    </Menu>
    <div class="grid-header-row">
        {#if hasExpand}
            <div></div>
        {/if}
        {#each leafColumns as column}
            <CellHeader {grid} {column}/>
        {/each}
    </div>
</div>

<style>
     .grid-header {
            top: 0;
            z-index: 11;
            background-color: hsl(var(--grid-header-row-background));
            position: sticky;
            grid-column: span var(--cols-count);
            grid-template-columns: subgrid;
            display:grid;
        }
        :global(.grid-content .grid-content .grid-header){
            z-index: 10;
        }
        .grid-header-row {
            background-color: hsl(var(--grid-header-row-background));
            display: grid;
            grid-column: span var(--cols-count);
            grid-template-columns: subgrid;
            border-bottom: 1px solid hsl(var(--grid-border));
            min-width: fit-content;
        }
   
</style>