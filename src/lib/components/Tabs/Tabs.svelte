<script module lang="ts">
	export const TABS = {};
	export interface TabsContext {
		ripple: any;
		registerTab: (tab: any) => void;
	}
</script>

<script lang="ts">
	import { run } from 'svelte/legacy';

	import './Tabs.scss';
	import SlideGroup from '../SlideGroup/SlideGroup.svelte';
	import Window from '../Window/Window.svelte';
	import { setContext } from 'svelte';

	let sliderElement: HTMLDivElement = $state();
	let windowComponent: Window = $state();
	let tabWidth: number = $state();
	const items: any[] = [];

	
	interface Props {
		class?: string;
		value?: any;
		centerActive?: boolean;
		showArrows?: boolean;
		fixedTabs?: boolean;
		grow?: boolean;
		centered?: boolean;
		right?: boolean;
		icons?: boolean;
		slider?: boolean;
		sliderClass?: string;
		ripple?: any;
		vertical?: boolean;
		windowClass?: string;
		wrapperClass?: string;
		children?: import('svelte').Snippet;
		tabs?:import('svelte').Snippet;
	}

	let {
		class: klass = '',
		value = $bindable(0),
		centerActive = false,
		showArrows = true,
		fixedTabs = false,
		grow = false,
		centered = false,
		right = false,
		icons = false,
		slider = true,
		sliderClass = '',
		ripple = {},
		vertical = false,
		windowClass = '',
		wrapperClass = '',
		tabs,
		children
	}: Props = $props();

	setContext(TABS, {
		ripple,
		registerTab: (tab: any) => {
			items.push(tab);
		}
	});

	function moveSlider({ detail }) {
		if (detail == null) return;
		if (slider) {
			const activeTab = items.find((x) => x.value == detail)?.element;
			if (!activeTab) return;
			if (vertical) {
				sliderElement.style.top = `${activeTab.offsetTop}px`;
				sliderElement.style.height = `${activeTab.offsetHeight}px`;
			} else {
				sliderElement.style.left = `${activeTab.offsetLeft}px`;
				sliderElement.style.width = `${activeTab.offsetWidth}px`;
			}
		}
		const index = items.findIndex((x) => x.value == detail);
		windowComponent.set(index);
	}
	run(() => {
		tabWidth && moveSlider({ detail: value });
	});
</script>

<div class="s-tabs {wrapperClass}" role="tablist" class:vertical bind:clientWidth={tabWidth}>
	<div
		class="s-tabs-bar {klass}"
		role="tablist"
		class:fixed-tabs={fixedTabs}
		class:grow
		class:centered
		class:right
		class:icons
	>
	
		<SlideGroup bind:value mandatory {centerActive} {showArrows} on:change={moveSlider} on:change>
			{@render tabs?.()}
			{#if slider}
				<div class="s-tab-slider {sliderClass}" style="width:0px;" bind:this={sliderElement}></div>
			{/if}
		</SlideGroup>
	</div>
	<Window class={windowClass} bind:this={windowComponent}>
		{@render children?.()}
	</Window>
</div>
