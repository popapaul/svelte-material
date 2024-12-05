<script module lang="ts">
	export type DateMode = 'days' | 'month' | 'year';
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { isDate } from '../../internal/Date/date';
	import Day from './Day.svelte';
	import Month from './Month.svelte';
	import Year from './Year.svelte';

	interface Props {
		locale?: string;
		onRender?: (date: Date) => { disabled?: boolean; message?: string };
		header?: boolean;
		weekStart: number;
		value?: Date;
		noDateText?: string;
		mode?: DateMode;
	}

	let {
		locale = 'ro',
		onRender = () => ({}),
		header = true,
		weekStart,
		value = $bindable(),
		noDateText = 'No Date',
		mode = $bindable('days')
	}: Props = $props();

	const dispatch = createEventDispatcher();

	let month = $state();
	let year = $state();
	let elm = $state();

	let d = isDate(value) ? new Date(value?.getTime?.() || value) : new Date();

	month = d.getMonth();
	year = d.getFullYear();

	function onView({ detail }) {
		mode = detail.type;
	}
	function onYear({ detail }) {
		year = +detail.year;
		mode = 'month';
	}
	function onMonth({ detail }) {
		month = +detail.month;
		year = +detail.year;
		mode = 'days';
	}
	function onDay({ detail }) {
		value = new Date(detail.getTime());
		dispatch('change', value);
	}
</script>

<div class="datepicker">
	{#if header}
		<div class="header">
			{#if isDate(value)}
				<div class="year">{('000' + value.getFullYear()).slice(-4)}</div>
				<div class="date">
					{new Intl.DateTimeFormat(locale, {
						weekday: 'long',
						month: 'short',
						day: 'numeric'
					}).format(value)}
				</div>
			{:else}
				<div class="year">&nbsp;</div>
				<div class="date">{noDateText}</div>
			{/if}
		</div>
	{/if}
	<div class="body" bind:this={elm}>
		{#if mode === 'year'}
			<Year {year} on:select={onYear} />
		{:else if mode === 'month'}
			<Month {locale} bind:year {value} on:select={onMonth} on:changeView={onView} />
		{:else}
			<Day
				{locale}
				{onRender}
				bind:month
				bind:year
				{value}
				{weekStart}
				on:select={onDay}
				on:changeView={onView}
			/>
		{/if}
	</div>
</div>

<style>
	.datepicker {
		position: relative;
	}
	.header {
		box-sizing: border-box;
		color: #fff;
		color: var(--alternate, #fff);
		background: #1976d2;
		background: var(--primary, #1976d2);
		padding: 10px 16px;
	}
	.year {
		font-size: 16px;
		font-weight: 700;
		opacity: 0.6;
	}
	.date {
		font-size: 28px;
		font-weight: 500;
	}
	.body {
		width: 260px;
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
