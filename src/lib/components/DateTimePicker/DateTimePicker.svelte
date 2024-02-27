<script lang="ts">
	import DatePicker, { type DateMode } from '../DatePicker/DatePicker.svelte';
	import TimePicker from '../TimePicker/TimePicker.svelte';
	import { createEventDispatcher, type ComponentProps } from 'svelte';
	import TimeToolbar from '../TimePicker/header/TimeToolbar.svelte';
	import DateToolbar from '../DatePicker/DateToolbar.svelte';
	import type { TimeMode } from '../TimePicker/clock/Hand.svelte';

	export let value: Date;
	export let locale: string = 'ro';
	export let hourOnly: boolean = false;
	export let mode: Mode = 'days';
	export let weekStart: number = 1;
	export let onRender: (date: Date) => { disabled?: boolean; message?: string } = () => ({});
	export let noDateText: string = 'No Date';

	type Mode = 'days' | 'month' | 'year' | 'hour' | 'minute';

	type $$Props = Omit<ComponentProps<DatePicker>, 'mode'> &
		Omit<ComponentProps<TimePicker>, 'mode'> & {
			mode?: Mode;
		};

	const dispatch = createEventDispatcher();

	const handleDate = ({ detail: newDate }: CustomEvent<Date>) => {
		value ??= new Date();
		value = new Date(
			newDate.getFullYear(),
			newDate.getMonth(),
			newDate.getDate(),
			value.getHours(),
			value.getMinutes()
		);
		dispatch('change', value);
		mode = 'minute';
	};

	const handleHour = ({ detail: newTime }: CustomEvent<Date>) => {
		value ??= new Date();
		value = new Date(
			value.getFullYear(),
			value.getMonth(),
			value.getDate(),
			newTime.getHours(),
			hourOnly ? newTime.getMinutes() : 0
		);
		dispatch('change', value);
		if (hourOnly) dispatch('close', value);
	};

	const handleMinutes = () => {
		dispatch('close', value);
	};

	const toggleDate = ({ detail }: CustomEvent<DateMode>) => {
		mode = 'days';
	};
	const toggleTime = ({ detail }: CustomEvent<TimeMode>) => {
		mode = 'hour';
	};
</script>

<div class="datepicker">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="header">
		{#if mode === 'days' || mode === 'month' || mode === 'year'}
			<DateToolbar {value} on:mode={toggleDate} {locale} {...$$restProps} />
		{:else}
			<TimeToolbar bind:mode on:mode={toggleTime} {value} {...$$restProps} />
		{/if}
	</div>
	<div class="body">
		{#if mode === 'days' || mode === 'month' || mode === 'year'}
			<DatePicker
				{weekStart}
				{onRender}
				{noDateText}
				{...$$restProps}
				bind:mode
				{locale}
				{value}
				header={false}
				on:change={handleDate}
			/>
		{:else}
			<TimePicker
				{...$$restProps}
				hasToolbar={false}
				bind:mode
				{value}
				on:change
				on:hour={handleHour}
				on:minute={handleMinutes}
			></TimePicker>
		{/if}
	</div>
</div>

<style>
	.header {
		box-sizing: border-box;
		color: #fff;
		color: var(--alternate, #fff);
		background: #1976d2;
		background: var(--primary, #1976d2);
		padding: 16px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	:global(.modes .active) {
		color: var(--primary, #1976d2);
		background: #fff;
		background: var(--alternate, #fff);
	}

	.body {
		overflow: hidden;
	}
	@media only screen and (max-height: 400px) and (min-width: 420px) {
		.datepicker {
			display: flex;
		}
		.header {
			height: auto;
			width: 148px;
		}
	}
</style>
