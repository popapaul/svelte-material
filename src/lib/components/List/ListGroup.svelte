<script lang="ts">
	import './ListGroup.scss';
	import { slide, type TransitionConfig } from 'svelte/transition';
	import { type ComponentProps, setContext } from 'svelte';
	import ListItem from './ListItem.svelte';
	import { format } from '../../internal/Style';
	import type { RippleOptions } from '../../actions/Ripple';

	interface Props {
			/** classes added to the listgroup */
		class?: string;
		activatorClass?: string;
		activatorProps?: ComponentProps<typeof ListItem>;
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
		prepend?: import('svelte').Snippet<[{active:boolean, toggle:()=>void}]>;
		activator?: import('svelte').Snippet<[{ toggle:()=>void}]>;
		append?: import('svelte').Snippet<[{active:boolean, toggle:()=>void}]>;
		children?: import('svelte').Snippet;
	}

	let {
		class: klass = '',
		activatorClass = '',
		activatorProps = {},
		active = $bindable(),
		eager = false,
		transition = slide,
		transitionOpts = {},
		offset = null,
		disabled = false,
		ripple = {},
		style = null,
		prepend: innerPrepend,
		activator,
		append: innerAppend,
		children
	}: Props = $props();

	setContext('S_ListItemRipple', ripple);

	function toggle() {
		if (disabled) return;
		active = !active;
	}

	if (eager) {
		active = true;
	}
</script>

<div class="s-list-group {klass}">
	<ListItem
		class="s-list-group__activator {activatorClass}"
		bind:active
		{...activatorProps}
	>
		{#snippet prepend()}
			{@render innerPrepend?.({ active, toggle })}
		{/snippet}
		{@render activator?.({toggle })}
		{#snippet append()}
			{@render innerAppend?.({ active, toggle })}
		{/snippet}
	</ListItem>
	{#if active}
		<div
			transition:transition={transitionOpts}
			aria-disabled={disabled}
			class="s-list-group__items"
			class:offset
			style="--s-list-group-offset: {format(offset)}; {style}"
		>
			{@render children?.()}
		</div>
	{/if}
</div>
