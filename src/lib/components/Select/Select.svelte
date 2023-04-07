<script lang="ts">
  type TValue = $$Generic;
  type T = TValue extends Array<infer U> ? U : TValue;
  type TItem = $$Generic<TItem extends object ? { name:string, value:T } : T>;
  import TextField from "../TextField/TextField.svelte";
  import Menu from "../Menu/Menu.svelte";
  import ListItemGroup from "../List/ListItemGroup.svelte";
  import ListItem from "../List/ListItem.svelte";
  import Chip from "../Chip/Chip.svelte";
  import Checkbox from "../Checkbox/Checkbox.svelte";
  import Icon from "../Icon/Icon.svelte";
  import DOWN_ICON from "../../internal/Icons/down";
  import MAGNIFY_ICON from '../../internal/Icons/magnify';


  interface $$Slots {
      item: { item: TItem };
      "prepend-outer",
      "append-outer",
      items,
      filter,
      default
  }

  interface $$Events{
    change: CustomEvent<TValue>
  }

  export let getValue = (item: TItem):T =>  typeof item === "object" ? (item as any).value : item;

  export let getName = (item: TItem):string =>   (typeof item === "object" ?  'name' in item ? item.name : item : item)?.toString?.();

  let klass:string = "";
  /** Classes to add to select wrapper. */
  export { klass as class };
	/** Styles to add to select wrapper. */
  export let style: string = "";
  /** Whether select is opened. */
	export let active: boolean = false;
	/**
	 * Value of the select.
	 * If multiple is true, this will be an array; otherwise a single value.
	 */
	export let value: TValue = null;
	/** List of items to select from. */
	export let items: TItem[] = [];
	/** Whether select is the `filled` material design variant. */
	export let filled: boolean = false;
	/** Whether select is the `outlined` material design variant. */
	export let outlined: boolean = false;
	/** Whether select is outlined by elevation. */
	export let solo: boolean = false;
	/** Whether select's height is reduced. */
	export let dense: boolean = false;
	/** Placeholder content for select. */
	export let placeholder: string = "";
	/** Hint text. */
	export let hint: string = "";
	/** Whether at least one T must be selected. */
	export let mandatory: boolean = false;;
	/** Whether you can select multiple options. */
	export let multiple: boolean = false;;
	/** Maximum number of selectable options. Defaults to unlimited. */
	export let max: number = Infinity;
	/** Whether selected options appear as chips. */
	export let chips:boolean = false;;
	/** Whether select is disabled. */
	export let disabled: boolean = false;;
	/** Class to add to the select list div. */
	export let itemsPanelClass: string = "";

  export let filterable:boolean = null;
	/**
	 * Whether select closes on selection. Defaults to `true` on single select and `false`
	 * on multiple select or when select is filterable.
	 */
  export let closeOnClick: boolean = !multiple;
	/** Convert the selected value for the underlying text field. */

  export let emptyString = "";
  export let inputElement = null;


  export let filterStyle = "";
  export let filterValue:string = null;
  export let validateOnBlur =false;
  export let checkValue = (val:TValue)=>val;
  export let isActive = (value:TValue,item:TItem)=> value && Array.isArray(value) ? value.includes(getValue(item)) : value?.toString().includes(getValue(item)?.toString())
  let searchInput;
  export let getSelectString = (v:TValue) => {
    // We could also use `return items[0].value ? find.. : v` or provide a `basic` prop
    const item = items.find((i) =>  getValue(i) == checkValue(v) );
   
    return  item && getName(item) || emptyString;
  };
  export let format = (val:TValue) =>{
    if(!val && val!==0) return null;

    if(Array.isArray(val))
    {
      if(!(val?.length > 0)) return null;
      return val.map((v) => getSelectString(v)).filter(Boolean).join(", ");
    }

    return getSelectString(val);
  }
   

  const getFilteredItems = (items:TItem[], search:string) => {
      if(!filterable || !search) return [...items];

      return items.filter((item) =>  (getName(item) || getValue(item).toString()).toLowerCase().includes(search.toLowerCase()));
  };

  $: filteredItems = getFilteredItems(items, filterValue);
  //$: active && filterable && searchInput?.focus?.();

  const removeItem = (item:T)=>{
    if(Array.isArray(value))
      value=value.filter(x=>x!=item) as TValue;
    else 
      value = null;
  }

  const handleChange = ()=>{
    if(multiple) return;
    if(closeOnClick)
      active=false;
  }
</script>

<div class="s-select {klass}" {style} class:disabled class:chips {...$$restProps}>
  <Menu closeOnClick={filterable ? false : closeOnClick} bind:active {disabled} {...$$restProps}>
      <TextField 
        slot="activator"
        class="s-select-input"
        {...$$restProps}
        {filled}
        {outlined}
        {solo}
        {validateOnBlur}
        {dense}
        bind:inputElement
        {disabled}
        value={items ? format(value) : ""}
        {placeholder}
        {hint}
        readonly
      >
        <slot slot="prepend-outer" name="prepend-outer" />
        <slot />
        <div slot="content">
          {#if chips && value}
              {#each Array.isArray(value) ? value : [value] as val}
                <Chip active={true} size="small" close on:close={()=> removeItem(val)}>{getSelectString(val)}</Chip>
              {/each}
          {/if}
        </div>
        <span slot="append">
          <Icon path={DOWN_ICON} rotate={active ? 180 : 0} />
        </span>
        <slot slot="append-outer" name="append-outer" />
      </TextField>
 
    <ListItemGroup bind:value on:change on:change={handleChange} {mandatory} {multiple} {max}>
      {#if filterable}
        <slot name="filter">
          <TextField
            {filled}
            {outlined}
            {solo}
            {dense}
            {disabled}
            style={filterStyle}
            bind:inputElement={searchInput}
            class="s-select__filter"
            bind:value={filterValue}
          >
          Cautare
            <span slot="append">
              <Icon path={MAGNIFY_ICON} />
            </span>
          </TextField>
        </slot>
      {/if}
      <slot name="items">
        <div class={itemsPanelClass}>
          {#each !filterable ? items : filteredItems as item}
            {@const active = isActive(value,item)}
            <slot name="item" {item}>
              <ListItem
                {dense}
                value={getValue(item)}
                {active}
              >
                <span slot="prepend">
                  {#if multiple}
                    <Checkbox checked={active}/>
                  {/if}
                </span>
                {getName(item)}
              </ListItem>
            </slot>
          {/each}
        </div>
      </slot>
    </ListItemGroup>
  </Menu>
</div>

<style lang="scss" src="./Select.scss" global></style>
