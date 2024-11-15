<script>
	/** @type {{children?: import('svelte').Snippet}} */
	let { children } = $props();
</script>

<tfooter>
	{@render children?.()}
</tfooter>
