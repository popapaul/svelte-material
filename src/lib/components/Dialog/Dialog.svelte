<script lang="ts">
  import Overlay from '../Overlay/Overlay.svelte';
  import {format} from '../../internal/Style';
  import {portal} from "../../actions/Portal";
  import { scale, type TransitionConfig } from 'svelte/transition';
  import {createEventDispatcher} from "svelte"

  let klass:string = '';

  export { klass as class };
  /** controls whether the dialog is visible or hidden */
  export let active:boolean = false;
  /** clicking outside of the dialog will not deactivate it */
  export let persistent:boolean = false;
  /** disables the ability to open the dialog */
  export let disabled:boolean = false;
  /** sets the width for the dialog */
  export let width:number|string = 500;
  /** sets the width for the dialog */
  export let height:number|string = 500;
  /** changes dialog for fullscreen display */
  export let fullscreen:boolean = false;
  /** transition of the dialog */
  export let transition: (node: Element, options: any) => TransitionConfig = scale;
  /** props for the overlay */
  export let overlay:any = {};

  export let zindex:number = 100;

  let hovererd=false;

  const dispatch = createEventDispatcher();

  function close() {
    if (!persistent) active = false;
    dispatch("close")
  }

  $: visible = active && !disabled;

  function handleEsc(event) {
		if (hovererd && (event.key === 'Escape' || event.keyCode===27)) {
      event.stopPropagation();
			active = false;	
      close();
		}
	}
</script>

<style lang="scss" src="./Dialog.scss" global>
</style>

<svelte:window on:keydown={handleEsc} />
{#if visible}
<div use:portal={".s-app"}>
    <div role="document" on:mouseleave={()=>hovererd=false} on:mouseenter={()=>hovererd=true} class:visible class="s-dialog" style="--s-index:{zindex}; --s-dialog-width:{width};--s-dialog-height:{format(height)};">
      <div
        class="s-dialog__content {klass}"
        class:fullscreen
        transition:transition={{ duration: 300, start: 0.1 }}
        on:introstart
        on:outrostart
        on:introend
        on:outroend>
        <slot />
      </div>
      <Overlay index={zindex-1} {...overlay} active={visible} on:click={close}> </Overlay>
    </div>
   
</div>
{/if}
