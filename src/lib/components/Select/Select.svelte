
<script lang="ts">
	import './Select.scss';
	import { type Snippet, createEventDispatcher } from 'svelte';
	type TValue = $$Generic;
	type T = TValue extends Array<infer U> ? U : TValue;
	type TItem = $$Generic<TItem extends object ? { name: string; value: T } : T>;
	import TextField from '../TextField/TextField.svelte';
	import Menu from '../Menu/Menu.svelte';
	import ListItemGroup from '../List/ListItemGroup.svelte';
	import ListItem from '../List/ListItem.svelte';
	import Chip from '../Chip/Chip.svelte';
	import Checkbox from '../Checkbox/Checkbox.svelte';
	import Icon from '../Icon/Icon.svelte';
	import DOWN_ICON from '../../internal/Icons/down';


	interface $$Events {
		clear: CustomEvent;
		change: CustomEvent<TValue>;
		keydown: KeyboardEvent;
		search: CustomEvent<string>;
	}
	const dispatch = createEventDispatcher();

	/** Classes to add to select wrapper. */

	interface Props {
		getValue?: any;
		getName?: any;
		class?: string;
		/** Styles to add to select wrapper. */
		style?: string;
		/** Whether select is opened. */
		active?: boolean;
		/**
	 * Value of the select.
	 * If multiple is true, this will be an array; otherwise a single value.
	 */
		value?: TValue;
		/** List of items to select from. */
		items?: TItem[];
		/** Whether select is the `filled` material design variant. */
		filled?: boolean;
		/** Whether select is the `outlined` material design variant. */
		outlined?: boolean;
		/** Whether select is outlined by elevation. */
		solo?: boolean;
		/** Whether select's height is reduced. */
		dense?: boolean;
		/** Placeholder content for select. */
		placeholder?: string;
		/** Hint text. */
		hint?: string;
		/** Whether at least one T must be selected. */
		mandatory?: boolean;
		/** Whether you can select multiple options. */
		multiple?: boolean;
		/** Maximum number of selectable options. Defaults to unlimited. */
		max?: number;
		/** Whether selected options appear as chips. */
		chips?: boolean;
		/** Whether select is disabled. */
		disabled?: boolean;
		/** Class to add to the select list div. */
		itemsPanelClass?: string;
		fullWidth?: boolean;
		/**
	 * Whether select closes on selection. Defaults to `true` on single select and `false`
	 * on multiple select or when select is filterable.
	 */
		closeOnClick?: boolean;
		/** Select values not in the list. */
		acceptValue?: boolean;
		/** Convert the selected value for the underlying text field. */
		filter?: boolean;
		emptyString?: string;
		inputElement?: any;
		menuClass?: string;
		filterValue?: string;
		validateOnBlur?: boolean;
		isActive?: any;
		children?: Snippet;
		options?: Snippet
		option?: Snippet;
	}

	let {
		getValue = (item: TItem): T => (item as any)?.value ?? item,
		getName = (item: TItem): string => (item as any)?.name ?? item,
		class: klass = '',
		style = '',
		active = $bindable(),
		value = $bindable(),
		items = [],
		filled = false,
		outlined = false,
		solo = false,
		dense = false,
		placeholder = '',
		hint = '',
		mandatory = false,
		multiple = false,
		max = Infinity,
		chips = false,
		disabled = false,
		itemsPanelClass = '',
		fullWidth = true,
		closeOnClick = !multiple,
		acceptValue = false,
		filter = !acceptValue,
		emptyString = '',
		inputElement = $bindable(),
		menuClass = '',
		filterValue = $bindable(),
		validateOnBlur = false,
		isActive = (value: TValue, item: TItem) =>
		value && Array.isArray(value)
			? value.includes(getValue(item))
			: typeof value === 'string'
			? value?.toString().includes(getValue(item)?.toString())
			: value == getValue(item),
		children,
		options,
		option,
		...rest
	}: Props = $props();

	export function getSelectString(v: TValue) {
		// We could also use `return items[0].value ? find.. : v` or provide a `basic` prop
		const item = items.find((i) => getValue(i) ==  $state.snapshot(v));
		return (item && getName(item)) || emptyString;
	}
	export function format(val: TValue) {
		if (!val && val !== 0) return null;

		if (Array.isArray(val))
			return val
				.map((v) => getSelectString(v))
				.filter(Boolean)
				.join(', ');

		return getSelectString(val);
	}

	const getFilteredItems = (items: TItem[], search: string) => {
		if (!search) return [...items];

		return items.filter((item) =>
			(getName(item) || getValue(item).toString()).toLowerCase().includes(search.toLowerCase())
		);
	};

	let filteredItems = $derived(getFilteredItems(items, filterValue));

	const removeItem = (itemValue: T) => {
		if (Array.isArray(value)) value = value.filter((x) => x != itemValue) as TValue;
		else value = null;
	};

	const handleChange = () => {
		if (multiple) return;
		if (closeOnClick) active = false;
	};
</script>

<Menu
	{closeOnClick}
	{disabled}
	bind:active
	on:open={() => inputElement?.focus()}
	class={menuClass}
	{fullWidth}
	on:close={() => (filterValue = '')}
	on:open={() => setTimeout(() => inputElement.focus(), 1)}
>
	{#snippet activator()}
		<TextField
			class="s-select-input {klass}"
			{style}
			{...rest}
			{filled}
			labelActive={active || !!value}
			{outlined}
			{solo}
			{validateOnBlur}
			readonly={!filter && !acceptValue}
			on:keydown
			on:clear={() => (value = null)}
			on:clear
			{dense}
			bind:inputElement
			{disabled}
			on:input={(event) => {
				if (acceptValue) {
					value = event.target.value;
					return;
				}
				filterValue = event.target.value;
				dispatch('search', filterValue);
			}}
			value={(active || chips) && filter ? filterValue : acceptValue ? value : format(value)}
			{placeholder}
			{hint}
		>
			{@render children?.()}
			{#if chips && !!value}
				{#each (Array.isArray(value) ? value : [value]).filter(Boolean) as val}
					<Chip size="small" close on:close={() => removeItem(val)}>
						<span style="flex-basis: 0; flex-grow: 1;">
							{getSelectString(val)}
						</span>
					</Chip>
				{/each}
			{/if}
			 {#snippet append()}
				<Icon
					on:click={() => active && setTimeout(() => (active = false), 2)}
					path={DOWN_ICON}
					rotate={active ? 180 : 0}
				/>
			 {/snippet}
		</TextField>
	{/snippet}

	<ListItemGroup bind:value on:change on:change={handleChange} {mandatory} {multiple} {max}>
		 {#if options}
		 	{@render options()}
		 {:else}
		<div class={itemsPanelClass}>
			{#if filteredItems.length}
				{#each filteredItems as item}
					{@const active = isActive(value, item)}
					{#if option}
						{@render option({item, active})}
					{:else}
						<ListItem {dense} value={getValue(item)} {active}>
							{#snippet prepend()}
								{#if multiple}
									<Checkbox checked={active} />
								{/if}
							{/snippet}
							{getName(item)}
						</ListItem>
					{/if}
				{/each}
			{:else}
				Nu au fost gasite optiuni
			{/if}
		</div>
		{/if}
	</ListItemGroup>
</Menu>
