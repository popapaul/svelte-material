<script lang="ts">
	import { ripple as Ripple, type RippleOptions } from '../../actions/Ripple';
	import './Button.scss';

	let klass: string = '';
	/** classes added to the button */
	export { klass as class };
	/** designates the button as a floating-action-button */
	export let fab: boolean = false;
	/** designates the button as icon */
	export let icon: boolean = false;
	/** makes button take 100% of the space */
	export let block: boolean = false;
	/** determines the size of the button */
	export let size: 'x-small' | 'small' | 'default' | 'large' | 'x-large' = 'default';
	/** removes the border radius if true */
	export let tile: boolean = false;
	/** makes the background transparent */
	export let text: boolean = false;
	/** removes the button box shadow. */
	export let depressed: boolean = false;
	/** makes the background transparent and applies a thin border */
	export let outlined: boolean = false;
	/** applies a large border radius on the button */
	export let rounded: boolean = false;
	/** removes the ability to click or target the component */
	export let disabled: boolean = false;
	/** makes the button active */
	export let active: boolean = false;
	/** class to add to button when active */
	export let activeClass: string = 'active';
	/** specifies the type of button */
	export let type: 'button' | 'reset' | 'submit' = 'button';
	/** options for the ripple action */
	export let ripple: RippleOptions = null;
	/** styles added to the button */
	export let style: string = '';
	/** href for link */
	export let href: string = null;
	/** tag of element */
	export let tag: string = href ? 'a' : 'button';

	export let button: HTMLElement = null;

	const notypecheck = (x: any) => x;
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<svelte:element
	this={tag}
	bind:this={button}
	{...notypecheck({ type, href, disabled })}
	class="s-btn size-{size} {active ? activeClass : ''} {klass}"
	class:s-btn--fab={fab}
	class:icon
	class:block
	class:tile
	class:text={text || icon}
	class:depressed={depressed || text || disabled || outlined || icon}
	class:outlined
	class:rounded
	class:disabled
	{style}
	aria-disabled={disabled}
	use:Ripple={ripple}
	on:click
	{...$$restProps}
>
	<slot />
</svelte:element>
