<script lang="ts">
	import TextField from '../TextField/TextField.svelte';
	import Icon from '../Icon/Icon.svelte';
	import icons from '../../internal/Icons';
	
	/** @type {{class?: string, value?: string, showPassword?: boolean, children?: import('svelte').Snippet, [key: string]: any}} */
	let {
		class: klass = '',
		value = $bindable(),
		showPassword = $bindable(false),
		children,
		...rest
	} = $props();
</script>

<TextField {...rest} class={klass} type={!showPassword ? 'password' : 'text'} bind:value>
	{#snippet append()}
		<Icon
			on:click={() => (showPassword = !showPassword)}
			style="cursor:pointer"
			path={showPassword ? icons.visibility_off : icons.visibility}
		/>
	{/snippet}
	{@render children?.()}
</TextField>
