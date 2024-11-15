<script lang="ts">
	import './MaterialApp.scss';
	/** classes added to the App */
	
	
	interface Props {
		class?: string;
		/** theme for the app */
		theme?: 'light' | 'dark';
		style?: string;
		children?: import('svelte').Snippet;
		[key: string]: any
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
