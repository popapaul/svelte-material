<script lang="ts">
	import './ListGroup.scss';
	import { slide, type TransitionConfig } from 'svelte/transition';
	import { onMount, setContext } from 'svelte';
	import ListItem from './ListItem.svelte';
	import { format } from '../../internal/Style';
	import type { RippleOptions } from '../../actions/Ripple';

	let klass = 'primary-text';
	/** classes added to the listgroup */
	export { klass as class };
	export let activatorClass = '';

	export let activatorProps = {};
	/** toggle the active state */
	export let active = true;
	/** will force the components content to render on mount */
	export let eager = false;
	/** transition when open or close */
	export let transition: (node: Element, options: any) => TransitionConfig = slide;
	/** options for transiton */
	export let transitionOpts = {};
	/** offset of the listgroup */
	export let offset: string | number = null;
	/** disables the listgroup */
	export let disabled: boolean = false;
	/** options for the ripple action */
	export let ripple: RippleOptions = {};
	/** disable toggle */
	export let disableToggle: boolean = false;
	/** styles added to the listgroup */
	export let style = null;

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
		<slot slot="prepend" name="prepend" {active} toggle={()=>active=!active} />
		<slot name="activator" toggle={()=>active=!active} />
		<slot slot="append" name="append" {active} toggle={()=>active=!active} />
	</ListItem>
	{#if active}
		<div
			transition:transition={transitionOpts}
			on:introstart
			on:outrostart
			on:introend
			on:outroend
			aria-disabled={disabled}
			class="s-list-group__items"
			class:offset
			style="--s-list-group-offset: {format(offset)}; {style}"
		>
			<slot />
		</div>
	{/if}
</div>
