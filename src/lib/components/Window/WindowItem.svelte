<script>
	import './WindowItem.scss';
	import { getContext, onMount } from 'svelte';
	import { WINDOW } from './Window.svelte';

	let window;
	const registerWindow = getContext(WINDOW);

	let klass = '';
	export { klass as class };
	export let style = null;

	onMount(() => {
		registerWindow(window);
	});
</script>

<div bind:this={window} class="s-window-item {klass}" {style}>
	<slot />
</div>
