<script lang="ts">
	import './TableCell.scss';
	import { getContext } from 'svelte';
	let klass = '';
	export { klass as class };
	export let width = 'auto';
	export let style = '';

	const isHead = getContext('tbl-header') === true;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<svelte:element
	this={isHead ? 'th' : 'td'}
	class="s-table-cell {klass}"
	{style}
	style:width
	on:click
	{...$$restProps}
>
	{#if isHead}
		<slot name="header"><slot /></slot>
	{:else}
		<slot />
	{/if}
</svelte:element>
