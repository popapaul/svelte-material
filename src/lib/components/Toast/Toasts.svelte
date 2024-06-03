<script lang="ts">
	import toast from './store';
	import Snackbar from '../Snackbar/Snackbar.svelte';
	import ProgressLinear from '../ProgressLinear/ProgressLinear.svelte';
	import Icon from '../Icon/Icon.svelte';
	import Button from '../Button/Button.svelte';
	import info from '../../internal/Icons/info';
	import warning from '../../internal/Icons/warning';
	import success from '../../internal/Icons/success';
	import error from '../../internal/Icons/error';
	import hide from '../../internal/Icons/close';
	import type { Toast } from './store';
	import Style from '../../internal/Style';

	const icons = {
		info,
		warning,
		success,
		error
	};

	export let defaults:Toast = {};
	/** absolute sets the snackbar with position absolute otherwise it is fixed */
	export let absolute = false;
	/** top shows the snackbar on the top side of the page */
	export let top = false;
	/** left shows the snackbar on the left side of the page */
	export let left = false;
	export let bottom = false;
	export let right = false;
	export let center = false;
	/** offsetY defines the offset from the left or right side of the page */
	export let offsetX = '8px';
	/** offsetY defines the offset from the top or bottom side of the page */
	export let offsetY = '8px';
</script>

<div
	class="s-snackbar__wrapper"
	class:absolute
	class:top
	class:left
	class:bottom
	class:right
	class:center
	use:Style={{ 'snackbar-x': offsetX, 'snackbar-y': offsetY }}
>
	{#each $toast as item (item.id)}
		<Snackbar {...defaults} {...item} on:close={() => toast.pop(item.id)} let:progress>
			<ProgressLinear striped backgroundColor="info" class="progress" value={progress} />
			<Icon style="color:white;" path={icons[item.type]} />{@html item.message}
			<Button
				style="margin-left:auto;background:transparent;"
				on:click={() => toast.pop(item.id)}
				fab
				depressed
				size="x-small"
			>
				<Icon path={hide} />
			</Button>
		</Snackbar>
	{/each}
</div>
