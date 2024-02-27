<script lang="ts">
	import Style from '../../internal/Style';
	import './AppBar.scss';

	let klass: string = '';
	/** classes added to the appbar */
	export { klass as class };
	/** height of the appbar */
	export let height: string | number = '56px';
	/** removes the border radius */
	export let tile: boolean = false;
	/** removes the box shadow */
	export let flat: boolean = false;
	/** reduces the height */
	export let dense: boolean = false;
	/** increases the height */
	export let prominent: boolean = false;
	/** makes the positon of the appbar fixed */
	export let fixed: boolean = false;
	/** makes the positon of the appbar absolute */
	export let absolute: boolean = false;
	/** collapses the appbar reducing its maximum width */
	export let collapsed: boolean = false;
	/** styles added to the appbar */
	export let style: string = '';
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
		<slot name="icon" />
		{#if !collapsed}
			<div class="s-app-bar__title">
				<slot name="title" />
			</div>
		{/if}
		<slot />
	</div>
	<slot name="extension" />
</header>
