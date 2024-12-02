<script lang="ts">
	import TextField from '../TextField/TextField.svelte';
	import ColorPicker from '../ColorPicker/ColorPicker.svelte';
	import Menu from '../Menu/Menu.svelte';
	import type { ComponentProps } from 'svelte';
	interface Props {
		value?: string;
		colors?: string[];
		children?: import('svelte').Snippet;
	}

	let { value = $bindable(), colors = $bindable(), children, ...rest }: Props = $props();

	interface $$Events {
		focus: CustomEvent;
		blur: CustomEvent;
		change: CustomEvent<{
			hex: string;
			rgba: { r: number; g: number; b: number; a: number };
		}>;
	}

	type $$Props = ComponentProps<TextField> & {
		value?: string;
		colors?: string[];
	};

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
			on:keydown={onkeydown}
			on:clear={() => (value = '')}
			readonly
		>
			{@render children?.()}
			{#snippet prependOuter()}
				<div class="color-preview" style="background-color:{value??"black"};"></div>
			{/snippet}
			<!-- <slot slot="append" name="append" />
			<slot slot="prependOuter" name="prependOuter">
				
			</slot>
			<slot slot="appendOuter" name="appendOuter" />
			<slot slot="prepend" name="prepend" /> -->
		</TextField>
	{/snippet}
	<ColorPicker bind:value bind:colors on:change />
</Menu>

<style>
	.color-preview {
		width: 20px;
		height: 20px;
		border-radius: 50px;
		margin-right: 5px;
	}
</style>
