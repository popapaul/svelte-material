<script lang="ts">
	import './CardSubtitle.scss';
	let klass: string = '';
	export { klass as class };
	export let style: string = null;
</script>

<div class="s-card-subtitle {klass}" {style}>
	<slot />
</div>
