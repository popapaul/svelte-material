<script lang="ts">
	import Style from '../../internal/Style';
	import './AppBar.scss';

	/** classes added to the appbar */
	
	
	
	
	
	
	
	
	
	
	interface Props {
		class?: string;
		/** height of the appbar */
		height?: string | number;
		/** removes the border radius */
		tile?: boolean;
		/** removes the box shadow */
		flat?: boolean;
		/** reduces the height */
		dense?: boolean;
		/** increases the height */
		prominent?: boolean;
		/** makes the positon of the appbar fixed */
		fixed?: boolean;
		/** makes the positon of the appbar absolute */
		absolute?: boolean;
		/** collapses the appbar reducing its maximum width */
		collapsed?: boolean;
		/** styles added to the appbar */
		style?: string;
		icon?: import('svelte').Snippet;
		title?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
		extension?: import('svelte').Snippet;
	}

	let {
		class: klass = '',
		height = '56px',
		tile = false,
		flat = false,
		dense = false,
		prominent = false,
		fixed = false,
		absolute = false,
		collapsed = false,
		style = '',
		icon,
		title,
		children,
		extension
	}: Props = $props();
</script>

<header
	class="s-app-bar {klass}"
	class:tile
	class:flat
	class:dense
	class:prominent
	class:fixed
	class:absolute
	class:collapsed
	use:Style={{ 'app-bar-height': height }}
	{style}
>
	<div class="s-app-bar__wrapper">
		{@render icon?.()}
		{#if !collapsed}
			<div class="s-app-bar__title">
				{@render title?.()}
			</div>
		{/if}
		{@render children?.()}
	</div>
	{@render extension?.()}
</header>
