<script lang="ts">
	import { isDate } from '../../internal/Date/date';
	export let value: Date;
	export let locale: string;
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

<div class="header">
	{#if isDate(value)}
		<button class="year" on:click={() => dispatch('mode', 'year')}
			>{('000' + value.getFullYear()).slice(-4)}</button
		>
		<div class="date">
			<button on:click={() => dispatch('mode', 'days')}>
				{new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric' }).format(value)}
			</button>
			<button on:click={() => dispatch('mode', 'month')}>
				{new Intl.DateTimeFormat(locale, { month: 'short' }).format(value)}
			</button>
		</div>
	{:else}
		<div class="year">&nbsp;</div>
		<div class="date"></div>
	{/if}
</div>

<style>
	.header {
		box-sizing: border-box;
		color: #fff;
		color: var(--alternate, #fff);
		background: #1976d2;
		background: var(--primary, #1976d2);
		padding: 16px;
		height: 97px;
	}
	.year {
		font-size: 16px;
		font-weight: 700;
		opacity: 0.6;
		margin-bottom: 8px;
	}
	.date {
		font-size: 28px;
		font-weight: 500;
	}
	@media only screen and (max-height: 400px) and (min-width: 420px) {
		.header {
			height: auto;
			width: 148px;
		}
	}
</style>
