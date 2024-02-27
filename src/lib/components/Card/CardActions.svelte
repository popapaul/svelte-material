<script lang="ts">
	import './CardActions.scss';
	let klass: string = '';
	/** classes added to the card actions */
	export { klass as class };
	/** styles added the card actions */
	export let style: string = null;
</script>

<div class="s-card-actions {klass}" {style}>
	<slot />
</div>
