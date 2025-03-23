
<script module lang="ts">
	export const SLIDE_GROUP = {};

	export type SlideGroupContext = (item: HTMLElement) => void;
</script>

<script lang="ts" generics="T, M extends boolean = false">
	import './SlideGroup.scss';
	import { type ComponentProps, setContext, type Snippet, untrack } from 'svelte';
	import ItemGroup from '../ItemGroup/ItemGroup.svelte';
	import prevIcon from '../../internal/Icons/prev';
	import nextIcon from '../../internal/Icons/next';
	import Icon from '../Icon/Icon.svelte';

	let contentWidth: number = $state();
	let wrapperWidth: number = $state();
	let arrowsVisible = $state(false);
	
	type Props = ComponentProps<typeof ItemGroup<T,M>> & {
		showArrows?: boolean;
		hideDisabledArrows?: boolean;
		centerActive?: boolean;
		previous?: Snippet,
		next?:Snippet
	}

	let {
		class: klass = '',
		showArrows = true,
		hideDisabledArrows = false,
		centerActive = false,
		activeClass = '',
		value = $bindable(),
		multiple,
		mandatory = false,
		max = Infinity,
		previous,
		next,
		onchange,
		children
	}: Props = $props();

	let x = $state(0);
	setContext<SlideGroupContext>(SLIDE_GROUP, (item) => {
		const left = item.offsetLeft;
		const width = item.offsetWidth;
		
		if (centerActive) x = left + (width - wrapperWidth) / 2;
			//todo
		// else if (left + 1.25 * width > wrapperWidth + x) {
		// 	x = left + 1.25 * width - wrapperWidth;
		// } else if (left < x + width / 4) {
		// 	x = left - width / 4;
		// }
	});

	$effect(() => {
		wrapperWidth;
		contentWidth;
		untrack(()=>{
			if (x + wrapperWidth > contentWidth)
			 x = contentWidth - wrapperWidth;
			else if (x < 0) x = 0;
		})
	});

	function nextItem() {
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

	$effect(() => {
		showArrows &&  (arrowsVisible = wrapperWidth < contentWidth);
	});
</script>

<ItemGroup
	class="s-slide-group {klass}"
	{onchange}
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
			{#if previous}
				{@render previous()}
			{:else}
				<Icon path={prevIcon} />
			{/if}
		</div>
	{/if}
	<div
		class="s-slide-group__wrapper"
		ontouchstart={touchstart}
		ontouchmove={touchmove}
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
			onkeydown={nextItem}
			onclick={nextItem}
		>
			{#if next}
				{@render next()}
			{:else}
				<Icon path={nextIcon} />
			{/if}
		</div>
	{/if}
</ItemGroup>
