<script lang="ts">
	import Button from '../../Button/Button.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	interface Props {
		value?: any;
		now?: import('svelte').Snippet;
		ok?: import('svelte').Snippet;
		cancel?: import('svelte').Snippet;
	}

	let {
		value = $bindable(new Date()),
		now,
		ok,
		cancel
	}: Props = $props();

	const handleCancel = () => {
		dispatch('cancel');
		dispatch('resetHoursMinutes');
	};

	const handleNow = () => {
		value = new Date();
		dispatch('change');
		dispatch('resetHoursMinutes');
	};

	const handleOk = () => {
		dispatch('ok');
		dispatch('resetHoursMinutes');
	};
</script>

<div class="tp-wrapper">
	<button onclick={handleNow}>
		{#if now}{@render now()}{:else}
			<Button>Now</Button>
		{/if}
	</button>
	<button onclick={handleOk}>
		{#if ok}{@render ok()}{:else}
			<Button>Ok</Button>
		{/if}
	</button>
	<button onclick={handleCancel}>
		{#if cancel}{@render cancel()}{:else}
			<Button>Cancel</Button>
		{/if}
	</button>
</div>

<style>
	.tp-wrapper {
		align-items: center;
		display: flex;
		flex-direction: row;
		font-size: 20px;
		height: 2.5rem;
		justify-content: center;
		position: relative;
		width: 100%;
	}
</style>
