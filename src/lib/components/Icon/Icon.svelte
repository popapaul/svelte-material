<script lang="ts">
  import {format} from '../../internal/Style';

  let klass = '';
  /** classes added to the icon */
  export { klass as class };
  /** size of the icon */
  export let size:string | number = '24px';
  /** degress by which to rotate the icon */
  export let rotate:number = 0;
  /** makes the icon spin */
  export let spin:boolean = false;
  /** disables the icon */
  export let disabled:boolean  = false;
  /** svg path for the icon */
  export let path:string = null;
  /** label for the icon */
  export let label:string = null;
  /** styles added to the icon */
  export let style:string = null;

</script>

<style type="scss" src="./Icon.scss" global>
</style>

<i 
  {...$$restProps}
  on:click
  aria-hidden="true"
  class="s-icon {klass}"
  class:spin
  aria-label={label}
  class:disabled
  style= "--s-icon-size:{format(size)};--s-icon-rotate:{rotate}deg; {style}"
  aria-disabled={disabled}>{@html path}</i>
