<script lang="ts">
	import './Alert.scss';
	import type { TransitionConfig } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';
	const dispatch = createEventDispatcher();
	import Button from '../Button/Button.svelte';
	import close from '../../internal/Icons/close';

	let klass = '';
	/** classes added to the alert */
	export { klass as class };
	/** styles added to the alert */
	export let style = null;
	/** is the alert active/dismissed. */
	export let visible = true;
	/** the transition for the alert */
	export let transition: (node: Element, options: any) => TransitionConfig = fadeSlide;
	/** transition options */
	export let transitionOpts: any = { duration: 300 };
	/** makes the alert dense */
	export let dense = false;
	/** adds a thin outline */
	export let outlined = false;
	/** applies the defined color to text and a low opacity background of the same */
	export let text = false;
	/** removes the border radius */
	export let tile = false;
	/** adds a close icon that can hide the alert */
	export let dismissible: boolean | 'top' = false;
	/** location of the border */
	export let border: 'top' | 'bottom' | 'right' | 'left' = null;
	/** applies the defined color to the alert's border */
	export let coloredBorder = false;

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
		on:introstart
		on:outrostart
		on:introend
		on:outroend
		class:dense
		class:outlined
		class:text
		class:tile
		class:colored-border={coloredBorder}
	>
		<div class="s-alert__wrapper">
			<!-- Slot for icon at beginning of alert. -->
			<slot name="icon" />
			<div class="s-alert__content">
				<slot />
			</div>
			{#if dismissible}
				<Button icon size="small" class={dismissible == 'top' ? 'top' : ''} on:click={dismiss}>
					<!-- Slot for close button icon. -->
					<slot name="close">{@html close}</slot>
				</Button>
			{/if}
			{#if border}
				<div class="s-alert__border border-{border}" />
			{/if}
		</div>
	</div>
{/if}
