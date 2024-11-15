<script lang="ts">
	import { createBubbler, handlers } from 'svelte/legacy';

	const bubble = createBubbler();
	import './Tab.scss';
	import { getContext, onMount } from 'svelte';
	import { SLIDE_GROUP, type SlideGroupContext } from '../SlideGroup/SlideGroup.svelte';
	import { ITEM_GROUP, type ItemGroupContext } from '../ItemGroup/ItemGroup.svelte';
	import { TABS, type TabsContext } from './Tabs.svelte';
	import { ripple as Ripple } from '../../actions/Ripple';

	let tab: HTMLElement = $state();
	const click = getContext<SlideGroupContext>(SLIDE_GROUP);
	const ITEM = getContext<ItemGroupContext>(ITEM_GROUP);
	const { ripple, registerTab } = getContext<TabsContext>(TABS);

	
	interface Props {
		class?: string;
		value?: any;
		activeClass?: any;
		disabled?: boolean;
		children?: import('svelte').Snippet;
	}

	let {
		class: klass = '',
		value = ITEM.index(),
		activeClass = ITEM.activeClass,
		disabled = false,
		children
	}: Props = $props();

	let active = $state();
	ITEM.register((values) => {
		active = values.includes(value);
	});

	function selectTab({ target }) {
		if (!disabled) {
			click(target);
			ITEM.select(value);
		}
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
	onclick={handlers(selectTab, bubble('click'))}
	use:Ripple={ripple}
>
	{@render children?.()}
</button>
