<script lang="ts">
	import './TableCell.scss';
	import { getContext } from 'svelte';
	
	interface Props {
		class?: string;
		width?: string;
		style?: string;
		header?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let {
		class: klass = '',
		width = 'auto',
		style = '',
		header,
		children,
		...rest
	}: Props = $props();

	const isHead = getContext('tbl-header') === true;
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<svelte:element
	this={isHead ? 'th' : 'td'}
	class="s-table-cell {klass}"
	{style}
	style:width
	{...rest}
>
	{#if isHead}
		{#if header}{@render header()}{:else}{@render children?.()}{/if}
	{:else}
		{@render children?.()}
	{/if}
</svelte:element>
