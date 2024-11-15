<script lang="ts">
	import './ButtonGroupItem.scss';
	import { getContext } from 'svelte';
	import Button from '../Button/Button.svelte';
	import { ITEM_GROUP } from '../ItemGroup/ItemGroup.svelte';
	import type { ItemGroupContext } from '../ItemGroup/ItemGroup.svelte';

	const ITEM = getContext<ItemGroupContext>(ITEM_GROUP);

	let active: boolean = $state(false);

	// Classes to add to button.
	
	// Styles to add to button.
	// Value of button.
	// Identifies button as active with this class.
	// Disable button.
	interface Props {
		class?: string;
		style?: string;
		value?: any;
		activeClass?: string;
		disabled?: boolean;
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let {
		class: klass = '',
		style = '',
		value = ITEM.index(),
		activeClass = ITEM.activeClass,
		disabled = null,
		children,
		...rest
	}: Props = $props();

	ITEM.register((values) => {
		active = values.includes(value);
	});

	function click() {
		if (!disabled) ITEM.select(value);
	}
</script>

<Button
	class="s-btn-group-item {klass}"
	{activeClass}
	{style}
	{active}
	{disabled}
	{...rest}
	on:click={click}
	on:click
>
	{@render children?.()}
</Button>
