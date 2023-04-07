<script lang="ts">
  import { getContext } from 'svelte';
  import { ripple as Ripple, type RippleOptions } from '../../actions/Ripple';
  import type { ItemGroupContext } from '../ItemGroup/ItemGroup.svelte';

  const role = getContext<string>('S_ListItemRole');
  const ITEM_GROUP = getContext('S_ListItemGroup');
  const DEFAULTS = {
    select: () => null,
    register: () => null,
    index: () => null,
    activeClass: 'active',
  };
  const ITEM = ITEM_GROUP ? getContext<ItemGroupContext>(ITEM_GROUP) : DEFAULTS;
  
  let klass:string = '';
  	/** classes added to the listitem */
  export { klass as class };
  /** classes added when active */
  export let activeClass:string = ITEM.activeClass;
  /** value to use in ListItemGroup */
  export let value:any = ITEM.index();
  /** specify active state */
  export let active = false;
  /** makes the listitem dense */
  export let dense = false;
  /** disables the listitem */
  export let disabled:boolean=false;
  /** there is no word wrap */
  export let multiline = false;
  /** transforms listitem into anchor */
  export let href:string="";
  
  export let link = role;
  /** makes text selectable if true */
  export let selectable = !link;
  /** options for the ripple action */
  export let ripple: RippleOptions|boolean = getContext<RippleOptions>('S_ListItemRipple') || false;
  /** styles added to listitem */
  export let style:string="";

  ITEM.register((values) => {
    active = values?.includes(value);
  });

  function click() {
    if (!disabled) ITEM.select(value);
  }

</script>


<style lang="scss" src="./ListItem.scss" global>
</style>


<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<svelte:element this={href ? "a" : "span"} href={href}
  class="s-list-item {active ? activeClass : ""} {klass}"
  {role}
  tabindex={link ? 0 : -1}
  aria-selected={role === 'option' ? active : null}
  class:dense
  class:multiline
  class:link
  class:selectable
  use:Ripple={ripple}
  on:click={click}
  {...$$restProps}
  {style}>
  <slot name="prepend" />
  <div class="s-list-item__content"   
    on:click
    on:keydown
    on:dblclick>
    <div class="s-list-item__title">
      <slot />
    </div>
    <div class="s-list-item__subtitle">
      <slot name="subtitle" />
    </div>
  </div>
  <slot name="append" />
</svelte:element>
