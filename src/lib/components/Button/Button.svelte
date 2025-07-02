<script lang="ts">
	import { fade } from 'svelte/transition';
	import { ripple as Ripple, type RippleOptions } from '../../actions/Ripple';
	import './Button.scss';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	type CommonProps = {
		class?: string;
		fab?: boolean;
		icon?: boolean;
		block?: boolean;
		size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large';
		tile?: boolean;
		text?: boolean;
		depressed?: boolean;
		outlined?: boolean;
		rounded?: boolean;
		disabled?: boolean;
		active?: boolean;
		activeClass?: string;
		ripple?: RippleOptions;
		style?: string;
		tag?: string;
		type?: string;

		children?: import('svelte').Snippet;
	};

	type Props =
	| (CommonProps & { href?: undefined, button?: HTMLButtonAttributes; } & HTMLButtonAttributes)
	| (CommonProps & { href: string, button?: HTMLAnchorAttributes; } & HTMLAnchorAttributes);

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
		tag,
		button = $bindable(),
		children,
		onclick,
		...rest
	}: Props = $props();
</script>

<!-- svelte-ignore a11y_missing_attribute -->
<!-- svelte-ignore a11y_no_static_element_interactions -->

<svelte:element
	{...rest}
	{type}
	transition:fade
	this={(rest.href ? 'a' : 'button') as any}
	class="s-btn size-{size} {active ? activeClass : ''} {klass}"
	class:fab
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
	aria-disabled={disabled}
>
	{@render children?.()}
</svelte:element>
