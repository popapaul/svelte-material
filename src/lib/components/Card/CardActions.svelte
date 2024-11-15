<script lang="ts">
	import './CardActions.scss';
	/** classes added to the card actions */
	
	
	interface Props {
		class?: string;
		/** styles added the card actions */
		style?: string;
		children?: import('svelte').Snippet;
	}

	let { class: klass = '', style = null, children }: Props = $props();
</script>

<div class="s-card-actions {klass}" {style}>
	{@render children?.()}
</div>
