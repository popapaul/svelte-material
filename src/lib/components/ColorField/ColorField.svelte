<script lang="ts">
  interface $$Events {
    focus: CustomEvent;
    blur: CustomEvent;
    change: CustomEvent<{ 
          hex: string,
          rgba: { r:number, g:number, b:number, a:number}
      }>;
  }
  import TextField from "../TextField/TextField.svelte";
  import ColorPicker from "../ColorPicker/ColorPicker.svelte";
	import Menu from "../Menu/Menu.svelte";
  export let value: string = "#FFF";

  export let colors: string[] = [];

  interface $$Props extends Omit<typeof TextField.prototype.$$prop_def,"value"> 
  {
    value?:string,
    colors?: string[]
  }   

  let active = false;

  const open = () => {
    active = true;
  };
  function onkeydown(e) {
    if (e.keyCode === 13 || e.keyCode === 32) {
      e.stopPropagation();
      e.preventDefault();
      open();
    }
  }
</script>

  <Menu closeOnClick={false} bind:active width="auto" placement="bottom-start">
    <TextField
      {value}
      slot="activator"
      {...$$restProps}
      on:keydown={onkeydown}
      readonly
    >
        <slot />
        <slot slot="append" name="append" />
        <slot slot="prepend-outer" name="prepend-outer" >
          <button type="button" on:click={open} class="color-preview" style="background-color:{value};" />
        </slot>
        <slot slot="append-outer" name="append-outer" />
        <slot slot="prepend" name="prepend"/>
    </TextField>
    <ColorPicker bind:value bind:colors on:change />
  </Menu>

<style>
  .color-preview {
    width: 20px;
    height: 20px;
    border-radius: 50px;
    margin-right: 5px;
  }
</style>
