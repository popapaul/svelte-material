<script>
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	import { formatTime } from '../scripts/dates';

	/** @type {{hour?: boolean, selected?: boolean, value?: number, is24h: any}} */
	let {
		hour = true,
		selected = false,
		value = 0,
		is24h
	} = $props();

	let am = $derived(value >= 0 && value < 12);

	let pmHour = $derived(is24h ? value : value - 12 === 0 ? 12 : value - 12);
</script>

<button type="button" class="_tp-value" class:selected onclick={bubble('click')}>
	{formatTime(hour ? (am ? value : pmHour) : value)}
</button>

<style>
	._tp-value {
		padding: 0 4px;
		border-radius: 4px;
		color: hsla(0, 0%, 100%, 0.5);
		cursor: pointer;
		transition-duration: 0.3s;
		transition-property: background-color, border-color, color, fill, stroke;
	}
	._tp-value:hover {
		background-color: rgba(0, 0, 0, 0.1);
	}
	._tp-value.selected {
		color: #fff;
	}
</style>
