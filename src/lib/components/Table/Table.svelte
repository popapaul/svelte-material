<script lang="ts">
	import './Table.scss';
	
	interface Props {
		class?: string;
		elevation?: number;
		fixed?: boolean;
		toolbar?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
		footer?: import('svelte').Snippet;
	}

	let {
		class: klass = '',
		elevation = 1,
		fixed = false,
		toolbar,
		children,
		footer
	}: Props = $props();
</script>

<div class="s-table elevation-{elevation} {klass}">
	{#if toolbar}
		<div class="toolbar">
			{@render toolbar?.()}
		</div>
	{/if}

	<div class="s-table-container">
		<table class:layout-fixed={fixed}>
			{@render children?.()}
		</table>
	</div>

	{#if footer}
		<div class="s-table-footer">
			{@render footer?.()}
		</div>
	{/if}
</div>
