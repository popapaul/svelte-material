<script lang="ts">
    import { scale, type TransitionConfig } from 'svelte/transition';
    import Style from '../../internal/Style';
    let klass = '';
    /** classes added to the snackbar */
    export { klass as class };
    /** absolute sets the snackbar with position absolute otherwise it is fixed */
    export let absolute = false;
    /** active shows or hides the snackbar */
    export let active = true;
    /** top shows the snackbar on the top side of the page */
    export let top = false;
    /** left shows the snackbar on the left side of the page */
    export let left = false;
    export let bottom = false;
    export let right = false;
    export let center = false;
    /** offsetY defines the offset from the left or right side of the page */
    export let offsetX = '8px';
    /** offsetY defines the offset from the top or bottom side of the page */
    export let offsetY = '8px';
    /** outlined gives the snackbar a outlined style */
    export let outlined = false;
    /** text gives the snackbar a text style */
    export let text = false;
    /** rounded gives the snackbar a rounded style */
    export let rounded = false;
    /** tile gives the snackbar a tile style */
    export let tile = false;
    /** timout is the delay before the snackar hides away */
    export let timeout = 0;
    /** transiton function for the snackbar */
    export let transition:(node: Element, options?: any) => TransitionConfig = scale;
    /** styles added to the snackbar */
    export let style = '';


    $: {
      if (active && timeout) {
        setTimeout(() => {
          active = false;
        }, timeout);
      }
    }
  </script>
  
  <style lang="scss" src="./Snackbar.scss" global>
  </style>
  
  <div
    class="s-snackbar__wrapper"
    class:absolute
    class:top
    class:left
    class:bottom
    class:right
    class:center
    use:Style={{ 'snackbar-x': offsetX, 'snackbar-y': offsetY }}>
    {#if active}
      <div
        transition:transition
        on:introstart
        on:outrostart
        on:introend
        on:outroend
        class="s-snackbar {klass}"
        class:outlined
        class:text
        class:rounded
        class:tile
        {style}>
        <slot />
      </div>
    {/if}
  </div>