<script lang="ts">
  import ProgressLinear from '../ProgressLinear/ProgressLinear.svelte';

  let klass:string = '';
  /** classes added to the card */
  export { klass as class };
  /** remove box shadow from card */
  export let flat: boolean = false;
  /** remove border radius */
  export let tile: boolean = false;
  /** adds a thin border */
  export let outlined: boolean = false;
  /** makes the card more elevated */
  export let raised: boolean = false;
  /** add border radius to opposite corners */
  export let shaped: boolean = false;
  /** more elevation on hover */
  export let hover: boolean = false;
  /** card with button-like functionality */
  export let link: boolean = false;
  /** shows the linear progress bar */
  export let loading: boolean = false;
  /** disables the card and lowers opacity */
  export let disabled: boolean = false;
  /** styles added the card */
  export let style:string = null;

</script>

<style lang="scss" src="./Card.scss" global>
</style>

<div
  class="s-card {klass}"
  class:flat
  class:tile
  class:outlined
  class:raised
  class:shaped
  class:hover
  class:link
  class:disabled
  {style}>
  {#if loading}
    <slot name="progress">
      <ProgressLinear indeterminate />
    </slot>
  {/if}
  <slot />
</div>
