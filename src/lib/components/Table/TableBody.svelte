<script>
	/** @type {{children?: import('svelte').Snippet, [key: string]: any}} */
	let { children, ...rest } = $props();
</script>

<tbody {...rest}>
	{@render children?.()}
</tbody>
