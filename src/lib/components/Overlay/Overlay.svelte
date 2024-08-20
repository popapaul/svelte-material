<script lang="ts">
	import { fade } from 'svelte/transition';
	import BackgroundColor from '../../internal/BackgroundColor';
	import './Overlay.scss';

	let klass = '';
	/** classes added to overlay */
	export { klass as class };

	export let transition = fade;
	/** options passed to the intro transition */
	export let inOpts = { duration: 250 };
	/** options passed to the outro transition */
	export let outOpts = { duration: 250 };
	/** overlay is visible or not */
	export let active = true;
	/** the opacity of the overlay */
	export let opacity = 0.46;
	/** the color of the overlay */
	export let color = 'rgb(33, 33, 33)';
	/** the z-index of the overlay */
	export let index = 5;
	/** makes the position of overlay absolute */
	export let absolute = false;
	/** styles added to the overlay */
	export let style = '';
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if active}
	<div
		in:transition={inOpts}
		out:transition={outOpts}
		class="s-overlay {klass}"
		class:absolute
		on:click
		on:keydown
		style="z-index:{index};{style}"
	>
		<div class="s-overlay__scrim" use:BackgroundColor={color} style="opacity:{opacity}"></div>
		<div class="s-overlay__content">
			<slot />
		</div>
	</div>
{/if}
