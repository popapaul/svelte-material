<script lang="ts">
	import { clickOutside } from '../../actions/ClickOutside';
	import './Dialog.scss';
	import { fade } from 'svelte/transition';


	interface Props {
		class?: string;
		style?: string;
		/** controls whether the dialog is visible or hidden */
		active?: boolean;
		/** disables the ability to open the dialog */
		disabled?: boolean;
		/** changes dialog for fullscreen display */
		fullscreen?: boolean;
		/** sets the width for the dialog */
		width?: number | string;
		/** sets the height for the dialog */
		height?: number | string;
		onclose?: () => void;
		activator?: import('svelte').Snippet;
		children?: import('svelte').Snippet<[any]>;
	}

	let {
		class: klass = '',
		style = '',
		active = $bindable(),
		disabled = false,
		fullscreen = false,
		width = fullscreen ? '100%' : '500px',
		height = fullscreen ? '100%' : '',
		onclose,
		activator,
		children
	}: Props = $props();

	let dialog: HTMLDialogElement = $state();

	async function open() {
		if (disabled) return;
		
		document.querySelector("body").style.overflow = "hidden";
		
		dialog?.showModal();
	}

	function close(event?:Event) {
		event?.stopPropagation();
		active = false;
		document.querySelector("body").style.overflow = "";
		//dialog?.close();
		onclose?.()
	}
	$effect(() => {
		active ? open() : close();
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
{#if activator}
	<div onclick={()=>active = true} style="display:contents;">
		{@render activator?.()}
	</div>
{/if}

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
{#if active}
	<dialog
		use:clickOutside
		transition:fade|global={{ duration: 300 }}
		class="s-dialog {klass}"
		style:width
		style:height
		{style}
		bind:this={dialog}
		onmousedown={(event) => event.target === event.currentTarget && close(event)}
		onclose={close}
	>
		{@render children?.({ close, })}
	</dialog>
{/if}
