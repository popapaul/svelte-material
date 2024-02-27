<script lang="ts">
	import './Tooltip.scss';
	import { createPopperActions, type NanoPopPosition } from '../../actions/Popper';
	import BackgroundColor from '../../internal/BackgroundColor';
	import { fade } from 'svelte/transition';

	let klass = '';
	export { klass as class };
	export let color = 'default';
	export let active = false;
	export let placement: NanoPopPosition = 'bottom';
	export let wrapperClass = '';
	/** The transition function for the tooltip. */
	export let transition = fade;
	/** Options for the transition when tooltip opens. */
	export let inOpts = { duration: 250 };
	/** Options for the transition when tooltip closes. */
	export let outOpts = { duration: 250 };

	const [popperRef, popperContent] = createPopperActions();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	use:popperRef
	on:mouseenter={() => (active = true)}
	on:mouseleave={() => (active = false)}
	class="s-tooltip__wrapper {wrapperClass}"
>
	<!-- Slot for the element that display the tooltip -->
	<slot />
</div>
{#if active}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<span
		on:mouseenter={() => (active = true)}
		on:mouseleave={() => (active = false)}
		in:transition={inOpts}
		out:transition={outOpts}
		use:popperContent={{
			position: placement
		}}
		class="s-tooltip {klass}"
		class:active
		use:BackgroundColor={color}
	>
		<!-- Slot for the content of the tooltip -->
		<slot name="tip" />
	</span>
{/if}
