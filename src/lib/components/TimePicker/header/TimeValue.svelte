<script>
    import {formatTime} from '../scripts/dates';


    export let hour = true;
    export let selected = false;
    export let value = 0;
    export let is24h;


    $: am = value >= 0 && value < 12;

    $: pmHour = is24h ? value : ((value - 12) === 0 ? 12 : value - 12);

</script>


<button type="button" class="_tp-value" class:selected on:click>
    {formatTime(hour ? (am ? value : pmHour) : value)}
</button>

<style>
    ._tp-value 
    {
        padding:0 4px;
        border-radius: 4px;
        color:hsla(0,0%,100%,.5);
        cursor:pointer;
        transition-duration:.3s;
        transition-property:background-color,border-color,color,fill,stroke
    }
    ._tp-value:hover
    {
        background-color:rgba(0,0,0,.1)
    }
    ._tp-value.selected{
        color:#fff;
    }
</style>
