<script lang="ts">
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	import './Alert.scss';
	import type { TransitionConfig } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';
	const dispatch = createEventDispatcher();
	import Button from '../Button/Button.svelte';
	import close from '../../internal/Icons/close';

	/** classes added to the alert */
	
	
	
	
	
	
	
	
	
	
	
	
	interface Props {
		class?: string;
		/** styles added to the alert */
		style?: any;
		/** is the alert active/dismissed. */
		visible?: boolean;
		/** the transition for the alert */
		transition?: (node: Element, options: any) => TransitionConfig;
		/** transition options */
		transitionOpts?: any;
		/** makes the alert dense */
		dense?: boolean;
		/** adds a thin outline */
		outlined?: boolean;
		/** applies the defined color to text and a low opacity background of the same */
		text?: boolean;
		/** removes the border radius */
		tile?: boolean;
		/** adds a close icon that can hide the alert */
		dismissible?: boolean | 'top';
		/** location of the border */
		border?: 'top' | 'bottom' | 'right' | 'left';
		/** applies the defined color to the alert's border */
		coloredBorder?: boolean;
		children?: import('svelte').Snippet;
	}

	let {
		class: klass = '',
		style = null,
		visible = $bindable(true),
		transition = fadeSlide,
		transitionOpts = { duration: 300 },
		dense = false,
		outlined = false,
		text = false,
		tile = false,
		dismissible = false,
		border = null,
		coloredBorder = false,
		children
	}: Props = $props();

	function dismiss() {
		visible = false;
		/**
		 * Triggered when alert is dismissed.
		 * @returns Nothing
		 */
		dispatch('dismiss');
	}

	function fadeSlide(node: Element, options: any) {
		const slideTrans = slide(node, options);
		return {
			duration: options.duration,
			css: (t) => `
              ${slideTrans.css(t, 0)}
              opacity: ${t};
          `
		};
	}
</script>

{#if visible}
	<div
		{style}
		role="alert"
		class="s-alert {klass}"
		transition:transition={transitionOpts}
		onintrostart={bubble('introstart')}
		onoutrostart={bubble('outrostart')}
		onintroend={bubble('introend')}
		onoutroend={bubble('outroend')}
		class:dense
		class:outlined
		class:text
		class:tile
		class:colored-border={coloredBorder}
	>
		<div class="s-alert__wrapper">
			<!-- Slot for icon at beginning of alert. -->
			<!-- <slot name="icon" /> -->
			<div class="s-alert__content">
				{@render children?.()}
			</div>
			{#if dismissible}
				<Button icon size="small" class={dismissible == 'top' ? 'top' : ''} on:click={dismiss}>
					<!-- Slot for close button icon. -->
					<!-- <slot name="close">{@html close}</slot> -->
				</Button>
			{/if}
			{#if border}
				<div class="s-alert__border border-{border}"></div>
			{/if}
		</div>
	</div>
{/if}
