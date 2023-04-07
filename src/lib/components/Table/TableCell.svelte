<script lang="ts">
    import {TABLE_SORT, type TableSort} from "./Table.svelte";
    import Icon from "../Icon/Icon.svelte"
    import icons from "../../internal/Icons"
    import { getContext } from "svelte";
    let klass="";
    export {klass as class};
    import { clickOutside } from "../../actions/ClickOutside"
    export let sortBy:string = null;
    export let width = "auto";
    export let style = "";
    export let reverse = false;
    export let edit = false; 

    interface $$Events {
        order: CustomEvent<{sortBy:string,order:string}>;
    }

    const isHead = getContext("tbl-header")===true;
    const {handleSort, sort} = getContext<TableSort>(TABLE_SORT);
</script>
    {#if isHead}
        <th class="s-table-cell s-table-header {klass}" style="width:{width}; {style}" class:sorter={sortBy!=undefined} on:click={()=>sortBy && handleSort(sortBy,reverse)}>
            <slot name="header"/>
            {#if sortBy}
                <span class="s-table-sort" class:sort-active={$sort[sortBy]}>
                    <Icon size="23"  rotate={$sort[sortBy] == "desc" ? 180 : 0} path={icons.arrow_up}></Icon>
                </span>
            {/if}
        </th>
    {:else}
        <td {...$$restProps} class="s-table-cell {klass}" class:cell-edit={edit && $$slots.edit}  style="width:{width};{style}" use:clickOutside on:clickOutside={()=>edit=null} on:click on:keydown={()=>edit=true} on:click={()=>edit=true}>
            {#if edit && $$slots.edit}
                <slot name="edit" edit={true}>
                    <slot/>
                </slot>
            {:else}
                <slot/>
            {/if}
           
        </td>
    {/if}

<style lang="scss" src="./TableCell.scss" global></style>
