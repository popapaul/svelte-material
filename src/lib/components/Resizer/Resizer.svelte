<script module>
	import { createEventDispatcher } from 'svelte';
</script>

<script lang="ts">
	import './Resizer.scss';
	// Add class to resizer wrapper.
	

	// Styles to add to resizer.

	interface Props {
		class?: string;
		style?: string;
		width?: string | number;
		x?: number;
		children?: import('svelte').Snippet;
	}

	let {
		class: klass = '',
		style = null,
		width = $bindable(null),
		x = $bindable(20),
		children
	}: Props = $props();

	const dispath = createEventDispatcher();
	let expanding = null;
	let start = null,
		initial = null;

	function startExpand(type: string, event: MouseEvent) {
		expanding = type;
		start = event.pageX;
		initial = { x, width };
	}

	function stopExpand() {
		expanding = null;
		start = null;
		initial = null;
	}

	function expand(event: MouseEvent) {
		if (!expanding) return;

		if (expanding == 'left') {
			const delta = start - event.pageX;
			x = initial.x - delta;
			width = initial.width + delta;
			dispath('width', width);
			return;
		}

		if (expanding == 'right') {
			const delta = event.pageX - start;
			width = initial.width + delta;
			dispath('width', width);
			return;
		}
	}
</script>

<svelte:window onmouseup={stopExpand} onmousemove={expand} />
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div bind:clientWidth={width} class="s-resizer {klass}" {style}>
	<div class="s-resize-handle resize-left" onmousedown={(event) => startExpand('left', event)}></div>
	{@render children?.()}
	<div class="s-resize-handle resize-right" onmousedown={(event) => startExpand('right', event)}></div>
</div>
