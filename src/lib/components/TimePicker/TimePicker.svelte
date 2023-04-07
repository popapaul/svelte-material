<script lang="ts">
    import ButtonBar from './footer/ButtonBar.svelte';
    import ClockWrapper from './clock/ClockWrapper.svelte';
    import TimeToolbar from './header/TimeToolbar.svelte';
    import {createEventDispatcher} from 'svelte';
	import type { TimeMode } from './clock/Hand.svelte';

    const dispatch = createEventDispatcher();

    export let value:Date;

    export let clockClassName:string = '';

    // Shows/hides the footer buttons bar
    export let hasButtons:boolean = false;
    // Shows/hides the header time toolbar
    export let hasToolbar:boolean = true;

    // Toggles on AM/PM or 24h mode
    export let is24h:boolean = true;

    // step increment for minutes
    export let minutesIncrement:number = 1;
    // Starts by displaying the hours/minutes
    export let zIndex:number = 10;

    export let mode:TimeMode = "hour"; 

    export let hourOnly:boolean=false;

    const handleMode = ({detail}:CustomEvent<TimeMode>)=>{
        if(hourOnly)
            return mode="hour"
        mode=detail;
    }

    const handleHour = ({detail}:CustomEvent<Date>) =>{
        if(hourOnly)
        {
            mode = "minute";
        }
    }
</script>

<div class="time-picker">
    {#if hasToolbar}
        <TimeToolbar {mode} on:mode={handleMode}  {value} {is24h} />
    {/if}
        <ClockWrapper {clockClassName} {is24h} {minutesIncrement} {zIndex} {mode} 
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
                on:resetHoursMinutes={()=>mode = "hour"}
    />
    {/if}
</div>

<style>
    .time-picker{
        align-items:center;
        display:flex;
        flex-direction:column;
    }
</style>
