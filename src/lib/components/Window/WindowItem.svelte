<script>
	import './WindowItem.scss';
	import { getContext, onMount } from 'svelte';
	import { WINDOW } from './Window.svelte';

	let window = $state();
	const registerWindow = getContext(WINDOW);

	
	/** @type {{class?: string, style?: any, children?: import('svelte').Snippet}} */
	let { class: klass = '', style = null, children } = $props();

	onMount(() => {
		registerWindow(window);
	});
</script>

<div bind:this={window} class="s-window-item {klass}" {style}>
	{@render children?.()}
</div>
