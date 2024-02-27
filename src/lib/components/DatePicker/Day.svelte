<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import Icon from '../Icon/Icon.svelte';
	import Button from '../Button/Button.svelte';
	export let locale: string;
	export let onRender: (date: Date) => { disabled?: boolean; message?: string };
	export let value: Date = new Date();
	export let month: number;
	export let year: number;
	export let weekStart = 1; // Number
	let direction = 0;
	const dispatch = createEventDispatcher();
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	onMount(() => {
		if (!locale) {
			locale =
				navigator.languages && navigator.languages.length
					? navigator.languages[0]
					: navigator.language || 'ro';
		}
	});

	const calendarize = (year: number, month: number, offset: number) => {
		let i = 0,
			j = 0,
			week: number[],
			out: number[][] = [];

		// day index (of week) for 1st of month
		var first = new Date(year, month, 1 - (offset | 0)).getDay();

		// how many days there are in this month
		var days = new Date(year, month + 1, 0).getDate();

		while (i < days) {
			for (j = 0, week = Array(7); j < 7; ) {
				while (j < first) week[j++] = 0;
				week[j++] = ++i > days ? 0 : i;
				first = 0;
			}
			out.push(week);
		}

		return out;
	};

	function onMonth() {
		direction = 0;
		dispatch('changeView', { type: 'month' });
	}
	function onDay(date: Date) {
		value = date;
		dispatch('select', value);
	}
	function onKeydown(e) {
		// click simulate
		if (e.keyCode === 13 || e.keyCode === 32) {
			e.stopPropagation();
			e.preventDefault();
			const clickEvent = new MouseEvent('click', {
				bubbles: true,
				cancelable: true
			});
			e.target.dispatchEvent(clickEvent);
			e.target.blur();
		}
	}
	function isEqualDate(d1: Date, d2: Date) {
		return (
			d1 &&
			d2 &&
			d1.getFullYear() === d2.getFullYear() &&
			d1.getMonth() === d2.getMonth() &&
			d1.getDate() === d2.getDate()
		);
	}
	function addMonths(amount: number) {
		let d = new Date(new Date().setFullYear(year, month, 1));
		d.setMonth(d.getMonth() + amount);
		month = d.getMonth();
		year = d.getFullYear();
		direction = amount;
	}
</script>

<div class="view">
	<div class="toolbar">
		<Button
			icon
			style="z-index: 5;"
			disabled={year < 2 && month < 1}
			on:click={() => {
				addMonths(-1);
			}}
		>
			<Icon
				path="<svg><path fill='currentColor' d='M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z'></path></svg>"
			/>
		</Button>
		<Button
			icon
			style="z-index: 5;"
			on:click={() => {
				addMonths(1);
			}}
		>
			<Icon
				path="<svg><path fill='currentColor' d='M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z'></path></svg>"
			/>
		</Button>
	</div>
	<div class="grid">
		<div
			class="grid-cell"
			in:fly|local={{ x: direction * 50, duration: 200, delay: 80 }}
			out:fade|local={{ duration: direction === 0 ? 0 : 160 }}
		>
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div class="title" on:keydown={onKeydown} on:click={onMonth}>
				{new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(year, month, 1))}
				{('000' + year).slice(-4)}
			</div>
			<div class="weekdays">
				{#each Array(7) as _, day}
					<span class="cell">
						{new Intl.DateTimeFormat(locale, { weekday: 'narrow' }).format(
							new Date(1970, 0, 4 + weekStart + day)
						)}
					</span>
				{/each}
			</div>
			{#each calendarize(year, month, weekStart) as week}
				<div class="row">
					{#each week as day}
						<div class="cell">
							{#if day}
								{@const date = new Date(year, month, day)}
								{@const attrs = onRender?.(date) ?? {}}
								<button
									type="button"
									tabindex={attrs.disabled ? -1 : 0}
									data-message={attrs.message || null}
									class="day-control"
									class:today={isEqualDate(date, today)}
									class:selected={isEqualDate(date, isNaN(value?.getTime()) ? new Date(0) : value)}
									class:disabled={attrs.disabled}
									on:keydown={onKeydown}
									on:click={() => !attrs.disabled && onDay(date)}
								>
									{day}
								</button>
							{/if}
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.view {
		position: relative;
		padding: 0 8px 4px;
	}
	.toolbar {
		padding: 0 5px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: absolute;
		height: 48px;
		top: 0;
		right: 0;
		left: 0;
	}
	.grid {
		width: 100%;
		user-select: none;
		display: grid;
	}
	.grid-cell {
		position: relative;
		z-index: 3;
		grid-column: 1;
		grid-row: 1;
	}
	.grid-cell:nth-child(2) {
		grid-row: 1;
	}
	.title {
		height: 48px;
		font-size: 16px;
		letter-spacing: 0.75px;
		text-align: center;
		margin: 0 48px;
		outline: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.title:focus,
	.title:hover,
	.title:active {
		color: #1976d2;
		color: var(--primary, #1976d2);
	}
	.weekdays {
		display: flex;
		justify-content: space-between;
		font-weight: 500;
		margin: 8px 0;
		opacity: 0.5;
	}
	.row {
		display: flex;
		justify-content: space-between;
		text-align: center;
		margin-bottom: 2px;
	}
	.cell {
		position: relative;
		width: 34px;
		height: 34px;
		user-select: none;
	}
	.weekdays .cell {
		text-align: center;
		width: 36px;
		height: unset;
	}
	.day-control:after {
		content: attr(data-message);
		position: absolute;
		bottom: 115%;
		opacity: 0;
		left: 50%;
		color: black;
		transform: translateX(-100%);
		background-color: rgb(252, 207, 8);
		pointer-events: none;
		border-radius: 10%;
		margin-top: 4px;
		text-align: center;
		z-index: 2;
		visibility: hidden;
		max-width: 120px;
		width: max-content;
		color: black;
		box-shadow:
			0 1px 3px 0 rgb(0 0 0 / 0.1),
			0 1px 2px -1px rgb(0 0 0 / 0.1);
	}
	.day-control:hover::after {
		opacity: 1;
		visibility: visible;
	}
	.day-control {
		font-size: 14px;
		font-weight: 500;
		display: block; /* .selected need it */
		box-sizing: border-box;
		cursor: pointer;
		position: relative;
		width: 34px;
		height: 34px;
		line-height: 34px;
		border-radius: 50%;
		border: none;
	}
	.day-control.disabled {
		cursor: auto;
		color: #afafaf;
	}
	.day-control.today {
		border: 1px solid;
		border-color: #1976d2;
		border-color: var(--primary, #1976d2);
		color: #1976d2;
		color: var(--primary, #1976d2);
		line-height: 32px; /* 2px border */
	}
	.day-control.selected {
		background: #1976d2;
		background: var(--primary, #1976d2);
		color: #fff;
		color: var(--alternate, #fff);
		font-weight: 700;
	}
	.day-control:focus {
		outline: none;
	}
	.day-control:before {
		border-radius: inherit;
		color: inherit;
		bottom: 0;
		content: '';
		left: 0;
		opacity: 0;
		pointer-events: none;
		position: absolute;
		right: 0;
		top: 0;
		transition: 0.4s cubic-bezier(0.25, 0.8, 0.5, 1);
		will-change: background-color, opacity;
	}
	@media (hover: hover) {
		.day-control:hover:not([disabled]):not(.disabled):before {
			background-color: currentColor;
			opacity: 0.15;
		}
		:global(.focus-visible.day-control:focus:not([disabled]):not(.disabled):before) {
			background-color: currentColor;
			opacity: 0.3;
		}
	}
</style>
