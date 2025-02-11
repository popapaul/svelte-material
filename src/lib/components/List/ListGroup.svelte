<script lang="ts">
	import './ListGroup.scss';
	import { slide, type TransitionConfig } from 'svelte/transition';
	import { type ComponentProps, setContext } from 'svelte';
	import ListItem from './ListItem.svelte';
	import { format } from '../../internal/Style';
	import type { RippleOptions } from '../../actions/Ripple';

	interface Props extends  ComponentProps<typeof ListItem> {
		/** classes added to the listgroup */
		class?: string;
		wrapperClass?: string;
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
		activator?: import('svelte').Snippet<[{active:boolean, toggle:()=>void}]>;
		children?: import('svelte').Snippet;
	}

	let {
		class: klass = '',
		wrapperClass = '',
		active = $bindable(),
		eager = false,
		transition = slide,
		disableToggle,
		transitionOpts = {},
		offset = null,
		disabled = false,
		ripple = {},
		style = null,
		onclick,
		activator,
		children,
		...rest
	}: Props = $props();

	setContext('S_ListItemRipple', ripple);

	function toggle() {
		if (disabled || disableToggle) return;
		active = !active;
	}

	if (eager) {
		active = true;
	}
</script>

<div class="s-list-group {wrapperClass}">
	<ListItem bind:active onclick={(event)=>{toggle(); onclick?.(event)}} {...rest}>
		{@render activator?.({active, toggle })}
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
