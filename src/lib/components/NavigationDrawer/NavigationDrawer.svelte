<script lang="ts">
	import './NavigationDrawer.scss';
	import { fade, type TransitionConfig } from 'svelte/transition';
	import { format } from '../../internal/Style';
	import type { HTMLAttributes } from 'svelte/elements';
	
	
	interface Props extends HTMLAttributes<HTMLElement>{
		/** classes added to the drawer */
		class?: string;
		/** width of the drawer */
		width?: string | number;
		/** sets the state of the drawer */
		active?: boolean;
		/** changes position of drawer to fixed */
		fixed?: boolean;
		/** changes position of drawer to absolute */
		absolute?: boolean;
		/** places the navigation drawer on the right */
		right?: boolean;
		/** condenses navigation drawer width */
		mini?: boolean;
		/** a clipped drawer rests under the AppBar */
		clipped?: boolean;
		/** removes the border */
		borderless?: boolean;
		/** width assigned when the mini prop is turned on */
		miniWidth?: string;
		/** height assigned when the clipped prop is turned on */
		clippedHeight?: string;
		/** transiton function for the drawer */
		transition?: (node: Element, options: any) => TransitionConfig;
		/** options for the transition */
		transitionOpts?: any;
		/** The z-index of the drawer */
		index?: number;
		/** styles added to the drawer */
		style?: string;
		prepend?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
		append?: import('svelte').Snippet;
	}

	let {
		class: klass = '',
		width = '256px',
		active = true,
		fixed = false,
		absolute = false,
		right = false,
		mini = false,
		clipped = false,
		borderless = false,
		miniWidth = '56px',
		clippedHeight = '56px',
		transition = fade,
		transitionOpts = {},
		index = 4,
		style = null,
		prepend,
		children,
		append,
		...rest
	}: Props = $props();
</script>

<aside
	class="s-navigation-drawer {klass}"
	transition:transition|local={transitionOpts}
	class:active
	class:fixed
	class:absolute
	class:right
	class:mini
	class:clipped
	{...rest}
	style="--s-nav-width:{format(width)};--s-nav-min-width:{format(
		miniWidth
	)};--s-nav-clipped-height:{clippedHeight};z-index:{index};{style}"
>
	{@render prepend?.()}
	<div class="s-navigation-drawer__content">
		{@render children?.()}
	</div>
	{@render append?.()}
	{#if !borderless}
		<div class="s-navigation-drawer__border" ></div>
	{/if}
</aside>
