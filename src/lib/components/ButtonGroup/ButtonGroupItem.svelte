<script lang="ts">
   import "./ButtonGroupItem.scss";
  import { getContext } from 'svelte';
  import Button from '../Button/Button.svelte';
  import { ITEM_GROUP } from '../ItemGroup/ItemGroup.svelte';
  import type {  ItemGroupContext } from '../ItemGroup/ItemGroup.svelte';
 

  const ITEM = getContext<ItemGroupContext>(ITEM_GROUP);

  let active:boolean = false;

  let klass:string = '';
  // Classes to add to button.
  export { klass as class };
  // Styles to add to button.
  export let style: string = "";
  // Value of button.
  export let value:any = ITEM.index();
  // Identifies button as active with this class.
  export let activeClass:string = ITEM.activeClass;
   // Disable button.
  export let disabled:boolean = null;

  ITEM.register((values) => {
    active = values.includes(value);
  });

  function click() {
    if (!disabled) ITEM.select(value);
  }
</script>

<Button
  class="s-btn-group-item {klass}"
  {activeClass}
  {style}
  {active}
  {disabled}
  {...$$restProps}
  on:click={click}
  on:click>
  <slot />
</Button>
