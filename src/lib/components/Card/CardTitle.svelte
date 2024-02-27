<script lang="ts">
	import './CardTitle.scss';
	let klass: string = '';
	export { klass as class };
	export let style: string = null;
</script>

<div class="s-card-title {klass}" {style}>
	<slot />
</div>
