<script module lang="ts">
	export const TABS = {};
	export interface TabsContext {
		ripple: any;
		registerTab: (tab: any) => void;
	}
</script>

<script lang="ts">
	import './Tabs.scss';
	import SlideGroup from '../SlideGroup/SlideGroup.svelte';
	import Window from '../Window/Window.svelte';
	import { setContext } from 'svelte';

	let sliderElement: HTMLDivElement;
	let windowComponent: Window;
	let tabWidth: number;
	const tabs: any[] = [];

	let klass = '';
	export { klass as class };
	export let value: any = 0;
	export let centerActive = false;
	export let showArrows = true;
	export let fixedTabs = false;
	export let grow = false;
	export let centered = false;
	export let right = false;
	export let icons = false;
	export let slider = true;
	export let sliderClass = '';
	export let ripple = {};
	export let vertical = false;
	export let windowClass = '';
	export let wrapperClass = '';

	setContext(TABS, {
		ripple,
		registerTab: (tab: any) => {
			tabs.push(tab);
		}
	});

	function moveSlider({ detail }) {
		if (detail == null) return;
		if (slider) {
			const activeTab = tabs.find((x) => x.value == detail)?.element;
			if (!activeTab) return;
			if (vertical) {
				sliderElement.style.top = `${activeTab.offsetTop}px`;
				sliderElement.style.height = `${activeTab.offsetHeight}px`;
			} else {
				sliderElement.style.left = `${activeTab.offsetLeft}px`;
				sliderElement.style.width = `${activeTab.offsetWidth}px`;
			}
		}
		const index = tabs.findIndex((x) => x.value == detail);
		windowComponent.set(index);
	}
	$: tabWidth && moveSlider({ detail: value });
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
			<slot name="tabs" />
			{#if slider}
				<div class="s-tab-slider {sliderClass}" style="width:0px;" bind:this={sliderElement} />
			{/if}
		</SlideGroup>
	</div>
	<Window class={windowClass} bind:this={windowComponent}>
		<slot />
	</Window>
</div>
