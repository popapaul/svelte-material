<script lang="ts">
	import './Card.scss';
	import ProgressLinear from '../ProgressLinear/ProgressLinear.svelte';

	interface Props {
		/** classes added to the card */
		class?: string;
		/** remove box shadow from card */
		flat?: boolean;
		/** remove border radius */
		tile?: boolean;
		/** adds a thin border */
		outlined?: boolean;
		/** makes the card more elevated */
		raised?: boolean;
		/** add border radius to opposite corners */
		shaped?: boolean;
		/** more elevation on hover */
		hover?: boolean;
		/** card with button-like functionality */
		link?: boolean;
		/** shows the linear progress bar */
		loading?: boolean;
		/** disables the card and lowers opacity */
		disabled?: boolean;
		/** styles added the card */
		style?: string;
		progress?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
	}

	let {
		class: klass = '',
		flat = false,
		tile = false,
		outlined = false,
		raised = false,
		shaped = false,
		hover = false,
		link = false,
		loading = false,
		disabled = false,
		style = null,
		progress,
		children,
		...rest
	}: Props = $props();
</script>

<div
	{...rest}
	class="s-card {klass}"
	class:flat
	class:tile
	class:outlined
	class:raised
	class:shaped
	class:hover
	class:link
	class:disabled
	{style}
>
	{#if loading}
		{#if progress}{@render progress()}{:else}
			<ProgressLinear indeterminate />
		{/if}
	{/if}
	{@render children?.()}
</div>
