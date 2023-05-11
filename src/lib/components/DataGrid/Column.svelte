<script lang="ts">
    import {DATA_GRID_CONTEXT, type DataGridContext, type Direction} from "./DataGrid.svelte";
    import Icon from "../Icon/Icon.svelte"
    import icons from "../../internal/Icons"
    import { getContext } from "svelte";
    type T = $$Generic;
	import {TableCell} from "../Table";
	import { createEventDispatcher } from "svelte";
    export const item:T = null;
    let klass="";
    export {klass as class};
    export let width = "auto";
    export let sortBy:string=null;
    export let sort:Direction = null;
    export let compare:(a:any,b:any)=>number = null;

    const isHead = getContext("tbl-header")===true;
    const context = getContext<DataGridContext<any>>(DATA_GRID_CONTEXT);
    const dispatch = createEventDispatcher();    
    if(isHead && sortBy)
        sortBy = context?.registerColumn({ direction:sort, sortBy, compare });
 
    const handleSort = () => {
        if(!sortBy) return;
        sort = context.handleSort(sortBy);
        dispatch("sort", {sortBy, direction:sort});
    }
  
</script>

{#if isHead}
    <TableCell sorted={$context.columns?.[sortBy]?.direction} class="s-table-sorter {klass}" {width} {...$$restProps} on:click={handleSort}>
        <div style="display:flex; gap:4px;" slot="header">
            <slot name="header" />
            {#if sortBy}
                <Icon class="s-table-sorter-icon" size="23" rotate={$context.columns?.[sortBy]?.direction == "asc" ? 0 : 180} path={icons.arrow_up}/>
            {/if}
        </div>
    </TableCell>
{:else}
    <TableCell class={klass} {width} {...$$restProps}>
        <slot />
    </TableCell>
{/if}

