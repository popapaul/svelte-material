<script >/* Copyright (c) 2020-2022 Jacques Desodt */
import Item from './Item.svelte';
import { getAmPm, hourToDegrees } from '../scripts/dates';
export let is24h=  false;
export let value = new Date();

const degrees = [300, 330, 0, 30, 60, 90, 120, 150, 180, 210, 240, 270];

$: selectedAmpm = is24h ? getAmPm(value) : 'am';

$: selectedDegrees = hourToDegrees(value);
/* Gets the label for a PM item */
const getLabel = (index) => {
    const realIndex = index === 11 ? 0 : (index + 1 + 12);
    return realIndex + '';
};
</script>

<!-- AM -->
{#each degrees as item, index}
    <Item ampm="am" degrees={item} {selectedAmpm} {selectedDegrees} label={'' +( index + 1)}/>
{/each}
<!-- PM -->
{#if is24h}
    {#each degrees as item, index}
        <Item ampm="pm" degrees={item} {selectedAmpm} {selectedDegrees} label={getLabel(index)}/>
    {/each}
{/if}
