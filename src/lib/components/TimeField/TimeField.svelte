<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import TextField from "../TextField/TextField.svelte";
    import { isDate } from "../../internal/Date/date";
    import TimePicker from "../TimePicker/TimePicker.svelte";
    import Menu from "../Menu/Menu.svelte";



    let klass:string = '';
    export { klass as class };
    export let hourOnly:boolean=false;
    export let value:Date;
    export let locale:string = "ro";
    export let readonly:boolean = false;

    if(!isDate(value)) value = new Date();

    const dispatch = createEventDispatcher();
    let elm;
    let active = false;
  
    
    function open() {
      active = true;
    }

    function handleHour({ detail }:CustomEvent<Date>) {
      value = detail;
      dispatch("change", value);
      if(hourOnly)
        close();
    }

    const close = ()=>{
      focusInputElm();
      active = false;
    }

    function onfocus(e) {
      open();
      dispatch("focus", e);
    }


    function onkeydown(e) {
      if (/*e.keyCode === 13 || */ e.keyCode === 32) {
        e.stopPropagation();
        e.preventDefault();
        open();
      }
    }
    function focusInputElm() {
      if (readonly) return;
      let inputs = elm.querySelectorAll("input");
      inputs[0] && inputs[0].focus();
    }

  </script>
  
  <Menu closeOnClick={false} {...$$restProps} bind:active placement="bottom-start">
    <TextField
      slot="activator"
      value={value && new Intl.DateTimeFormat(locale, { hour:"2-digit", minute:"2-digit" }).format(value)}
      {...$$restProps}
      class={klass}
      on:keydown={onkeydown}
      on:click={onfocus}
      on:change
      on:clear={()=>value = null}
      on:blur
      bind:inputElement={elm}
      readonly
      >
      <slot></slot>
      <slot slot="append" name="append"></slot>
      <slot slot="prepend-outer" name="prepend-outer"></slot>
      <slot slot="append-outer" name="append-outer"></slot>
      <slot slot="prepend" name="prepend"></slot>
    </TextField>
    <TimePicker {hourOnly} on:hour={handleHour} {...$$restProps} bind:value />
</Menu>


  