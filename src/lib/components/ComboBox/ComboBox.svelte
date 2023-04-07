<script lang="ts">
  type T = $$Generic;
  type Item = $$Generic<Item extends object ? { name:string, value:T } : T>;

  

  import { createEventDispatcher } from "svelte";
  import TextField from "../TextField/TextField.svelte";
  import Menu from "../Menu/Menu.svelte";
  import ListItemGroup from "../List/ListItemGroup.svelte";
  import ListItem from "../List/ListItem.svelte";
  import Chip from "../Chip/Chip.svelte";
  import Checkbox from "../Checkbox/Checkbox.svelte";
  import Icon from "../Icon/Icon.svelte";
  import DOWN_ICON from "../../internal/Icons/down";

  interface $$Slots {
      item: { item: Item };
      "prepend-outer",
      "append-outer",
      items,
      filter,
      default
  }


  export let getValue = (val: Item):T => (val as any)?.value ?? val;
  export let getName = (val: Item):string =>  (val as any)?.name ?? val?.toString?.();

  let klass:string = "";
  /** Classes to add to select wrapper. */
  export { klass as class };
	/** Styles to add to select wrapper. */
  export let style: string = "";
  /** Whether select is opened. */
	export let active: boolean = false;
  	/** Whether you can select multiple options. */
	export let multiple: boolean = false;
	/**
	 * Value of the select.
	 * If multiple is true, this will be an array; otherwise a single value.
	 */
	export let value: T|T[]= multiple ? [] : null;
	/** List of items to select from. */
	export let items: Item[]=[];
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
	export let mandatory: boolean = false;

	/** Maximum number of selectable options. Defaults to unlimited. */
	export let max: number = Infinity;
	/** Whether selected options appear as chips. */
	export let chips:boolean = false;
	/** Whether select is disabled. */
	export let disabled: boolean = false;
	/** Class to add to the select list div. */
	export let itemsPanelClass: string = "";
	/**
	 * Whether select closes on selection. Defaults to `true` on single select and `false`
	 * on multiple select or when select is filterable.
	 */
  export let closeOnClick: boolean = false;
	/** Convert the selected value for the underlying text field. */

  export let emptyString = "";
  export let inputElement:HTMLInputElement=null;
  export let rules = [];
  export let search:(searchTerm: string) => Promise<Item[]> = async(searchTerm: string) => {
    if (!searchTerm) return items;

    return items.filter((i) =>
        getName(i)
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  };

  export let format = (val: any|any[]) => {
    const form= Array.isArray(val)
      ? val.map((v) => getSelectString(v)).join(", ")
      : getSelectString(val);
      return form;
  };

  const filterItems = async (searchTerm: string) => {
    searchTerm = multiple ? searchTerm :  searchTerm || format(value);
    filteredItems = await search(searchTerm);
  };

  let filterValue: string;
  let filteredItems: Item[] = [];
  let oldValue = value;
  let searchInput;

  const getSelectString = (value: T) => {
    const T = items.find((i) => getValue(i) == value);
    return ((T ? getValue(T) : value)?.toString?.() || emptyString);
  };
  
  let errorMessages = [];

  const dispatch = createEventDispatcher();
  $: handleChange(value);

  const handleChange = (value) => {
    if (oldValue === value) return;
    dispatch("change", value);

    oldValue = value;
    if (multiple) filterValue = "";
  };



  $: filterItems(filterValue);
  $: active && (!value || value) && searchInput?.focus?.();

  const handleInput = (event: KeyboardEvent) => {
    const target = event.target as HTMLInputElement;
    const newValue = target.value.trim();
    if (event.code === "Enter") {
      if (!newValue) return;
      items = [...new Set([...items, newValue as Item])];
      filterValue = "";

      value = multiple ? [...new Set([...(value as T[]), newValue as T])]: newValue as T; 
      return;
    }

    if (event.code === "Backspace" && !filterValue?.length) {
      if (multiple) {
        const lastValue = (value as any[]).pop();
        filterValue = lastValue ?? "";
      }
      return (value = multiple ? value ?? [] : newValue as T);
    }
    if (!multiple) value = newValue as T;
    filterValue = newValue;
  };

  const handleBlur = (event) => {
    const target = event.target;
    if (!multiple) {
      value = target.value.trim();
      filterValue = "";
    }
  };
</script>

<div
  class="s-combo {klass}"
  {style}
  class:disabled
  class:noinput={multiple}
  {...$$restProps}
>
  <Menu
    {closeOnClick}
    bind:active
    {disabled}
    {...$$restProps}
  >
    <span slot="activator">
      <TextField
        {filled}
        {outlined}
        {solo}
        {rules}
        on:blur={handleBlur}
        {dense}
        messages={errorMessages}
        bind:inputElement
        {disabled}
        value={filterValue || (items && format(value))}
        on:input={handleInput}
        {placeholder}
        {hint}
      >
        <slot slot="prepend-outer" name="prepend-outer" />

        <slot />
        <svelte:fragment slot="content">
          {#if multiple}
            <span class="s-combo__multi">
              {#if value}
                {#each Array.isArray(value) ? value.map( (v) => getSelectString(v) ) : [getSelectString(value)] as val}
                  {#if chips}
                    <Chip size="small">{val}</Chip>
                  {:else}
                    <span class="s-combo_value">{val}</span>
                  {/if}
                {/each}
              {/if}
              <input
                bind:this={searchInput}
                on:keyup={handleInput}
                value={filterValue}
                on:blur={handleBlur}
              />
            </span>
          {/if}
        </svelte:fragment>
        <span slot="append">
          <Icon path={DOWN_ICON} rotate={active ? 180 : 0} />
        </span>
        <slot slot="append-outer" name="append-outer" />
      </TextField>
    </span>

    <ListItemGroup bind:value {mandatory} {multiple} {max}>
      <slot name="items">
        <div class={itemsPanelClass}>
          {#if !filteredItems.length}
            <ListItem {dense} selectable={false} disabled>No result</ListItem>
          {:else}
         
          {#each filteredItems as item}
            {@const val = getValue(item)}
            {@const active = Array.isArray(value) ? value.some((i) => i == val) : value == val}
            <slot name="item" {item}>
              <ListItem {dense} value={val} {active}>
                <span slot="prepend">
                  {#if multiple}
                    <Checkbox checked={active} />
                  {/if}
                </span>
                {getName(item)}
              </ListItem>
            </slot>
          {/each}
          {/if}
        </div>
      </slot>
    </ListItemGroup>
  </Menu>
</div>

<style lang="scss" src="./ComboBox.scss" global>
</style>
