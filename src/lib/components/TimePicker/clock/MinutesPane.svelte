<script>
	/* Copyright (c) 2020-2022 Jacques Desodt */
	import Item from './Item.svelte';
	import { minuteToDegrees } from '../scripts/dates';

	export let value = new Date();

	/* Local variables */
	const degrees = [300, 330, 0, 30, 60, 90, 120, 150, 180, 210, 240, 270];
	const minutes = ['05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '00'];

	$: selectedDegrees = minuteToDegrees(value);
</script>

{#each degrees as item, index}
	<Item degrees={item} {selectedDegrees} label={minutes[index]} />
{/each}
