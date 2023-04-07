<script lang="ts">
  import { ripple as Ripple } from '../../actions/Ripple';
  import Icon from '../Icon/Icon.svelte';
  import closeIcon from '../../internal/Icons/close';
  import { createEventDispatcher } from 'svelte';

  interface $$Events {
    close: CustomEvent;
  }

  let klass:string = '';
  /** Classes to add to chip. */
  export { klass as class };
  /** Styles to add to chip. */
  export let style:string ="";
  /** Determines whether the chip is visible or not. */
  export let active:boolean = true;
  /** Determines whether the chip is selected or not. */
  export let selected:boolean = false;
  /** Specifies the size of chip. */
  export let size:'x-small' | 'small' | 'default' | 'large' | 'x-large' = 'default';
  /** specifies if the chip is outlined */
  export let outlined:boolean = false;
  /** specifies if the avatar will fill the chip in height */
  export let pill:boolean = false;
  /** makes chip an anchor */
  export let href:string=null;
  /** determines if the chip is a link, making it clickable */
  export let link:boolean = !!href;
  /** specifies if the chip is a label, making it less rounded */
  export let label:boolean = false;
  /** determines if a close button will appear */
  export let close:boolean = false;

  const dispatch = createEventDispatcher();

  function onClose() {
    dispatch('close');
  }
</script>

<style lang="scss" src="./Chip.scss" global>
</style>

{#if active}
  <span
    class="s-chip {klass} size-{size}"
    {style}
    use:Ripple={link}
    class:outlined
    class:pill
    class:link
    class:label
    class:selected
    on:keydown
    on:click>
    <slot />
    {#if close}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div class="s-chip__close" on:click|stopPropagation={onClose}>
        <slot name="close-icon">
          <Icon path={closeIcon} />
        </slot>
      </div>
    {/if}
  </span>
{/if}
