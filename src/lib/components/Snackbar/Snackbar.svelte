<script lang="ts">
	import { run, createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	import './Snackbar.scss';
	import { scale, type TransitionConfig } from 'svelte/transition';
	import { tweened } from 'svelte/motion';
	import { linear } from 'svelte/easing';
	import { createEventDispatcher, onMount } from 'svelte';
	/** classes added to the snackbar */
	

	
	
	
	
	
	
	
	interface Props {
		class?: string;
		active?: boolean;
		/** outlined gives the snackbar a outlined style */
		outlined?: boolean;
		/** text gives the snackbar a text style */
		text?: boolean;
		/** rounded gives the snackbar a rounded style */
		rounded?: boolean;
		/** tile gives the snackbar a tile style */
		tile?: boolean;
		/** duration is the delay before the snackar hides away */
		duration?: number;
		/** transiton function for the snackbar */
		transition?: (node: Element, options?: any) => TransitionConfig;
		/** styles added to the snackbar */
		style?: string;
		type?: 'success' | 'error' | 'info' | 'warning';
		children?: import('svelte').Snippet<[any]>;
	}

	let {
		class: klass = '',
		active = $bindable(true),
		outlined = false,
		text = false,
		rounded = false,
		tile = false,
		duration = 0,
		transition = scale,
		style = '',
		type = 'info',
		children
	}: Props = $props();
	let mounted = $state(false);
	const progress = tweened(0, { delay: 100, duration: 5000, easing: linear });

	const dispatch = createEventDispatcher();
	export const close = () => {
		active = false;
		dispatch('close');
	};

	onMount(() => {
		$progress = 100;
		mounted = true;
	});

	const pause = () => progress.set($progress, { duration: 0 });

	const resume = () => {
		progress.set(100, { duration: duration - duration * ($progress / 100) });
	};

	run(() => {
		Math.floor($progress) === 100 && setTimeout(close, 500);
	});
</script>

{#if active}
	<div
		role="progressbar"
		transition:transition|global
		onmouseenter={pause}
		onmouseleave={resume}
		onintrostart={bubble('introstart')}
		onoutrostart={bubble('outrostart')}
		onintroend={bubble('introend')}
		onoutroend={bubble('outroend')}
		class="s-snackbar snackbar-{type} {klass}"
		class:outlined
		class:text
		class:rounded
		class:tile
		{style}
	>
		{@render children?.({ close, progress: mounted ? Math.ceil($progress) : 0, })}
	</div>
{/if}
