<script>
    import { tweened } from 'svelte/motion'
    import { linear } from 'svelte/easing'
    import { toast } from './index'
    import close from "../../internal/Icons/close";
    import ProgressLinear from "../ProgressLinear/ProgressLinear.svelte"
    import Button from "../Button/Button.svelte"
    import Icon from "../Icon/Icon.svelte"
    import info from '../../internal/Icons/info';
    import warning from '../../internal/Icons/warning';
    import success from '../../internal/Icons/success';
    import error from '../../internal/Icons/error';
    import { scale } from 'svelte/transition';
    import { onMount } from 'svelte';

    export let transition = scale;
    
    export let outlined = false;
    export let text = false;
    export let rounded = false;
    export let tile = false;
    export let item;
    const icons = {
        info,
        warning,
        success,
        error
    }
    const progress = tweened(0, { duration: item.duration, easing: linear })

    const autoclose = () => {
      if ($progress === 1 || $progress === 0) {
        setTimeout(remove, item.duration * 0.02)
      }
    }

    const remove = () => toast.pop(item.id)
    
    let paused = false
    
    const pause = () => {
      if (item.pausable && !paused) {
        progress.set($progress, { duration: 0 })
        paused = true
      }
    }
    
    const resume = () => {
      if (paused) {
        const duration = ($progress* item.duration)/100;
        progress.set(0, { duration, easing: linear }).then(autoclose)
        paused = false
      }
    }

      onMount(()=>progress.set(0).then(autoclose))
    </script>


<div
    transition:transition 
    on:mouseenter={pause} 
    on:mouseleave={resume}
    on:introstart
    on:outrostart
    on:introend
    on:outroend
    class="s-snackbar snackbar-{item.type}"
    class:outlined
    class:text
    class:rounded
    class:tile>
    <ProgressLinear reversed striped backgroundColor="s-snackbar-progress" class="progress" value={Math.trunc($progress)}/>
    <Icon style="color:white;" path={icons[item.type]} />
    {@html item.message}
    <Button style="margin-left:auto;color:black;" on:click={remove} fab depressed size="x-small" >
        <Icon path={close} />
    </Button>
</div>
 