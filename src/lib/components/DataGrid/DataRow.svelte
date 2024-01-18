<script lang="ts">
    import "./DataRows.scss";
	import Button from "../Button/Button.svelte";
	import { Icon } from "../Icon";
	import { TableRow } from "../Table";
    import { getContext } from "svelte";
    import {DATA_GRID_CONTEXT, type DataGridContext} from "./DataGrid.svelte";
	import TableCell from "../Table/TableCell.svelte";
    import icons from "../../internal/Icons/index";
	import DataRows from "./DataRows.svelte";

    export let level = 0;
    export let item:any;
    export let expand=false;

    const context = getContext<DataGridContext<any>>(DATA_GRID_CONTEXT);
    export let active=false;
    let children = [];

    const handleExpand = async () => {
        active=!active;
        if(children.length) return;
        children = await $context.getChildren(item).catch(()=>[]);
    }
</script>

    <TableRow {level}>
        {#if expand || $context.hasChildren}
            <TableCell style="overflow:visible;">
                {#if expand}
                    <Button class="s-table-expand" fab size="x-small" depressed on:click={handleExpand}>
                        <Icon rotate={active ? 90 : 0} path={icons.arrow_right} size="24" />
                    </Button>
                {/if}
            </TableCell>
        {/if}
        <slot />
    </TableRow>
    {#if active}
        <slot name="expand">
            <DataRows data={children}>
                <slot/>
            </DataRows>
        </slot>
    {/if}
