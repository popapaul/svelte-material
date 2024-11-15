<script lang="ts">
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	import './ListGroup.scss';
	import { slide, type TransitionConfig } from 'svelte/transition';
	import { onMount, setContext } from 'svelte';
	import ListItem from './ListItem.svelte';
	import { format } from '../../internal/Style';
	import type { RippleOptions } from '../../actions/Ripple';

	/** classes added to the listgroup */
	
	interface Props {
		class?: string;
		activatorClass?: string;
		activatorProps?: any;
		/** toggle the active state */
		active?: boolean;
		/** will force the components content to render on mount */
		eager?: boolean;
		/** transition when open or close */
		transition?: (node: Element, options: any) => TransitionConfig;
		/** options for transiton */
		transitionOpts?: any;
		/** offset of the listgroup */
		offset?: string | number;
		/** disables the listgroup */
		disabled?: boolean;
		/** options for the ripple action */
		ripple?: RippleOptions;
		/** disable toggle */
		disableToggle?: boolean;
		/** styles added to the listgroup */
		style?: any;
		prepend?: import('svelte').Snippet<[any]>;
		activator?: import('svelte').Snippet<[any]>;
		append?: import('svelte').Snippet<[any]>;
		children?: import('svelte').Snippet;
	}

	let {
		class: klass = 'primary-text',
		activatorClass = '',
		activatorProps = {},
		active = $bindable(),
		eager = false,
		transition = slide,
		transitionOpts = {},
		offset = null,
		disabled = false,
		ripple = {},
		disableToggle = false,
		style = null,
		prepend,
		activator,
		append,
		children
	}: Props = $props();

	setContext('S_ListItemRipple', ripple);

	function toggle() {
		if (disableToggle) return;
		active = !active;
	}

	if (eager) {
		const tempActive = active;
		active = true;
		onMount(() => {
			active = tempActive;
		});
	}
</script>

<div class="s-list-group {klass}">
	<ListItem
		class="s-list-group__activator {activatorClass}"
		{active}
		{...activatorProps}
		on:click={toggle}
	>
		{#snippet prepend()}
			{@render prepend?.({ active, toggle: ()=>active=!active, })}
		{/snippet}
		{@render activator?.({ toggle: ()=>active=!active, })}
		{#snippet append()}
			{@render append?.({ active, toggle: ()=>active=!active, })}
		{/snippet}
	</ListItem>
	{#if active}
		<div
			transition:transition={transitionOpts}
			onintrostart={bubble('introstart')}
			onoutrostart={bubble('outrostart')}
			onintroend={bubble('introend')}
			onoutroend={bubble('outroend')}
			aria-disabled={disabled}
			class="s-list-group__items"
			class:offset
			style="--s-list-group-offset: {format(offset)}; {style}"
		>
			{@render children?.()}
		</div>
	{/if}
</div>
