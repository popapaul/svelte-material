<script lang="ts">
    import { getContext } from "svelte";
    let klass="";
    export {klass as class};
    export let width = "auto";
    export let style = "";

    const isHead = getContext("tbl-header")===true;
</script>

<svelte:element
    this={isHead ? "th" : "td"}
    class="s-table-cell {klass}"
    {style}
    style:width
    on:click
    {...$$restProps}>
    {#if isHead}
        <slot name="header"/>
    {:else}
        <slot/>
    {/if}
</svelte:element>

<style lang="scss" src="./TableCell.scss" global></style>
