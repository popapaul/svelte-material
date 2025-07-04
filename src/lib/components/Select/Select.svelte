<script lang="ts" generics="T, D extends boolean = false">
    import './Select.scss';
    import type { ComponentProps, Snippet } from 'svelte';
    
    import TextField from '../TextField/TextField.svelte';
    import Menu from '../Menu/Menu.svelte';
    import ListItemGroup from '../List/ListItemGroup.svelte';
    import ListItem from '../List/ListItem.svelte';
    import Chip from '../Chip/Chip.svelte';
    import Checkbox from '../Checkbox/Checkbox.svelte';
    import Icon from '../Icon/Icon.svelte';
    
    import DOWN_ICON from '../../internal/Icons/down';
	import ADD_ICON from '../../internal/Icons/add';
   
    type TItem = { value: T, name: string } & Record<string, unknown>;
    type SelectValue<Multiple extends boolean> = Multiple extends true ? T[] : T | null;

    type Props = Omit<ComponentProps<TextField<T>>, "value"|"onchange"> & {
        class?: string;
        style?: string;
        active?: boolean;
        value?: SelectValue<D>;
        items?: (TItem | T)[];
        placeholder?: string;
        hint?: string;
        mandatory?: boolean;
        multiple?: D;
        max?: number;
        chips?: boolean;
        disabled?: boolean;
        itemsPanelClass?: string;
        fullWidth?: boolean;
        closeOnClick?: boolean;
        filterable?: boolean;
        emptyString?: string;
        menuClass?: string;
        filterValue?: string;
        acceptValue?: boolean;
        onchange?: (value: SelectValue<D>) => void;
        loadItems?: (filterValue?: string) => Promise<(TItem|T)[]>;
        children?: Snippet;
        options?: Snippet;
        chip?: Snippet<[{ value:T, name:string }]>;
        option?: Snippet<[{ active:boolean, item: TItem }]>;
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
        filterable = false,
        fullWidth = true,
        emptyString = '',
        menuClass = '',
      
        items = $bindable([]),
        acceptValue = false,
        loadItems,
        onchange,
        options,
        option,
        chip,
        ...rest
    }: Props = $props();
	let filterValue = $state("");
    let loading = $state(false);
    let TextFieldInstance: TextField<string>;
  
    const normalizedItems = $derived(items.map(x => typeof x === "object" ? x as TItem : { ...x, value: x, name: x } as TItem));

    const filteredItems = $derived.by(() => {
        if (!filterValue) return normalizedItems;
        return normalizedItems.filter((item) => 
            item.name.toLowerCase().includes(filterValue.toLowerCase())
        );
    });

    const canAddNewItem = $derived.by(() => {
        if (!acceptValue || !filterValue) return false;
        return !normalizedItems.some(item => 
            item.name.toLowerCase() === filterValue.toLowerCase()
        );
    });

    function getSelectString(v: SelectValue<D>): string {
        const item = normalizedItems.find((i) => i.value == v);
        return item?.name ?? (v as string) ?? emptyString;
    }

    function formatValue(val: SelectValue<D>): string | null {
        if (!val && val !== 0) return null;
        if (!Array.isArray(val)) return getSelectString(val);
        return val.map((v) => getSelectString(v)).filter(Boolean).join(', ');
    }

    function removeItem(itemValue: T): void {
        if (multiple && Array.isArray(value)) {
            value = value.filter((x) => x != itemValue) as SelectValue<D>;
        } else {
            value = null as SelectValue<D>;
        }
        onchange?.(value);
        TextFieldInstance?.validate();
    }

    function addNewItem(): void {
        if (!filterValue || !canAddNewItem) return;
        
        // Create new item
        const newItem = { value: filterValue as T, name: filterValue };
        items = [...items, newItem];
        
        // Add to selection
        if (multiple && Array.isArray(value)) {
            value = [...value, filterValue as T] as SelectValue<D>;
        } else {
            value = filterValue as T as SelectValue<D>;
        }
        
        // Clear filter
        filterValue = '';
        
        handleChange();
    }

    function handleChange(): void {
        onchange?.(value);
        TextFieldInstance?.validate();
        if (!multiple) active = false;
    }

    function handleInputKeydown(event: KeyboardEvent): void {
        if (event.key === 'Enter' && canAddNewItem) {
            event.preventDefault();
            addNewItem();
        } else if (event.key === 'Backspace' && !filterValue) {
            event.preventDefault();
            if(multiple)
				value?.pop?.();
			else
				value = null;
        }
    }

    function handleInputClick(event: MouseEvent): void {
        event.stopPropagation();
        if (!active) {
            active = true;
        }
    }

    const fetchItems = async (filter?: string) => {
        if (!loadItems || loading) return;
        loading = true;
        try {
            const newItems = await loadItems(filter);
            items = newItems
        } catch (error) {
            console.error('Failed to load items:', error);
        } finally {
            loading = false;
        }
    }
</script>

<Menu
    closeOnClick={!multiple && !filterable && !acceptValue}
    {disabled}
    bind:active
    class={menuClass}
    {fullWidth}
    onopen={() => fetchItems(filterValue)}
    onclose={() => (filterValue = '')}
>
    {#snippet activator()}
        <TextField
            bind:this={TextFieldInstance}
            class="s-select {klass}"
            {style}
            {...rest}
            labelActive={active || !!value || !!(filterable || acceptValue)}
            value={(!filterable && !acceptValue) ? formatValue(value) : ''}
            onclear={() => (value = multiple ? [] as SelectValue<D> : null as SelectValue<D>)}
            readonly={!filterable && !acceptValue}
            {disabled}
            {hint}
        >	
            {#snippet content({id})}
                {#if value || value === 0}
                    {#each (Array.isArray(value) ? value : [value]) as val}
                        {#if chips}
                            {#if chip}
                                {@render chip({value: val, name: getSelectString(val)})}
                            {:else}
                                <Chip size="small" close onclose={() => removeItem(val)}>
                                    {getSelectString(val)}
                                </Chip>
                            {/if}
                        {:else}
                            <span style="margin-right: 4px;">{getSelectString(val)}</span>
                        {/if}
                    {/each}
                {/if}
                
                {#if (filterable || acceptValue) && !disabled}
                    <input
						{id}
                        bind:value={filterValue}
						aria-invalid="false"
						type="text"
                        onkeydown={handleInputKeydown}
                        onclick={handleInputClick}
                        oninput={() => fetchItems(filterValue)}
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
    
    <ListItemGroup bind:value onchange={handleChange} {mandatory} {multiple} {max}>
        {#if options}
            {@render options()}
        {:else}
            <div class="{itemsPanelClass}">
                {#if loading}
                    <div>Loading...</div>
                {:else}
                    {#if canAddNewItem}
                        <ListItem dense={rest.dense} onclick={addNewItem}>
                            {#snippet prepend()}
                                <Icon size={16} path={ADD_ICON} />
                            {/snippet}
                            Add "{filterValue}"
                        </ListItem>
                    {/if}
                    
                    {#if filteredItems.length}
                        {#each filteredItems as item}
                            {@const isActive = value && Array.isArray(value) ? 
                                value.includes(item.value) : value == item.value}
                            {#if option}
                                {@render option({item, active: isActive})}
                            {:else}
                                <ListItem dense={rest.dense} value={item.value} active={isActive}>
                                    {#snippet prepend()}
                                        {#if multiple}
                                            <Checkbox checked={isActive} />
                                        {/if}
                                    {/snippet}
                                    {item.name}
                                </ListItem>
                            {/if}
                        {/each}
                    {:else if !canAddNewItem}
                        <div>No options found</div>
                    {/if}
                {/if}
            </div>
        {/if}
    </ListItemGroup>
</Menu>
