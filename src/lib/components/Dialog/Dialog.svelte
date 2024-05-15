<script lang="ts">
	import './Dialog.scss';
	import { createEventDispatcher } from 'svelte';

	let klass: string = '';

	export { klass as class };
	export let style:string = "";
	/** controls whether the dialog is visible or hidden */
	export let active: boolean = false;
	/** disables the ability to open the dialog */
	export let disabled: boolean = false;
	/** changes dialog for fullscreen display */
	export let fullscreen: boolean = false;
	/** sets the width for the dialog */
	export let width: number | string = fullscreen ? "100%" : "500px";
	/** sets the height for the dialog */
	export let height: number | string = fullscreen ? '100%' : "";


	let dialog: HTMLDialogElement;

	const dispatch = createEventDispatcher();

	function open(){
		if(disabled) return;
		dialog.showModal();
	}

	function close() {
		active = false;
		dialog?.close();
		dispatch('close');
	}
	$: active ? open() : close(); 
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if $$slots.activator}
	<div on:click|preventDefault|stopPropagation={() => (active = true)} style="display:contents;">
		<slot name="activator" />
	</div>
{/if}

<dialog class="s-dialog {klass}" style:width style:height {style} bind:this={dialog} on:close={close} on:close>
	{#if active}
	<slot {close} />
	{/if}
</dialog>

