<script lang="ts">
	import AmPm from './AmPm.svelte';
	import TimeValue from './TimeValue.svelte';
	import { createEventDispatcher } from 'svelte';
	import { toggleAmPm } from '../scripts/dates';
	import type { TimeMode } from '../clock/Hand.svelte';

	const dispatch = createEventDispatcher();

	interface Props {
		timeClassName?: string;
		is24h?: boolean;
		value: Date;
		mode?: TimeMode;
	}

	let {
		timeClassName = '',
		is24h = true,
		value = $bindable(),
		mode = $bindable('hour')
	}: Props = $props();

	/* Handles the AM choice event */
	function handleAm() {
		value = toggleAmPm(value, true);
	}

	/* Handles the PM choice event */
	function handlePm() {
		value = toggleAmPm(value, false);
	}
</script>

<div class="_tp-wrapper {timeClassName}">
	<TimeValue
		{is24h}
		selected={mode == 'hour'}
		value={value?.getHours()}
		on:click={() => dispatch('mode', 'hour')}
	/>
	<div class="_tp-separator">:</div>
	<TimeValue
		{is24h}
		hour={false}
		selected={mode == 'minute'}
		value={value?.getMinutes()}
		on:click={() => dispatch('mode', 'minute')}
	/>
	{#if !is24h}
		<div class="_tp-ampm">
			<AmPm on:am={handleAm} on:pm={handlePm} />
		</div>
	{/if}
</div>

<style>
	._tp-ampm {
		position: absolute;
		right: 1rem;
		top: 1.1rem;
	}
	._tp-separator {
		color: hsla(0, 0%, 100%, 0.6);
		padding: 0.1rem;
	}
	._tp-wrapper {
		color: var(--alternate, #fff);
		background: #1976d2;
		background: var(--primary, #1976d2);

		align-items: center;
		display: flex;
		text-align: center;
		flex-direction: row;
		font-size: 3rem;
		line-height: 3.2rem;
		height: 6rem;
		justify-content: center;
		position: relative;
		width: 100%;
	}
</style>
