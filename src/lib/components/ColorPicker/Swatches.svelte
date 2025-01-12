<script lang="ts">
	import Button from '../Button/Button.svelte';
	import Icon from '../Icon/Icon.svelte';
	import Add from '../../internal/Icons/add';

	import { fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import Menu from '../Menu/Menu.svelte';
	import ListItem from '../List/ListItem.svelte';
	import List from '../List/List.svelte';
	interface Props {
		colors?: string[];
		color: string;
		onchange?: (colors:string[])=>void;
		onselect?:(color:string)=>void;
	}

	let { colors = $bindable(), color =  $bindable(), onchange, onselect }: Props = $props();

	const addColor = () => {
		if (!color) return;
		colors ??= []; 
		colors.push(color);
		colors = [...new Set(colors)];
		onchange?.(colors);
	};
</script>

<div class="swatches">
	{#each colors as color (color)}
		<div transition:fade animate:flip>
			<Menu rightClick>
				{#snippet activator()}
								<Button
						
						onclick={() => onselect?.(color)}
						icon
						fab
						size="x-small"
						style="color:{color};"
					>
						<div class="swatch" style="background-color:{color};"></div>
					</Button>
							{/snippet}
				<List>
					<ListItem onclick={() => (colors = colors.filter((x) => x != color))}>remove</ListItem>
				</List>
			</Menu>
		</div>
	{/each}
	{#if color && !colors?.some((x) => x == color)}
		<div in:fade>
			<Button disabled={!color} onclick={addColor} style="color:{color};" icon fab size="x-small">
				<div class="swatch" style="background-color:{color};color:white;">
					<Icon path={Add} />
				</div>
			</Button>
		</div>
	{/if}
</div>

<style>
	.swatches {
		display: flex;
		flex-wrap: wrap;
	}
	.swatch {
		height: 24px;
		width: 24px;
		margin: auto;
		border-radius: 50px;
	}
</style>
