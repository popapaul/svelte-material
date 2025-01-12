<script lang="ts" generics="T">
	import './ButtonGroupItem.scss';
	import { getContext } from 'svelte';
	import Button from '../Button/Button.svelte';
	import { ITEM_GROUP } from '../ItemGroup/ItemGroup.svelte';
	import type { ItemGroupContext } from '../ItemGroup/ItemGroup.svelte';

	const ITEM = getContext<ItemGroupContext<T>>(ITEM_GROUP);

	

	// Classes to add to button.
	
	// Styles to add to button.
	// Value of button.
	// Identifies button as active with this class.
	// Disable button.
	interface Props {
		class?: string;
		style?: string;
		value?: T;
		activeClass?: string;
		disabled?: boolean;
		children?: import('svelte').Snippet;
		onclick?: (event: MouseEvent) => void;
		[key: string]: any
	}

	let {
		class: klass = '',
		style = '',
		value = ITEM.index() as any,
		activeClass = ITEM.activeClass,
		disabled = null,
		children,
		onclick,
		...rest
	}: Props = $props();

	const active = $derived(ITEM.values.includes(value));

	function click(event) {
		if (disabled) return;
	 	ITEM.select(value);
		onclick?.(event);
	}
</script>

<Button
	class="s-btn-group-item {klass}"
	{activeClass}
	{style}
	{active}
	{disabled}
	{...rest}
	onclick={click}
>
	{@render children?.()}
</Button>
