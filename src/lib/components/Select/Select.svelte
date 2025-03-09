
<script lang="ts" generics="T, D extends boolean = false">
	import type { ConditionalBoolean } from '../../types';
	import './Select.scss';
	import type {  ComponentProps, Snippet } from 'svelte';
	
	import TextField from '../TextField/TextField.svelte';
	import Menu from '../Menu/Menu.svelte';
	import ListItemGroup from '../List/ListItemGroup.svelte';
	import ListItem from '../List/ListItem.svelte';
	import Chip from '../Chip/Chip.svelte';
	import Checkbox from '../Checkbox/Checkbox.svelte';
	import Icon from '../Icon/Icon.svelte';
	import DOWN_ICON from '../../internal/Icons/down';

	type TItem = { name: string; value: T };

	type Props =  Omit<ComponentProps<TextField<T>>, "value"|"onchange"> & {
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
		value?: ConditionalBoolean<T,D>;
		/** List of items to select from. */
		items?: (TItem|T)[];
		/** Placeholder content for select. */
		placeholder?: string;
		/** Hint text. */
		hint?: string;
		/** Whether at least one T must be selected. */
		mandatory?: boolean;
		/** Whether you can select multiple options. */
		multiple?: D;
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
		filterable?: boolean;

		emptyString?: string;
		inputElement?: any;
		menuClass?: string;
		filterValue?: string;
		onchange?: (value:ConditionalBoolean<T,D>)=>void;
		children?: Snippet;
		options?: Snippet;
		chip?: Snippet<[{ value:T, name:string }]>
		option?: Snippet<[{active:boolean, item: TItem}]>;
	};

	let {
		class: klass = '',
		style = '',
		active = $bindable(),
		value = $bindable(),
		hint = '',
		mandatory = false,
		multiple,
		max = Infinity,
		chips = false,
		disabled = false,
		itemsPanelClass = '',
		acceptValue = false,
		filterable = false,
		fullWidth = true,
		emptyString = '',
		inputElement = $bindable(),
		menuClass = '',
		filterValue = $bindable(),
		validateOnBlur = false,
		items = $bindable([]),
		onchange,
		options,
		option,
		chip,
		...rest
	}: Props = $props();


	let TextFieldInstance: TextField<string>;
	let inputValue = $state("");
	let placeholderValue = $state(null);
	type DiscriminatedProps = { multiple:true, value:T[], onchange?:(value:T[])=>void } | { multiple?:false, value:T, onchange?:(value:T)=>void} ;
	const internal = $derived({
		multiple,
		get value(){ return value },
		set value(val){ value = val},
		items: [...new Map(items.map(y=>[(y as any)?.value ?? y ,y])).values()].map(x=> typeof x === "object" ? x as TItem : { value: x, name: x } as TItem  )
	} as {items:TItem[]} & DiscriminatedProps);	


	export function getSelectString(v: T) {
		const item = internal.items.find((i) => i.value == v);

		return item?.name ?? v as string ?? emptyString;
	}
	export function format(val: T|T[]) {
		if (!val && val !== 0) return null;
	
		if (!Array.isArray(val)) return getSelectString(val);

		return val
			.map((v) => getSelectString(v))
			.filter(Boolean)
			.join(', ');
	}


	let filteredItems = $derived.by(()=>{
		if (!filterValue) return internal.items;
		return internal.items.filter((item) => item.name.toLowerCase().includes(filterValue.toLowerCase()));
	});

	const removeItem = (itemValue: T) => {
		if (Array.isArray(internal.value)) internal.value = internal.value.filter((x) => x != itemValue);
		else value = null;
	};
	
	const appendValue = (newValue:any)=>{
		if(!newValue) return;
		items.push(newValue);
		if(internal.multiple == true)
			internal.value.push(newValue)
		else
			internal.value = newValue;
	}

	const handleKeypress = (event: KeyboardEvent)=>{
		const input = event.currentTarget as HTMLInputElement;
		if (event.key === 'Enter') {
			appendValue(input.value);
			placeholderValue = null;
			input.value = "";
			handleChange();
		}
		else if (event.key === "Backspace" && inputValue.trim() === "" && internal.value?.length) {
			if(internal.multiple === true)
			{
				placeholderValue = internal.value.pop();
			}
			else
			{
				placeholderValue = internal.value;
				internal.value = null;
			}
			inputValue = getSelectString(placeholderValue);
		}
		else if(internal.multiple != true && internal.value)
		{
			placeholderValue = internal.value;
			internal.value = null;
		}
	}
	const handleChange = ()=>{
		onchange?.(value);
		TextFieldInstance?.validate();
		if(!multiple)
			active = false;
	}

	const handleBlur = ()=>{
		//appendValue(inputValue); 
		inputValue = "";
		if(!placeholderValue) return;

		if(internal.multiple == true)
			internal.value.push(placeholderValue);
		else
			internal.value = placeholderValue;
		
	}
</script>

<Menu
	closeOnClick={!multiple && !filterable}
	{disabled}
	bind:active
	class={menuClass}
	{fullWidth}
	onclose={() => (filterValue = '')}
>
	{#snippet activator()}
		<TextField
			bind:this={TextFieldInstance}
			class="s-select  {klass}"
			{style}
			{...rest}
			labelActive={active || !!value}
			value={format(value)}
			onclear={() => (value = null)}
			
			readonly
			{disabled}
			{hint}
		>	
			{#snippet content()}
				{#if internal.value || internal.value === 0 }
					{#each (Array.isArray(internal.value) ? internal.value : [internal.value]) as val}
						{#if chips}
							{#if chip}
								{@render chip({value:val, name: getSelectString(val)})}
							{:else}
								<Chip size="small" close onclose={() => removeItem(val)}>{getSelectString(val)}</Chip>
							{/if}
						{:else}
							<span onclick={()=>inputElement?.focus()} style="margin-right:4px;">{getSelectString(val)}</span>
						{/if}
					{/each}
				{/if}
				{#if acceptValue}
					<input 
						bind:this={inputElement}
						bind:value={inputValue} 
						onkeydown={handleKeypress}
						onblur={handleBlur} 
						/>
				{/if}
			{/snippet}
			{#snippet append()}
				<Icon
					onclick={() => active && setTimeout(() => (active = false), 2)}
					path={DOWN_ICON}
					rotate={active ? 180 : 0}
				/>
			{/snippet}
		</TextField>
	{/snippet}
	{#if filterable}
		<TextField autofocus bind:value={filterValue} class="s-select__filter">Cautare</TextField>
	{/if}
	<ListItemGroup bind:value onchange={handleChange}  {mandatory} {multiple} {max}>
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
					<div class="s-select__filter">Nu au fost gasite optiuni</div>
				{/if}
			</div>
		{/if}
	</ListItemGroup>
</Menu>
