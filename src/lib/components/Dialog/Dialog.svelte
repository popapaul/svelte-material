<script context="module" lang="ts">
  const dialogs= new Set<()=>void>();

  typeof window !== "undefined" && window.addEventListener("keydown", handleEsc);

  function handleEsc(event:KeyboardEvent) {
		if (event.key === 'Escape' || event.keyCode===27) {;
      [...dialogs][dialogs.size-1]?.();
		}
	}
</script>

<script lang="ts">
  import "./Dialog.scss";
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
  export let height:number|string = "auto";
  /** changes dialog for fullscreen display */
  export let fullscreen:boolean = false;
  /** transition of the dialog */
  export let transition: (node: Element, options: any) => TransitionConfig = scale;
  /** props for the overlay */
  export let overlay:any = {};

  export let zindex:number = 10;

  const dispatch = createEventDispatcher();

  function close() {
    if (!persistent) 
    active = false;
    dispatch("close");
    dialogs.delete(close);
  }

  $: visible = active && !disabled;
  $: visible && dialogs.add(close);
</script>



<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if $$slots.activator}
  <div on:click={() => active = true} style="display:contents;">
    <slot name="activator"/>
  </div>
{/if}

{#if visible}
  <div use:portal={".s-app"}>
      <div role="document" class:visible class="s-dialog" style="--s-index:{zindex}; --s-dialog-width:{width};--s-dialog-height:{format(height)};">
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
        <Overlay index={zindex-1} {...overlay} active={visible} on:click={close}/> 
      </div>
  </div>
{/if}
