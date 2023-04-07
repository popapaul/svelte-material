<script lang="ts">
  import { setContext, getContext } from 'svelte';

  let klass = '';
  /** classes added to the list */
  export { klass as class };
  /** reduces padding of list items */
  export let dense:boolean = false;
  /** disables the list */
  export let disabled:boolean = null;
  /** removes box shadow from the list */
  export let flat:boolean = false;
  /** adds border radius to the list */
  export let rounded:boolean = false;
  /** makes the list items navigation style */
  export let nav:boolean = false;
  /** adds a thin outline to the list */
  export let outlined:boolean = false;
  /** styles to add to the list */
  export let style:string = null;

  let role = null;
  if (!getContext('S_ListItemRole')) {
    setContext('S_ListItemRole', 'listitem');
    role = 'list';
  }
</script>

<style lang="scss" src="./List.scss" global>
</style>

<div
  {role}
  class="s-list {klass}"
  aria-disabled={disabled}
  class:dense
  class:disabled
  class:flat
  class:nav
  class:outlined
  class:rounded
  {style}>
  <slot />
</div>
