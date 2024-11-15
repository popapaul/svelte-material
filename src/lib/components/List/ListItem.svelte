<script lang="ts">
	import { createBubbler, handlers } from 'svelte/legacy';

	const bubble = createBubbler();
	import './ListItem.scss';
	import { getContext } from 'svelte';
	import { ripple as Ripple, type RippleOptions } from '../../actions/Ripple';
	import type { ItemGroupContext } from '../ItemGroup/ItemGroup.svelte';

	const role = getContext<string>('S_ListItemRole');
	const ITEM_GROUP = getContext('S_ListItemGroup');
	const DEFAULTS = {
		select: () => null,
		register: () => null,
		index: () => null,
		activeClass: 'active'
	};
	const ITEM = ITEM_GROUP ? getContext<ItemGroupContext>(ITEM_GROUP) : DEFAULTS;

	/** classes added to the listitem */
	
	
	
	
	
	
	
	

	
	
	
	interface Props {
		class?: string;
		/** classes added when active */
		activeClass?: string;
		/** value to use in ListItemGroup */
		value?: any;
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
		link?: any;
		/** makes text selectable if true */
		selectable?: any;
		/** options for the ripple action */
		ripple?: RippleOptions | boolean;
		/** styles added to listitem */
		style?: string;
		prepend?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
		subtitle?: import('svelte').Snippet;
		append?: import('svelte').Snippet;
		[key: string]: any
	}

	let {
		class: klass = '',
		activeClass = ITEM.activeClass,
		value = ITEM.index(),
		active = $bindable(false),
		dense = false,
		disabled = false,
		multiline = false,
		href = '',
		link = role,
		selectable = !link,
		ripple = getContext<RippleOptions>('S_ListItemRipple') || false,
		style = '',
		prepend,
		children,
		subtitle,
		append,
		...rest
	}: Props = $props();

	ITEM.register((values) => {
		active = values?.includes(value);
	});

	function click() {
		if (!disabled) ITEM.select(value);
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<svelte:element
	this={href ? 'a' : 'span'}
	{href}
	class="s-list-item {active ? activeClass : ''} {klass}"
	{role}
	tabindex={link ? 0 : -1}
	aria-selected={role === 'option' ? active : null}
	class:dense
	class:multiline
	class:link
	class:selectable
	use:Ripple={ripple}
	onclick={handlers(click, bubble('click'))}
	onkeydown={bubble('keydown')}
	ondblclick={bubble('dblclick')}
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
