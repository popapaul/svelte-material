<script lang="ts">
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	import { fade } from 'svelte/transition';
	import BackgroundColor from '../../internal/BackgroundColor';
	import './Overlay.scss';

	/** classes added to overlay */
	

	
	
	
	
	
	
	
	
	interface Props {
		class?: string;
		transition?: any;
		/** options passed to the intro transition */
		inOpts?: any;
		/** options passed to the outro transition */
		outOpts?: any;
		/** overlay is visible or not */
		active?: boolean;
		/** the opacity of the overlay */
		opacity?: number;
		/** the color of the overlay */
		color?: string;
		/** the z-index of the overlay */
		index?: number;
		/** makes the position of overlay absolute */
		absolute?: boolean;
		/** styles added to the overlay */
		style?: string;
		children?: import('svelte').Snippet;
	}

	let {
		class: klass = '',
		transition = fade,
		inOpts = { duration: 250 },
		outOpts = { duration: 250 },
		active = true,
		opacity = 0.46,
		color = 'rgb(33, 33, 33)',
		index = 5,
		absolute = false,
		style = '',
		children
	}: Props = $props();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
{#if active}
	<div
		in:transition={inOpts}
		out:transition={outOpts}
		class="s-overlay {klass}"
		class:absolute
		onclick={bubble('click')}
		onkeydown={bubble('keydown')}
		style="z-index:{index};{style}"
	>
		<div class="s-overlay__scrim" use:BackgroundColor={color} style="opacity:{opacity}"></div>
		<div class="s-overlay__content">
			{@render children?.()}
		</div>
	</div>
{/if}
