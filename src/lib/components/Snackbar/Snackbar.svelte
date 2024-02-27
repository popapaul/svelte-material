<script lang="ts">
	import './Snackbar.scss';
	import { scale, type TransitionConfig } from 'svelte/transition';
	import Style from '../../internal/Style';
	import { tweened } from 'svelte/motion';
	import { linear } from 'svelte/easing';
	import { createEventDispatcher, onMount } from 'svelte';
	let klass = '';
	/** classes added to the snackbar */
	export { klass as class };

	export let active = true;
	/** outlined gives the snackbar a outlined style */
	export let outlined = false;
	/** text gives the snackbar a text style */
	export let text = false;
	/** rounded gives the snackbar a rounded style */
	export let rounded = false;
	/** tile gives the snackbar a tile style */
	export let tile = false;
	/** duration is the delay before the snackar hides away */
	export let duration = 0;
	/** transiton function for the snackbar */
	export let transition: (node: Element, options?: any) => TransitionConfig = scale;
	/** styles added to the snackbar */
	export let style = '';
	export let type = 'info';
	let mounted = false;
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

	$: Math.floor($progress) === 100 && setTimeout(close, 500);
</script>

{#if active}
	<div
		role="progressbar"
		transition:transition|global
		on:mouseenter={pause}
		on:mouseleave={resume}
		on:introstart
		on:outrostart
		on:introend
		on:outroend
		class="s-snackbar snackbar-{type} {klass}"
		class:outlined
		class:text
		class:rounded
		class:tile
		{style}
	>
		<slot {close} progress={mounted ? Math.ceil($progress) : 0} />
	</div>
{/if}
