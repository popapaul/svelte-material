<script lang="ts">
	import './MaterialApp.scss';
	let klass = '';
	/** classes added to the App */
	export { klass as class };
	/** theme for the app */
	export let theme: 'light' | 'dark' = 'light';
	export let style: string = null;
</script>

<div class="s-app {klass} theme--{theme}" {...$$restProps} {style} >
	<slot />
</div>
