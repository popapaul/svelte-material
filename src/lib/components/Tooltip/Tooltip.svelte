<script lang="ts">
	import './Tooltip.scss';
	import { createPopperActions, type NanoPopPosition } from '../../actions/Popper';
	import BackgroundColor from '../../internal/BackgroundColor';
	import { fade } from 'svelte/transition';

	
	
	
	
	interface Props {
		class?: string;
		color?: string;
		active?: boolean;
		placement?: NanoPopPosition;
		wrapperClass?: string;
		/** The transition function for the tooltip. */
		transition?: any;
		/** Options for the transition when tooltip opens. */
		inOpts?: any;
		/** Options for the transition when tooltip closes. */
		outOpts?: any;
		children?: import('svelte').Snippet;
		tip?: import('svelte').Snippet;
	}

	let {
		class: klass = '',
		color = 'default',
		active = $bindable(false),
		placement = 'bottom',
		wrapperClass = '',
		transition = fade,
		inOpts = { duration: 250 },
		outOpts = { duration: 250 },
		children,
		tip
	}: Props = $props();

	const [popperRef, popperContent] = createPopperActions();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	use:popperRef
	onmouseenter={() => (active = true)}
	onmouseleave={() => (active = false)}
	class="s-tooltip__wrapper {wrapperClass}"
>
	<!-- Slot for the element that display the tooltip -->
	{@render children?.()}
</div>
{#if active}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<span
		onmouseenter={() => (active = true)}
		onmouseleave={() => (active = false)}
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
		{@render tip?.()}
	</span>
{/if}
