<script>
	import './TableHeader.scss';
	import { setContext } from 'svelte';
	/** @type {{children?: import('svelte').Snippet}} */
	let { children } = $props();
	setContext('tbl-header', true);
</script>

<thead class="s-table-head">
	{@render children?.()}
</thead>
