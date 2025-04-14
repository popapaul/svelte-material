<script lang="ts">
	import './MaterialApp.scss';
	
	interface Props {
		/** classes added to the App */
		class?: string;
		/** theme for the app */
		theme?: 'light' | 'dark';
		style?: string;
		children?: import('svelte').Snippet;
		[index:string]: any
	}

	let {
		class: klass = '',
		theme = 'light',
		style = null,
		children,
		...rest
	}: Props = $props();
</script>



<div class="s-app {klass} theme--{theme}" {...rest} {style} >
	{@render children?.()}
</div>
