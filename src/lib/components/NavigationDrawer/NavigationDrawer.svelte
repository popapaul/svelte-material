<script lang="ts">
	import './NavigationDrawer.scss';
	import { fade, type TransitionConfig } from 'svelte/transition';
	import { format } from '../../internal/Style';
	let klass: string = '';
	/** classes added to the drawer */
	export { klass as class };
	/** width of the drawer */
	export let width: string | number = '256px';
	/** sets the state of the drawer */
	export let active = true;
	/** changes position of drawer to fixed */
	export let fixed = false;
	/** changes position of drawer to absolute */
	export let absolute = false;
	/** places the navigation drawer on the right */
	export let right = false;
	/** condenses navigation drawer width */
	export let mini = false;
	/** a clipped drawer rests under the AppBar */
	export let clipped = false;
	/** removes the border */
	export let borderless = false;
	/** width assigned when the mini prop is turned on */
	export let miniWidth = '56px';
	/** height assigned when the clipped prop is turned on */
	export let clippedHeight = '56px';
	/** transiton function for the drawer */
	export let transition: (node: Element, options: any) => TransitionConfig = fade;
	/** options for the transition */
	export let transitionOpts: any = {};
	/** The z-index of the drawer */
	export let index = 4;
	/** styles added to the drawer */
	export let style: string = null;
</script>

<aside
	class="s-navigation-drawer {klass}"
	transition:transition|local={transitionOpts}
	on:introstart
	on:outrostart
	on:introend
	on:outroend
	on:focus
	class:active
	class:fixed
	class:absolute
	class:right
	class:mini
	class:clipped
	on:mouseover
	style="--s-nav-width:{format(width)};--s-nav-min-width:{format(
		miniWidth
	)};--s-nav-clipped-height:{clippedHeight};z-index:{index};{style}"
>
	<slot name="prepend" />
	<div class="s-navigation-drawer__content">
		<slot />
	</div>
	<slot name="append" />
	{#if !borderless}
		<div class="s-navigation-drawer__border" ></div>
	{/if}
</aside>
