<script lang="ts">
  import { clickOutside } from '../../actions/ClickOutside';
  import { createPopperActions, type NanoPopPosition } from '../../actions/Popper';
  import { setContext, createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  let klass:string = '';
  /** Classes to add to menu. */
  export { klass as class };
  /** Classes to add to menu wrapper. */
  export let classWrapper:string='';
  /** The menu's active state. */
  export let active = false;
  /** The transition function for the menu. */
  export let transition = fade;
  /** Options for the transition when menu opens. */
  export let inOpts = { duration: 250 };
  /** Options for the transition when menu closes. */
  export let outOpts = { duration: 250 };
  /** Designates whether menu should open on activator click. */
  export let openOnClick = true;
  /** Designates whether menu should open and close on activator hover. */
  export let hover = false;
	/** Designates if menu should close on outside-activator click. */
  export let closeOnClickOutside = true;
  /** Designates if menu should close when its content is clicked. */
  export let closeOnClick = true;
  /** Aligns the component with respect to its bottom. */
  /** Removes the border radius. */
  export let tile = false;
  /** Disables the menu. */
  export let disabled = false;
  /** The z-index of the menu */
  export let index = 1000;
  /** The desired position of the menu */
  export let placement:NanoPopPosition = 'bottom';
  /** Styles for the menu. */
  export let style = '';
  
  export let rightClick = false;
  export let width:string = null;

  export let nudgeX:number = 0;
  export let nudgeY:number = 0;

  let activatorWidth:number;
  let menu:HTMLElement;
  let clicked=false;
  const dispatch = createEventDispatcher();

  setContext('S_ListItemRole', 'menuitem');
  setContext('S_ListItemRipple', true);

  const [popperRef, popperContent] = createPopperActions();

  const close = ()=>{
    if(!active) return;
    clicked=false;
    active=false;
    dispatch("close");
  }

  const open = ()=>{
    if(disabled) return;
    active=true;
    dispatch("open");
  }

  const activatorClick = ()=>{
    clicked = true;
    openOnClick && open();
  }

  const menuClick = ()=>{
    closeOnClick && close();
  }
</script>

<style lang="scss" src="./Menu.scss" global>
</style>

<div class="s-menu__wrapper {classWrapper}"  {style}
    use:clickOutside={{include:[menu]}}
    on:clickOutside={()=>closeOnClickOutside && close()}
    on:mouseenter={()=>!active && hover && open()}
    on:mouseleave={()=>!clicked && hover && close()}
>
  <div 
    use:popperRef
    on:click={activatorClick}  
    on:keydown={activatorClick}  
    on:contextmenu|preventDefault={()=>rightClick && open()}
    bind:clientWidth={activatorWidth}
    >
    <slot name="activator" />
  </div>

  {#if active}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div bind:this={menu} 
      class="s-menu {klass}"  
      style="z-index:{index};"
      style:margin-right="{nudgeX}px"
      style:margin-top="{nudgeY}px"
      style:min-width={width ? width : activatorWidth+"px"}
      role="menu"
      tabindex="0"
      class:tile
      on:click={menuClick}
      in:transition={inOpts}
      out:transition={outOpts}
      use:popperContent={{
        position: placement
      }}
      >
      <slot />
    </div>
  {/if}
</div>