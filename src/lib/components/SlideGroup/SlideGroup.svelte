
<script module lang="ts">
	export const SLIDE_GROUP = {};

	export type SlideGroupContext = (item: HTMLElement) => void;
</script>

<script lang="ts">
	import { run, passive } from 'svelte/legacy';

	import './SlideGroup.scss';
	import { setContext } from 'svelte';
	import ItemGroup from '../ItemGroup/ItemGroup.svelte';
	import prevIcon from '../../internal/Icons/prev';
	import nextIcon from '../../internal/Icons/next';
	import Icon from '../Icon/Icon.svelte';

	let contentWidth: number = $state();
	let wrapperWidth: number = $state();
	let arrowsVisible = $state(false);
	
	interface Props {
		class?: string;
		showArrows?: boolean;
		hideDisabledArrows?: boolean;
		centerActive?: boolean;
		activeClass?: string;
		value?: any;
		multiple?: boolean;
		mandatory?: boolean;
		max?: any;
		children?: import('svelte').Snippet;
	}

	let {
		class: klass = '',
		showArrows = true,
		hideDisabledArrows = false,
		centerActive = false,
		activeClass = '',
		value = $bindable([]),
		multiple = false,
		mandatory = false,
		max = Infinity,
		children
	}: Props = $props();

	let x = $state(0);
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

	$effect(() => {
		if (x + wrapperWidth > contentWidth)
			 x = contentWidth - wrapperWidth;
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

	run(() => {
		showArrows && setTimeout(() => (arrowsVisible = wrapperWidth < contentWidth), 1);
	});
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
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="s-slide-group__prev"
			class:disabled={x === 0}
			class:hide-disabled-arrows={hideDisabledArrows}
			onclick={prev}
			onkeydown={prev}
		>

			<!-- <slot name="previous">
				<Icon path={prevIcon} />
			</slot> -->
		</div>
	{/if}
	<div
		class="s-slide-group__wrapper"
		use:passive={['touchstart', () => touchstart]}
		use:passive={['touchmove', () => touchmove]}
		bind:clientWidth={wrapperWidth}
	>
		<div
			class="s-slide-group__content"
			style="transform:translate(-{x}px)"
			bind:clientWidth={contentWidth}
		>
			{@render children?.()}
		</div>
	</div>
	{#if arrowsVisible}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="s-slide-group__next"
			class:disabled={x === contentWidth - wrapperWidth}
			class:show-arrows={hideDisabledArrows}
			onkeydown={next}
			onclick={next}
		>
			<!-- <slot name="next">
				<Icon path={nextIcon} />
			</slot> -->
		</div>
	{/if}
</ItemGroup>
