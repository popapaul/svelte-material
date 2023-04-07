<script lang="ts">
    import type { TransitionConfig } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';
    const dispatch = createEventDispatcher();
    import Button from '../Button/Button.svelte';
    let klass = '';
    /** classes added to the alert */
    export { klass as class };
    /** is the alert active/dismissed. */
    export let visible = true;
    /** the transition for the alert */
    export let transition:(node: Element, options: any) => TransitionConfig = fade;
    /** transition options */
    export let transitionOpts:any = { duration: 0 };
    /** makes the alert dense */
    export let dense = false;
    /** adds a thin outline */
    export let outlined = false;
    /** applies the defined color to text and a low opacity background of the same */
    export let text = false;
    /** removes the border radius */
    export let tile = false;
    /** adds a close icon that can hide the alert */
    export let dismissible = false;
    /** location of the border */
    export let border = false;
    /** applies the defined color to the alert's border */
    export let coloredBorder = false;
    
    function dismiss() {
      visible = false;
      /**
       * Triggered when alert is dismissed.
       * @returns Nothing
       */
      dispatch('dismiss');
    }
  </script>
  
  <style lang="scss" src="./Alert.scss" global>
  </style>
  
  {#if visible}
    <div
      role="alert"
      class="s-alert {klass}"
      transition:transition={transitionOpts}
      on:introstart
      on:outrostart
      on:introend
      on:outroend
      class:dense
      class:outlined
      class:text
      class:tile
      class:colored-border={coloredBorder}>
      <div class="s-alert__wrapper">
        <!-- Slot for icon at beginning of alert. -->
        <slot name="icon" />
        <div class="s-alert__content">
          <slot />
        </div>
        {#if dismissible}
          <Button icon on:click={dismiss}>
            <!-- Slot for close button icon. -->
            <slot name="close">✖</slot>
          </Button>
        {/if}
        {#if border}
          <div class="s-alert__border border-{border}" />
        {/if}
      </div>
    </div>
  {/if}