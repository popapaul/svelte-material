<script lang="ts">
	import './Select.scss';
	import { createEventDispatcher } from 'svelte';
	type TValue = $$Generic;
	type T = TValue extends Array<infer U> ? U : TValue;
	type TItem = string | { name: string; value: any };

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

	export let getValue = (item: TItem): T => (item as any)?.value ?? item;

	export let getName = (item: TItem): string => (item as any)?.name ?? item;

	let klass: string = '';
	/** Classes to add to select wrapper. */
	export { klass as class };
	/** Styles to add to select wrapper. */
	export let style: string = '';
	/** Whether select is opened. */
	export let active: boolean = false;
	/**
	 * Value of the select.
	 * If multiple is true, this will be an array; otherwise a single value.
	 */
	export let value: T | T[] = null;
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
	export let placeholder: string = '';
	/** Hint text. */
	export let hint: string = '';
	/** Whether at least one T must be selected. */
	export let mandatory: boolean = false;
	/** Whether you can select multiple options. */
	export let multiple: boolean = false;
	/** Maximum number of selectable options. Defaults to unlimited. */
	export let max: number = Infinity;
	/** Whether selected options appear as chips. */
	export let chips: boolean = false;
	/** Whether select is disabled. */
	export let disabled: boolean = false;
	/**
	 * Whether select closes on selection. Defaults to `true` on single select and `false`
	 * on multiple select or when select is filterable.
	 */
	export let closeOnClick: boolean = !multiple;
	/** Select values not in the list. */
	export let acceptValue = false;
	/** Convert the selected value for the underlying text field. */
	export let emptyString = '';
	export let inputElement = null;
	export let menuClass = '';

	export let filterValue: string = '';
	export let validateOnBlur = false;

	export let isActive = (value: T | T[], item: TItem) =>
		value && Array.isArray(value)
			? value.includes(getValue(item))
			: typeof value === 'string'
			? value?.toString().includes(getValue(item)?.toString())
			: value == getValue(item);

	export function getSelectString(v: T) {
		// We could also use `return items[0].value ? find.. : v` or provide a `basic` prop
		const item = items.find((i) => getValue(i) == v);

		return (item && getName(item)) || emptyString;
	}
	export function format(val: T | T[]) {
		if (!val && val !== 0) return null;

		if (Array.isArray(val))
			return val
				.map((v) => getSelectString(v))
				.filter(Boolean)
				.join(', ');

		return getSelectString(val);
	}

	const getFilteredItems = (items: TItem[], search: string) => {
		if (!search) return items;

		return items.filter((item) =>
			(getName(item) || getValue(item).toString())?.toLowerCase?.()?.includes(search.toLowerCase())
		);
	};

	const removeItem = (itemValue: T) => {
		if (Array.isArray(value)) value = value.filter((x) => x != itemValue) as TValue;
		else value = null;
	};

	const handleChange = () => {
		if (multiple) return;
		if (closeOnClick) active = false;
	};
	const handleKey = (event: KeyboardEvent & { target: EventTarget & HTMLInputElement }) => {
		if (event.key === 'Enter') {
			const val = event.target.value;
			multiple
				? (value = Array.from(new Set([...(value ?? ([] as any)), val])))
				: event.target.value;
			items = Array.from(new Set([...items, val]));
			filterValue = '';
		}
		if (event.key === 'Backspace' && !filterValue) {
			if (multiple) {
				filterValue = getSelectString((value as any)?.pop?.() ?? '');
				value = value;
			} else {
				filterValue = getSelectString(value as T);
				value = null;
			}
		}
	};
</script>

<div class="s-select {klass}" {style} class:disabled class:chips>
	<Menu
		closeOnClick={false}
		{disabled}
		bind:active
		class={menuClass}
		fullWidth
		on:close={() => (filterValue = '')}
		on:open={() => setTimeout(() => inputElement.focus(), 1)}
	>
		<TextField
			slot="activator"
			class="s-select-input"
			{...$$restProps}
			{filled}
			labelActive={active || !!value}
			{outlined}
			{solo}
			{validateOnBlur}
			on:keydown={handleKey}
			on:input={(event) => (filterValue = event.target.value)}
			on:clear={() => (value = null)}
			on:clear
			{dense}
			bind:inputElement
			{disabled}
			value={filterValue ? filterValue : chips || multiple ? '' : format(value)}
			{placeholder}
			{hint}
		>
			<slot slot="prepend-outer" name="prepend-outer" />
			<slot />
			<svelte:fragment slot="content">
				{#if (chips || multiple) && !!value}
					{#each (Array.isArray(value) ? value : [value]).filter(Boolean) as val}
						{#if chips}
							<Chip size="small" close on:close={() => removeItem(val)}>
								<span style="flex-basis: 0; flex-grow: 1;">
									{getSelectString(val)}
								</span>
							</Chip>
						{:else}
							<span style="">
								{getSelectString(val)}
							</span>
						{/if}
					{/each}
				{/if}
			</svelte:fragment>
			<Icon
				slot="append"
				on:click={() => active && setTimeout(() => (active = false), 2)}
				path={DOWN_ICON}
				rotate={active ? 180 : 0}
			/>
			<slot slot="append-outer" name="append-outer" />
		</TextField>

		<ListItemGroup bind:value on:change on:change={handleChange} {mandatory} {multiple} {max}>
			{@const filteredItems = getFilteredItems(items, filterValue)}
			<slot name="items">
				{#if filteredItems.length}
					{#each filteredItems as item}
						{@const active = isActive(value, item)}
						<slot name="item" {item} {active}>
							<ListItem {dense} value={getValue(item)} {active}>
								<span slot="prepend">
									{#if multiple}
										<Checkbox checked={active} />
									{/if}
								</span>
								{getName(item)}
							</ListItem>
						</slot>
					{/each}
				{:else}
					Nu au fost gasite optiuni
				{/if}
			</slot>
		</ListItemGroup>
	</Menu>
</div>
