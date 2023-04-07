<script lang="ts">
	import Button from "../Button/Button.svelte";
	import Icon from "../Icon/Icon.svelte";
    import Down from "../../internal/Icons/down";
	import TableCell from "./TableCell.svelte";

    export let style="";
    let klass = '';
    export { klass as class};
    export let expansion:boolean=false;
    let expand = false;
</script>


<tr class="s-table-row {klass}" {style}>
    {#if expansion}
        <TableCell>
            <Button size="x-small" fab depressed on:click={()=>expand=!expand}>
                <Icon rotate={expand ? 180 : 0} path={Down}/>
            </Button>
        </TableCell>
    {/if}
    <slot/> 
</tr>
{#if expand}
    <tr class="s-table-row {klass}" {style}>
        <slot name="expand"/>
    </tr>
{/if}

<style lang="scss" src="./TableRow.scss" global></style>