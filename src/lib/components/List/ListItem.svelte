<script lang="ts" generics="T">
	import './ListItem.scss';
	import { getContext } from 'svelte';
	import { ripple as Ripple, type RippleOptions } from '../../actions/Ripple';
	import { type ItemGroupContext, DEFAULTS } from '../ItemGroup/ItemGroup.svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	const role = getContext<string>('S_ListItemRole');
	const ITEM_GROUP = getContext('S_ListItemGroup');

	const ITEM = ITEM_GROUP ? getContext<ItemGroupContext<T>>(ITEM_GROUP) : DEFAULTS;

	interface Props extends HTMLAttributes<HTMLAnchorElement> {
		/** classes added to the listitem */
		class?: string;
		/** classes added when active */
		activeClass?: string;
		/** value to use in ListItemGroup */
		value?: T;
		/** specify active state */
		active?: boolean;
		/** makes the listitem dense */
		dense?: boolean;
		/** disables the listitem */
		disabled?: boolean;
		/** there is no word wrap */
		multiline?: boolean;
		/** transforms listitem into anchor */
		href?: string;
		/** makes text selectable if true */
		selectable?: any;
		/** options for the ripple action */
		ripple?: RippleOptions | boolean;
		/** styles added to listitem */
		style?: string;

		link?: string;
		prepend?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
		subtitle?: import('svelte').Snippet;
		append?: import('svelte').Snippet;
		[key: string]: any
	}

	let {
		class: klass = '',
		activeClass = ITEM.activeClass,
		value = ITEM.index() as any,
		active = $bindable(false),
		dense = false,
		disabled = false,
		multiline = false,
		link = role,
		href = '',
		selectable = !href,
		ripple = getContext<RippleOptions>('S_ListItemRipple') || false,
		style = '',
		prepend,
		children,
		subtitle,
		onclick,
		append,
		...rest
	}: Props = $props();

	$effect(()=>{
		active = ITEM.values.includes(value);
	})


	function click(event) {
		if (disabled) return;
		ITEM.select(value);
		onclick?.(event);
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<svelte:element
	this={href ? 'a' : 'span'}
	{href}
	class="s-list-item {active ? activeClass : ''} {klass}"
	{role}
	tabindex={href ? 0 : -1}
	aria-selected={role === 'option' ? active : null}
	class:dense
	class:link
	class:multiline
	class:selectable
	use:Ripple={ripple}
	onclick={click}
	{...rest}
	{style}
>
	{@render prepend?.()}
	<div class="s-list-item__content" {role}>
		<div class="s-list-item__title">
			{@render children?.()}
		</div>
		<div class="s-list-item__subtitle">
			{@render subtitle?.()}
		</div>
	</div>
	{@render append?.()}
</svelte:element>
