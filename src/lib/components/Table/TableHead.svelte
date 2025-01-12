<script lang="ts">
	import './TableCell.scss';
	interface Props {
		class?: string;
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let { class: klass = '', children, ...rest }: Props = $props();
	
</script>

<th class="s-table-cell {klass}" {...rest}>
	{@render children?.()}
</th>
