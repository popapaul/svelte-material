<script lang="ts">
	import { ripple as Ripple, type RippleOptions } from '../../actions/Ripple';
	import './Button.scss';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLElement> {
		/** classes added to the button */
		class?: string;
		/** designates the button as a floating-action-button */
		fab?: boolean;
		/** designates the button as icon */
		icon?: boolean;
		/** makes button take 100% of the space */
		block?: boolean;
		/** determines the size of the button */
		size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large';
		/** removes the border radius if true */
		tile?: boolean;
		/** makes the background transparent */
		text?: boolean;
		/** removes the button box shadow. */
		depressed?: boolean;
		/** makes the background transparent and applies a thin border */
		outlined?: boolean;
		/** applies a large border radius on the button */
		rounded?: boolean;
		/** removes the ability to click or target the component */
		disabled?: boolean;
		/** makes the button active */
		active?: boolean;
		/** class to add to button when active */
		activeClass?: string;
		/** options for the ripple action */
		ripple?: RippleOptions;
		/** styles added to the button */
		style?: string;
		/** tag of element */
		tag?: string;

		type?: string;

		button?: HTMLElement;
		 /** Optional href for anchor tags */
		href?: string;
		children?: import('svelte').Snippet;
		[k:string]:any;
	};


	let {
		class: klass = '',
		fab = false,
		icon = false,
		block = false,
		size = 'default',
		tile = false,
		text = false,
		depressed = false,
		outlined = false,
		rounded = false,
		disabled = false,
		active = false,
		activeClass = 'active',
		type = 'button',
		ripple = null,
		style = '',
		href,
		tag = href ? 'a' : 'button',
		button = $bindable(),
		children,
		onclick,
		...rest
	}: Props = $props();
</script>

<!-- svelte-ignore a11y_missing_attribute -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<svelte:element
	this={tag}
	bind:this={button}
	{href}
	class="s-btn size-{size} {active ? activeClass : ''} {klass}"
	class:s-btn--fab={fab}
	class:icon
	class:pressable={onclick}
	class:block
	class:tile
	class:text={text || icon}
	class:depressed={depressed || text || disabled || outlined || icon}
	class:outlined
	class:rounded
	class:disabled
	{onclick}
	{style}
	aria-disabled={disabled}
	use:Ripple={ripple}
	{...rest}
>
	{@render children?.()}
</svelte:element>
