<script>
	import WindowItem from '../Window/WindowItem.svelte';

	let klass = '';
	export { klass as class };
	export let style = '';
	export let windowClass = '';
</script>

<div class="s-tab-content {klass}" role="tabpanel" {style}>
	<WindowItem class={windowClass}>
		<slot />
	</WindowItem>
</div>
