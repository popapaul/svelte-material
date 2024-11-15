<script lang="ts">
	import { setContext, getContext } from 'svelte';
	import './List.scss';

	/** classes added to the list */
	
	interface Props {
		class?: string;
		/** reduces padding of list items */
		dense?: boolean;
		/** disables the list */
		disabled?: boolean;
		/** removes box shadow from the list */
		flat?: boolean;
		/** adds border radius to the list */
		rounded?: boolean;
		/** makes the list items navigation style */
		nav?: boolean;
		/** adds a thin outline to the list */
		outlined?: boolean;
		/** styles to add to the list */
		style?: string;
		children?: import('svelte').Snippet;
	}

	let {
		class: klass = '',
		dense = false,
		disabled = null,
		flat = false,
		rounded = false,
		nav = false,
		outlined = false,
		style = null,
		children
	}: Props = $props();

	let role = $state(null);
	if (!getContext('S_ListItemRole')) {
		setContext('S_ListItemRole', 'listitem');
		role = 'list';
	}
</script>

<div
	{role}
	class="s-list {klass}"
	aria-disabled={disabled}
	class:dense
	class:disabled
	class:flat
	class:nav
	class:outlined
	class:rounded
	{style}
>
	{@render children?.()}
</div>
