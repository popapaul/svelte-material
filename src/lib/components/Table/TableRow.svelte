<script lang="ts">
	import './TableRow.scss';
	
	interface Props {
		style?: string;
		class?: string;
		level?: number;
		children?: import('svelte').Snippet;
	}

	let {
		style = '',
		class: klass = '',
		level = 0,
		children
	}: Props = $props();
</script>

<tr class="s-table-row {klass}" style="--tbl-level:{level}; {style}">
	{@render children?.()}
</tr>
