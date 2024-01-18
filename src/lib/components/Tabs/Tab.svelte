<script lang="ts">
  import "./Tab.scss";
  import { getContext, onMount } from 'svelte';
  import { SLIDE_GROUP, type SlideGroupContext } from '../SlideGroup/SlideGroup.svelte';
  import { ITEM_GROUP, type ItemGroupContext } from '../ItemGroup/ItemGroup.svelte';
  import { TABS, type TabsContext } from './Tabs.svelte';
  import { ripple as Ripple } from '../../actions/Ripple';

  let tab:HTMLElement;
  const click = getContext<SlideGroupContext>(SLIDE_GROUP);
  const ITEM = getContext<ItemGroupContext>(ITEM_GROUP);
  const { ripple, registerTab } = getContext<TabsContext>(TABS);

  let klass = '';
  export { klass as class };
  export let value:any = ITEM.index();
  export let activeClass = ITEM.activeClass;
  export let disabled = false;

  let active;
  ITEM.register((values) => {
    active = values.includes(value);
  });

  function selectTab({ target }) {
    if (!disabled) {
      click(target);
      ITEM.select(value);
    }
  }

  onMount(() => {
    registerTab({element:tab, value});
  });
</script>

<button
  bind:this={tab}
  class="s-tab s-slide-item {active ? activeClass : ""} {klass}"
  role="tab"
  aria-selected={active}
  tabindex={disabled ? -1 : 0}
  class:disabled
  class:active
  on:click={selectTab}
  on:click
  use:Ripple={ripple}>
  <slot />
</button>
