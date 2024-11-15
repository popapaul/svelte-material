<script lang="ts">
	import './CardTitle.scss';
	
	interface Props {
		class?: string;
		style?: string;
		children?: import('svelte').Snippet;
	}

	let { class: klass = '', style = null, children }: Props = $props();
</script>

<div class="s-card-title {klass}" {style}>
	{@render children?.()}
</div>
