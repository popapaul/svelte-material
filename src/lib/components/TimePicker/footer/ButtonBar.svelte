<script lang="ts">
	import Button from '../../Button/Button.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let value = new Date();

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
	<button on:click={handleNow}>
		<slot name="now">
			<Button>Now</Button>
		</slot>
	</button>
	<button on:click={handleOk}>
		<slot name="ok">
			<Button>Ok</Button>
		</slot>
	</button>
	<button on:click={handleCancel}>
		<slot name="cancel">
			<Button>Cancel</Button>
		</slot>
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
