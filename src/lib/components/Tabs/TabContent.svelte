<script>
	import WindowItem from '../Window/WindowItem.svelte';

	
	/** @type {{class?: string, style?: string, windowClass?: string, children?: import('svelte').Snippet}} */
	let {
		class: klass = '',
		style = '',
		windowClass = '',
		children
	} = $props();
</script>

<div class="s-tab-content {klass}" role="tabpanel" {style}>
	<WindowItem class={windowClass}>
		{@render children?.()}
	</WindowItem>
</div>
