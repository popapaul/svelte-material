<script lang="ts">
  import { createEventDispatcher, type ComponentProps } from "svelte";
  import TextField from "../TextField/TextField.svelte";
	import DatePicker from "../DatePicker/DatePicker.svelte";
	import Menu from "../Menu/Menu.svelte";
  export let value:Date = null;
  export let locale:string = "ro";
  export let readonly = false;

  type $$Props =  ComponentProps<TextField>  & ComponentProps<DatePicker>  & ComponentProps<Menu> & {
    locale?:string,
    readonly?:boolean
  }


  const dispatch = createEventDispatcher();
  let elm;
  let active = false;

  
  function open() {
    active = true;
  }

  function handleChange({detail}:CustomEvent<Date>) {
    value = detail;
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


  function onkeydown(e:KeyboardEvent) {
    if (e.keyCode === 13 ||  e.keyCode === 32) {
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

<Menu closeOnClick={false} {...$$restProps} bind:active width="auto" placement="bottom-start">
  <TextField
    slot="activator"
    value={value instanceof Date && !isNaN(value.getTime()) ? new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", year:"numeric", weekday: "long" }).format(value) : ""}
    {...$$restProps}
    on:keydown={onkeydown}
    on:click={onfocus}
    on:clear={()=>value = null}
    on:blur
    readonly
    bind:inputElement={elm}
    >
    <slot></slot>
    <slot slot="append" name="append"></slot>
    <slot slot="prepend-outer" name="prepend-outer"></slot>
    <slot slot="append-outer" name="append-outer"></slot>
    <slot slot="prepend" name="prepend"></slot>
  </TextField>
  <DatePicker 
    on:change 
    on:change={handleChange} 
    {...$$restProps} 
    bind:value={value} 
  />
</Menu>
