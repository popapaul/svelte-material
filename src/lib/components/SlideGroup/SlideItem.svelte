<script lang="ts">
  import { getContext } from 'svelte';
  import { SLIDE_GROUP } from './SlideGroup.svelte';
  import { type ItemGroupContext, ITEM_GROUP } from '../ItemGroup/ItemGroup.svelte';

  const moveGroup = getContext<(item: any) => void>(SLIDE_GROUP);
  const ITEM = getContext<ItemGroupContext>(ITEM_GROUP);

  let active=false;
  let itemElement:HTMLElement;

  let klass = '';
  export { klass as class };
  export let activeClass = ITEM.activeClass;
  export let value = ITEM.index();
  export let disabled = null;

  ITEM.register((values) => {
    active = values.includes(value);
  });

  function selectItem() {
    if (!disabled) {
      moveGroup(itemElement);
      ITEM.select(value);
    }
  }
</script>

<style >
  .s-slide-item {
    display: inline-flex;
    flex: 0 1 auto;
  }
</style>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  bind:this={itemElement}
  class="s-slide-item {active ? activeClass : ""} {klass}"
  on:click={selectItem}>
  <slot {active} />
</div>
