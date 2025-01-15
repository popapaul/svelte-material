<script lang="ts">
	import TextField from '../TextField/TextField.svelte';
	import Icon from '../Icon/Icon.svelte';
	import icons from '../../internal/Icons';
	import type { ComponentProps } from 'svelte';
	
	interface Props extends ComponentProps<TextField<string>> {
		class?: string; // Optional string for the class name
		value?: string; // Optional string for the value
		showPassword?: boolean; // Optional boolean flag for showing password
		children?: import('svelte').Snippet; // Optional children of type Snippet from Svelte
	}
	let {
		class: klass = '',
		value = $bindable(),
		showPassword = $bindable(false),
		children,
		...rest
	}:Props = $props();
</script>

<TextField {...rest} class={klass} type={!showPassword ? 'password' : 'text'} bind:value>
	{#snippet append()}
		<Icon
			onclick={() => (showPassword = !showPassword)}
			style="cursor:pointer"
			path={showPassword ? icons.visibility_off : icons.visibility}
		/>
	{/snippet}
	{@render children?.()}
</TextField>
