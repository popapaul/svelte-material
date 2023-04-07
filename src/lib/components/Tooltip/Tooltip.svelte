<script lang="ts">
  import { createPopperActions } from 'svelte-popperjs';
  import type { Placement, PositioningStrategy } from '@popperjs/core';
  import BackgroundColor from '../../internal/BackgroundColor';
	import { fade } from 'svelte/transition';


  let klass = '';
  export { klass as class };
  export let color = 'default';
  export let active = false;
  export let placement:Placement = 'bottom';
  export let strategy: PositioningStrategy = "fixed";
  export let wrapperClass = "";
   /** The transition function for the tooltip. */
   export let transition = fade;
  /** Options for the transition when tooltip opens. */
  export let inOpts = { duration: 250 };
  /** Options for the transition when tooltip closes. */
  export let outOpts = { duration: 250 };

  const [popperRef, popperContent] = createPopperActions();
</script>

<style lang="scss" src="./Tooltip.scss" global>
</style>

<div
  use:popperRef
  on:mouseenter={()=>active=true}
  on:mouseleave={()=>active=false}
  
  class="s-tooltip__wrapper {wrapperClass}">
  <!-- Slot for the element that display the tooltip -->
  <slot />
</div>
{#if active}
  <span
    on:mouseenter={()=>active=true}
    on:mouseleave={()=>active=false}
    in:transition={inOpts}
    out:transition={outOpts}
    use:popperContent={{
      placement, 
      strategy, 
      modifiers :[
        { name: 'offset', options: { offset: [0, 8] } }
      ]
    }}
    class="s-tooltip {klass}"
    class:active
    use:BackgroundColor={color}>
    <!-- Slot for the content of the tooltip -->
    <slot name="tip" />
  </span>
{/if}