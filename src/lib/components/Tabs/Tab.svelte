<script lang="ts">
	import './Tab.scss';
	import { getContext, onMount } from 'svelte';
	import { SLIDE_GROUP, type SlideGroupContext } from '../SlideGroup/SlideGroup.svelte';
	import { ITEM_GROUP, type ItemGroupContext } from '../ItemGroup/ItemGroup.svelte';
	import { TABS, type TabsContext } from './Tabs.svelte';
	import { ripple as Ripple } from '../../actions/Ripple';

	let tab: HTMLElement = $state();
	const click = getContext<SlideGroupContext>(SLIDE_GROUP);
	const ITEM = getContext<ItemGroupContext<any>>(ITEM_GROUP);
	const { ripple, registerTab } = getContext<TabsContext>(TABS);

	
	interface Props {
		class?: string;
		value?: any;
		activeClass?: string;
		disabled?: boolean;
		onclick?:()=>void;
		children?: import('svelte').Snippet;
	}

	let {
		class: klass = '',
		value = ITEM.index(),
		activeClass = ITEM.activeClass,
		disabled = false,
		onclick,
		children
	}: Props = $props();

	const active = $derived(ITEM.values.includes(value));
	
	function selectTab(event) {
		if (disabled) return 
		click(event.currentTarget);
		ITEM.select(value);
		onclick?.();
	}

	onMount(() => {
		registerTab({ element: tab, value });
	});
</script>

<button
	type="button"
	bind:this={tab}
	class="s-tab s-slide-item {active ? activeClass : ''} {klass}"
	role="tab"
	aria-selected={active}
	tabindex={disabled ? -1 : 0}
	class:disabled
	class:active
	onclick={selectTab}
	use:Ripple={ripple}
>
	{@render children?.()}
</button>
