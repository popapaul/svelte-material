<script lang="ts">
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	import './Badge.scss';
	import { scale, type TransitionConfig } from 'svelte/transition';
	import { onMount } from 'svelte';
	
	interface Props {
		/** classes to add to badge */
		class?: string;
		value?: string | number;
		active?: boolean;
		bordered?: boolean;
		dot?: boolean;
		tile?: boolean;
		bottom?: boolean;
		left?: boolean;
		label?: string;
		/** the transition for the alert */
		transition?: (node: Element, options: any) => TransitionConfig;
		/** transition options */
		transitionOpts?: any;
		offsetX?: number | string;
		offsetY?: number | string;
		wrapperClass?: string;
		/** styles applied to the badge */
		style?: string;
		children?: import('svelte').Snippet;
		badge?: import('svelte').Snippet;
	}

	let {
		class: klass = '',
		value = '',
		active = true,
		bordered = false,
		dot = false,
		tile = false,
		bottom = false,
		left = false,
		label = 'Badge',
		transition = scale,
		transitionOpts = { duration: 0 },
		offsetX = 6,
		offsetY = 6,
		wrapperClass = 'block',
		style = '',
		children,
		badge
	}: Props = $props();
	let mounted = $state(false);

	onMount(() => setTimeout(() => (mounted = true), 0));
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span class="s-badge {wrapperClass}" onclick={bubble('click')} ondblclick={bubble('dblclick')} onkeydown={bubble('keydown')}>
	{@render children?.()}
	<span class="s-badge__wrapper">
		{#if active && mounted}
			<span
				class="s-badge__badge {klass}"
				transition:transition={transitionOpts}
				onintrostart={bubble('introstart')}
				onoutrostart={bubble('outrostart')}
				onintroend={bubble('introend')}
				onoutroend={bubble('outroend')}
				class:bordered
				class:dot
				class:tile
				class:bottom
				class:left
				role="status"
				aria-label={label}
				aria-live="polite"
				aria-atomic="true"
				style="--s-badge-offset-x:{offsetX}px;--s-badge-offset-y:{offsetY}px;{style}"
			>
				{#if badge}{@render badge()}{:else}{value}{/if}
			</span>
		{/if}
	</span>
</span>
