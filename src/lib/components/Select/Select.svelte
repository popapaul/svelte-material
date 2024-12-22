
<script lang="ts" generics="T extends any">
	import './Select.scss';
	import { type Snippet, createEventDispatcher, untrack } from 'svelte';
	
	import { default as TextField,  type Props as TextFieldProps } from '../TextField/TextField.svelte';
	import Menu from '../Menu/Menu.svelte';
	import ListItemGroup from '../List/ListItemGroup.svelte';
	import ListItem from '../List/ListItem.svelte';
	import Chip from '../Chip/Chip.svelte';
	import Checkbox from '../Checkbox/Checkbox.svelte';
	import Icon from '../Icon/Icon.svelte';
	import DOWN_ICON from '../../internal/Icons/down';

	type TItem = { name: string; value: T };
	interface $$Events {
		clear: CustomEvent;
		change: CustomEvent<T>;
		keydown: KeyboardEvent;
		search: CustomEvent<string>;
	}

	const dispatch = createEventDispatcher();

	type Props =  Omit<TextFieldProps, "value"> & {
		/** Classes to add to select wrapper. */
		class?: string;
		/** Styles to add to select wrapper. */
		style?: string;
		/** Whether select is opened. */
		active?: boolean;
		/**
		 * Value of the select.
		 * If multiple is true, this will be an array; otherwise a single value.
		 */
		value?: T|T[];
		/** List of items to select from. */
		items?: (TItem|T)[];
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
		children?: Snippet;
		options?: Snippet;
		option?: Snippet;
	}

	

	let {
		class: klass = '',
		style = '',
		active = $bindable(),
		value = $bindable(),
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
		items:initialItems = $bindable([]),
		options,
		option,
		...rest
	}: Props = $props();
	const asArray = (val:T|T[])=>{
		if(!val) return [];
		return Array.isArray(val) ? [...val] : [val];
	}
	if(!initialItems?.length)
		initialItems = asArray(value);

	const items = $derived([...new Map(initialItems.map(y=>[(y as any)?.value ?? y ,y])).values()].filter(Boolean).map(x=> typeof x === "object" ? x as TItem : { value: x, name: x } as TItem  ));
	
	

	export function getSelectString(v: T) {
		const item = items.find((i) => i.value == v);
		return item?.name || v as string || emptyString;
	}
	export function format(val: T|T[]) {
		if (!val && val !== 0) return null;

		if (!Array.isArray(val)) return getSelectString(val);

		return val
			.map((v) => getSelectString(v))
			.filter(Boolean)
			.join(', ');
	}

	const getFilteredItems = (items: TItem[], search: string) => {
		if (!search) return [...items];

		return items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
	};

	let filteredItems = $derived(getFilteredItems(items, filterValue));

	const removeItem = (itemValue: T) => {
		if (Array.isArray(value)) value = value.filter((x) => x != itemValue);
		else value = null;
	};
	
	const appendValue = (newValue:any)=>{
		
			initialItems.push(newValue);
			if(multiple)
			{
				value??=[];
				value.push(newValue)
			}
				
			else
				value = newValue;
	}

	const handleKeypress = (event: KeyboardEvent)=>{
		const input = event.currentTarget as HTMLInputElement;
		if (event.key === 'Enter') {
			appendValue(input.value);
			input.value = "";
		}

		if(event.key === "Backspace")
		{
			if(input.value?.length) return
			if(multiple)
				value?.pop?.()
		}
	}
</script>

<Menu
	{closeOnClick}
	
	{disabled}
	bind:active
	class={menuClass}
	{fullWidth}
	on:close={() => (filterValue = '')}

>
	{#snippet activator()}
		<TextField
			class={klass}
			{style}
			{...rest}
			labelActive={active || !!value}
			value={format(value)}
			on:clear={() => (value = null)}
			bind:inputElement
			readonly
			{disabled}
			{hint}
		>	
			
			{#snippet content()}
				{#if  value}
					{#each (Array.isArray(value) ? value : [value]).filter(Boolean) as val}
						{#if chips}
							<Chip size="small" close on:close={() => removeItem(val)}>{getSelectString(val)}</Chip>
						{:else}
							<span style="margin-right:4px;">{getSelectString(val)}</span>
						{/if}
					{/each}
				{/if}

				

				{#if acceptValue}
					<input onkeydown={handleKeypress} onblur={(event)=>{appendValue(event.currentTarget.value); event.currentTarget.value = ""}} />
				{/if}
			{/snippet}
			
			
			 {#snippet append()}
				<Icon
					on:click={() => active && setTimeout(() => (active = false), 2)}
					path={DOWN_ICON}
					rotate={active ? 180 : 0}
				/>
			 {/snippet}
		</TextField>
	{/snippet}

	<ListItemGroup bind:value on:change  {mandatory} {multiple} {max}>
		 {#if options}
		 	{@render options()}
		 {:else}
			<div class={itemsPanelClass}>
				{#if filteredItems.length}
					{#each filteredItems as item}
						{@const active = value && Array.isArray(value) ? value.includes(item.value) : value == item.value}
						{#if option}
							{@render option({item, active})}
						{:else}
							<ListItem dense={rest.dense} value={item.value} {active}>
								{#snippet prepend()}
									{#if multiple}
										<Checkbox checked={active} />
									{/if}
								{/snippet}
								{item.name}
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
