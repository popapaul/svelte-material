<script lang="ts">
	import './ListItemGroup.scss';
	import { setContext } from 'svelte';
	import ItemGroup, { ITEM_GROUP } from '../ItemGroup/ItemGroup.svelte';

	setContext('S_ListItemRole', 'option');
	setContext('S_ListItemGroup', ITEM_GROUP);

	
	interface Props {
		class?: string;
		value?: any | any[];
		activeClass?: string;
		multiple?: boolean;
		mandatory?: boolean;
		max?: any;
		style?: any;
		children?: import('svelte').Snippet;
	}

	let {
		class: klass = 'primary-text',
		value = $bindable(),
		activeClass = 'active',
		multiple = false,
		mandatory = false,
		max = Infinity,
		style = null,
		children
	}: Props = $props();
</script>

<ItemGroup
	class="s-list-item-group {klass}"
	role="listbox"
	bind:value
	on:change
	{activeClass}
	{multiple}
	{mandatory}
	{max}
	{style}
>
	{@render children?.()}
</ItemGroup>
