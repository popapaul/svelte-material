<script context="module" lang="ts">
  export const ITEM_GROUP = {};

  export interface ItemGroupContext {
    select: (val: any) => void;
    register: (setValue: (values:any[])=>void) => void;
    index: () => number;
    activeClass: string;
  }
</script>

<script>
  import { setContext, createEventDispatcher, onDestroy } from 'svelte';
  import { writable } from 'svelte/store';

  let klass = '';
  /** classes added to item group */
  export { klass as class };
  /** class to add to item when active */
  export let activeClass = '';
  /** value of the group */
  export let value = [];
  /** allows to select multiple items */
  export let multiple = false;
  /** makes sure atleast one item is selected */
  export let mandatory = false;
  /** max number of selection */
  export let max = Infinity;
  /** roles of item */
  export let role = null;
  /** styles added to item group */
  export let style = null;


  const dispatch = createEventDispatcher();
  const valueStore = writable(value);
  $: valueStore.set(value);

  let startIndex = -1;
  setContext(ITEM_GROUP, {
    select: (val) => {
      if (multiple) {
        if (value?.includes(val)) {
          if (!mandatory || value.length > 1) {
            value.splice(value.indexOf(val), 1);
            value = [...value];
          }
        } else if ((value?.length??0) < max) value = [...value??[], val];
      } else if (value === val) {
        if (!mandatory) value = null;
      } else value = val;
      dispatch('change', value);
    },
    register: (setValue) => {
      const u = valueStore.subscribe((val) => {
        setValue(multiple ? val : [val]);
      });
      onDestroy(u);
    },
    index: () => {
      startIndex += 1;
      return startIndex;
    },
    activeClass,
  });
</script>

<style lang="scss" src="./ItemGroup.scss" global>
</style>

<div class="s-item-group {klass}" {role} {style}>
  <slot />
</div>
