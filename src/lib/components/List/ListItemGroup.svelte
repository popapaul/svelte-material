<script lang="ts" generics="T, M extends boolean = false">
	import './ListItemGroup.scss';
	import { type ComponentProps, setContext } from 'svelte';
	import ItemGroup, { ITEM_GROUP } from '../ItemGroup/ItemGroup.svelte';

	setContext('S_ListItemRole', 'option');
	setContext('S_ListItemGroup', ITEM_GROUP);

	let {
		class: klass = 'primary-text',
		value = $bindable(),
		activeClass = 'active',
		...rest
	}: ComponentProps<typeof ItemGroup<T,M>> = $props();
	
</script>

<ItemGroup
	class="s-list-item-group {klass}"
	role="listbox"
	bind:value
	{activeClass}
	{...rest}/>