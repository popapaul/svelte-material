<script lang="ts">
	import './CardSubtitle.scss';
	
	interface Props {
		class?: string;
		style?: string;
		children?: import('svelte').Snippet;
	}

	let { class: klass = '', style = null, children }: Props = $props();
</script>

<div class="s-card-subtitle {klass}" {style}>
	{@render children?.()}
</div>
