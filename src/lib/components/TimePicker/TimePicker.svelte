<script lang="ts">
	import ButtonBar from './footer/ButtonBar.svelte';
	import ClockWrapper from './clock/ClockWrapper.svelte';
	import TimeToolbar from './header/TimeToolbar.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { TimeMode } from './clock/Hand.svelte';

	const dispatch = createEventDispatcher();



	// Shows/hides the footer buttons bar
	// Shows/hides the header time toolbar

	// Toggles on AM/PM or 24h mode

	// step increment for minutes
	// Starts by displaying the hours/minutes


	interface Props {
		value: Date;
		clockClassName?: string;
		hasButtons?: boolean;
		hasToolbar?: boolean;
		is24h?: boolean;
		minutesIncrement?: number;
		zIndex?: number;
		mode?: TimeMode;
		hourOnly?: boolean;
	}

	let {
		value = $bindable(),
		clockClassName = '',
		hasButtons = false,
		hasToolbar = true,
		is24h = true,
		minutesIncrement = 1,
		zIndex = 10,
		mode = $bindable('hour'),
		hourOnly = false
	}: Props = $props();

	const handleMode = ({ detail }: CustomEvent<TimeMode>) => {
		if (hourOnly) return (mode = 'hour');
		mode = detail;
	};

	const handleHour = ({ detail }: CustomEvent<Date>) => {
		if (hourOnly) {
			mode = 'minute';
		}
	};
</script>

<div class="time-picker">
	{#if hasToolbar}
		<TimeToolbar {mode} on:mode={handleMode} {value} {is24h} />
	{/if}
	<ClockWrapper
		{clockClassName}
		{is24h}
		{minutesIncrement}
		{zIndex}
		{mode}
		bind:value
		on:change
		on:hour={handleHour}
		on:hour
		on:minute
		on:currentPosition
	/>
	{#if hasButtons}
		<ButtonBar
			bind:value
			on:cancel
			on:ok={() => dispatch('ok', value)}
			on:resetHoursMinutes={() => (mode = 'hour')}
		/>
	{/if}
</div>

<style>
	.time-picker {
		align-items: center;
		display: flex;
		flex-direction: column;
	}
</style>
