<script lang="ts">
	import './CardText.scss';
	let klass: string = '';
	export { klass as class };
	export let style: string = null;
</script>

<div class="s-card-text {klass}" {style}>
	<slot />
</div>
