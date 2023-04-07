<script lang="ts">
    import {createEventDispatcher} from 'svelte';
    import {isAm} from '../scripts/dates';

    const dispatch = createEventDispatcher();
</script>

<button class="_tp-part" on:click|stopPropagation={() => dispatch('am')}>
    AM
</button>
<button class="_tp-part" on:click|stopPropagation={() => dispatch('pm')}>
    PM
</button>

<style>._tp-part{color:hsla(0,0%,100%,.4);cursor:pointer;font-size:1.3rem;margin:.25rem;transition-duration:.3s;transition-property:background-color,border-color,color,fill,stroke}._tp-part:hover{background-color:rgba(0,0,0,.1)}</style>
