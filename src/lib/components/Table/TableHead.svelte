<script lang="ts">
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	import './TableCell.scss';
	interface Props {
		class?: string;
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let { class: klass = '', children, ...rest }: Props = $props();
	
</script>

<th class="s-table-cell {klass}" onclick={bubble('click')} {...rest}>
	{@render children?.()}
</th>
