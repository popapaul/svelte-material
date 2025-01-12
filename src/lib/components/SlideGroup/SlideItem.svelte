<script lang="ts" generics="T = number">
	import { getContext } from 'svelte';
	import { SLIDE_GROUP } from './SlideGroup.svelte';
	import { type ItemGroupContext, ITEM_GROUP } from '../ItemGroup/ItemGroup.svelte';

	const moveGroup = getContext<(item: any) => void>(SLIDE_GROUP);
	const ITEM = getContext<ItemGroupContext<T>>(ITEM_GROUP);

	
	let itemElement: HTMLElement = $state();

	
	interface Props {
		class?: string;
		activeClass?: string;
		value?: T;
		disabled?: boolean;
		children?: import('svelte').Snippet<[{active:boolean}]>;
	}

	let {
		class: klass = '',
		activeClass = ITEM.activeClass,
		value = ITEM.index() as any,
		disabled = null,
		children
	}: Props = $props();

	const active = $derived(ITEM.values.includes(value));

	function selectItem() {
		if (!disabled) {
			moveGroup(itemElement);
			ITEM.select(value);
		}
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={itemElement}
	class="s-slide-item {active ? activeClass : ''} {klass}"
	onclick={selectItem}
>
	{@render children?.({ active })}
</div>

<style>
	.s-slide-item {
		display: inline-flex;
		flex: 0 1 auto;
	}
</style>
