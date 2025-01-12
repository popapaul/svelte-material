<script lang="ts">
	import TextField from '../TextField/TextField.svelte';
	import ColorPicker from '../ColorPicker/ColorPicker.svelte';
	import Menu from '../Menu/Menu.svelte';
	import type { ComponentProps } from 'svelte';
	type Props = ComponentProps<typeof ColorPicker> & Omit<ComponentProps<typeof TextField>, "value" | "onchange"> & {
		children?: import('svelte').Snippet;
	}

	let { value = $bindable(), colors = $bindable(), onchange, ...rest }: Props = $props();

	let active = $state(false);

	const open = () => {
		active = true;
	};
	function onkeydown(e) {
		if (e.keyCode === 13 || e.keyCode === 32) {
			e.stopPropagation();
			e.preventDefault();
			open();
		}
	}
</script>

<Menu closeOnClick={false} bind:active placement="bottom-start">
	{#snippet activator()}
		<TextField
			{value}
			{...rest}
			onkeydown={onkeydown}
			onclear={() => (value = '')}
			readonly
		>
			{#snippet prependOuter()}
				<div class="color-preview" style="background-color:{value??"black"};"></div>
			{/snippet}
		</TextField>
	{/snippet}
	<ColorPicker bind:value bind:colors {onchange} />
</Menu>

<style>
	.color-preview {
		width: 20px;
		height: 20px;
		border-radius: 50px;
		margin-right: 5px;
	}
</style>
