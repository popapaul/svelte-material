<script lang="ts">
  import { scale, type TransitionConfig } from 'svelte/transition';
  import {onMount} from "svelte";
  let klass:string = '';
  /** classes to add to badge */
  export { klass as class };

  export let value:string | number = '';

  export let active:boolean = true;
  export let bordered:boolean = false;
  export let dot:boolean = false;
  export let tile:boolean = false;
  export let bottom:boolean = false;
  export let left:boolean = false;
  export let label:string = 'Badge';
   /** the transition for the alert */
  export let transition:(node: Element, options: any) => TransitionConfig = scale;
  /** transition options */
  export let transitionOpts:any = { duration: 0 };

  export let offsetX:number | string = 6;
  export let offsetY:number | string = 6;

  export let wrapperClass="block";
  /** styles applied to the badge */
  export let style:string="";
  let mounted = false;

  onMount(() => setTimeout(() =>mounted = true,0));
</script>

<style lang="scss" src="./Badge.scss" global></style>

<span class="s-badge {wrapperClass}">
  <slot />
  <span class="s-badge__wrapper ">
    {#if active && mounted}
      <span
        class="s-badge__badge {klass}"
        transition:transition={transitionOpts}
        on:introstart
        on:outrostart
        on:introend
        on:outroend
        class:bordered
        class:dot
        class:tile
        class:bottom
        on:click
        on:keydown
        class:left
        role="status"
        aria-label={label}
        aria-live="polite"
        aria-atomic="true"
        style="--s-badge-offset-x:{offsetX}px;--s-badge-offset-y:{offsetY}px;{style}">
        <slot name="badge">{value}</slot>
      </span>
    {/if}
  </span>
</span>
