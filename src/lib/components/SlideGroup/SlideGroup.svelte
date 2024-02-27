<script context="module" lang="ts">
	export const SLIDE_GROUP = {};

	export type SlideGroupContext = (item: HTMLElement) => void;
</script>

<script lang="ts">
	import './SlideGroup.scss';
	import { setContext, afterUpdate } from 'svelte';
	import ItemGroup from '../ItemGroup/ItemGroup.svelte';
	import prevIcon from '../../internal/Icons/prev';
	import nextIcon from '../../internal/Icons/next';
	import Icon from '../Icon/Icon.svelte';

	let contentWidth: number;
	let wrapperWidth: number;
	let arrowsVisible = false;
	let klass = '';
	export { klass as class };
	export let showArrows = true;
	export let hideDisabledArrows = false;
	export let centerActive = false;
	export let activeClass = '';
	export let value = [];
	export let multiple = false;
	export let mandatory = false;
	export let max = Infinity;

	let x = 0;
	setContext<SlideGroupContext>(SLIDE_GROUP, (item) => {
		const left = item.offsetLeft;
		const width = item.offsetWidth;

		if (centerActive) x = left + (width - wrapperWidth) / 2;
		else if (left + 1.25 * width > wrapperWidth + x) {
			x = left + 1.25 * width - wrapperWidth;
		} else if (left < x + width / 4) {
			x = left - width / 4;
		}
	});

	afterUpdate(() => {
		if (x + wrapperWidth > contentWidth) x = contentWidth - wrapperWidth;
		else if (x < 0) x = 0;
	});

	function next() {
		x += wrapperWidth;
	}

	function prev() {
		x -= wrapperWidth;
	}

	let touchStartX: number;
	function touchstart({ touches }: TouchEvent) {
		touchStartX = x + touches[0].clientX;
	}

	function touchmove({ touches }: TouchEvent) {
		x = touchStartX - touches[0].clientX;
	}

	$: showArrows && setTimeout(() => (arrowsVisible = wrapperWidth < contentWidth), 1);
</script>

<ItemGroup
	class="s-slide-group {klass}"
	on:change
	bind:value
	{activeClass}
	{multiple}
	{mandatory}
	{max}
>
	{#if arrowsVisible}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="s-slide-group__prev"
			class:disabled={x === 0}
			class:hide-disabled-arrows={hideDisabledArrows}
			on:click={prev}
			on:keydown={prev}
		>
			<slot name="previous">
				<Icon path={prevIcon} />
			</slot>
		</div>
	{/if}
	<div
		class="s-slide-group__wrapper"
		on:touchstart|passive={touchstart}
		on:touchmove|passive={touchmove}
		bind:clientWidth={wrapperWidth}
	>
		<div
			class="s-slide-group__content"
			style="transform:translate(-{x}px)"
			bind:clientWidth={contentWidth}
		>
			<slot />
		</div>
	</div>
	{#if arrowsVisible}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="s-slide-group__next"
			class:disabled={x === contentWidth - wrapperWidth}
			class:show-arrows={hideDisabledArrows}
			on:keydown={next}
			on:click={next}
		>
			<slot name="next">
				<Icon path={nextIcon} />
			</slot>
		</div>
	{/if}
</ItemGroup>
