<script lang="ts" generics="T">
    import type { LeafColumn, DatagridCore, FilterOperator, FilterCondition } from "./datagrid/core/index.svelte";
    import { Settings } from '@paulpopa/icons/md/outlined';
    import Button from "../Button/Button.svelte";
    import Icon from "../Icon/Icon.svelte";
    let { column, grid }: { grid:DatagridCore<T>, column: LeafColumn<T>} = $props();
    import { ArrowDropUp } from "@paulpopa/icons/md/outlined"   
	import { Menu } from "../Menu";
	import { Select } from "../Select";
	import { TextField } from "../TextField";
	import { DateTimeField } from "../DateTimeField";
    
    const toggleSort = () => grid.handlers.sorting.toggleColumnSort(column, false);
    
    const cellType = $derived("getValueFn" in column ?  column.getValueFn(grid.originalState.data[0]) : null);



    function getAvailableOperators(value: any): FilterOperator[] {
        if (value === null || value === undefined) 
            return ["empty", "notEmpty"];
            
        const type = typeof value;

        if (type === "string") {
            return [
                "equals",
                "notEquals",
                "contains",
                "notContains",
                "startsWith",
                "endsWith",
                "inList",
                "notInList",
                "empty",
                "notEmpty",
            ];
        }

        if (value instanceof Date) {
            return [
                "equals",
                "notEquals",
                "greaterThan",
                "lessThan",
                "greaterThanOrEqual",
                "lessThanOrEqual",
                "between",
                "empty",
                "notEmpty",
            ];
        }

        if (type === "number" || value instanceof Date) {
            return [
                "equals",
                "notEquals",
                "greaterThan",
                "lessThan",
                "greaterThanOrEqual",
                "lessThanOrEqual",
                "between",
                "inList",
                "notInList",
                "empty",
                "notEmpty",
            ];
        }

        if (typeof value === "boolean") {
            return [
                "equals",
                "notEquals",
                "empty",
                "notEmpty",
            ];
        }

        if (Array.isArray(value)) {
            return [
                "contains",
                "notContains",
                "inList",
                "notInList",
                "empty",
                "notEmpty",
            ];
        }

        // Default fallback
        return ["equals", "notEquals", "empty", "notEmpty"];
    }

    
    const filterCondition = $derived(grid.features.filtering.filterConditions.find(c => c.columnId === column.columnId)?? { columnId: column.columnId, operator: "equals", value: null, valueTo: null } as FilterCondition<T>  );
    const cellValues = $derived(Array.from(new Set(grid.originalState.data.map(row => column.getValueFn(row)))));
</script>


{#snippet filter()}
    {#if column.isFilterable() || true}
    <Menu class="w-[400px]" closeOnClick={false}>
        {#snippet activator()}
            <Button fab depressed class="w-5 h-5">
                <Icon size={20} path={Settings}  />
            </Button>
        {/snippet}

        <div class="flex gap-2 p-2">
 
            <Select 
                title="Operator"
                fullWidth={false}
                class="w-[140px] !grow-0"
                onchange={(op)=>grid.handlers.filtering.changeFilterOperator(column.columnId, op)} 
                value={grid.features.filtering.getConditionOperator(column.columnId)} 
                items={getAvailableOperators(cellType)} mandatory />
            {#if ["contains", "notContains", "startsWith", "endsWith"].includes(filterCondition.operator)}
                <TextField title="Valoare" value={filterCondition.value} />
            {:else if ["equals", "notEquals", "greaterThan", "lessThan", "greaterThanOrEqual", "lessThanOrEqual"].includes(filterCondition.operator)}
                {#if typeof cellType == "number"}
                    <TextField title="Valoare" type="number" value={filterCondition.value} />
                {:else if cellType instanceof Date}
                    <DateTimeField value={filterCondition.value} title="Data" />
                {:else if typeof cellType == "string" && ["equals", "notEquals"].includes(filterCondition.operator)}
                    <TextField  value={filterCondition.value} title="Valoare" />
                {/if}
            {:else if filterCondition.operator === "between"}
                    {#if typeof cellType == "number"}
                        <div class="flex gap-2">
                            <TextField type="number" value={filterCondition.value} title="Min" />
                            <TextField type="number" value={filterCondition.valueTo} title="Max" />
                        </div>
                    {:else if cellType instanceof Date}
                        <DateTimeField isRange={true} value={[filterCondition.value, filterCondition.valueTo]} />
                    {/if}
            {:else if filterCondition.operator === "inList" || filterCondition.operator === "notInList"}
                <Select 
                    multiple
                    onchange={(value)=>grid.handlers.filtering.updateFilterCondition({column, value, operator: filterCondition.operator})} 
                    value={filterCondition.value} 
                    items={cellValues} />
            {/if}
            
        </div>
        
    </Menu>
       
    {/if}
{/snippet}

{#snippet sorter()}
    {#if column.isSortable()}
        {@const direction = grid.features.sorting.getSortConfigByColumnId(column.columnId)}
        <Button onclick={toggleSort} fab depressed class="w-5 h-5">
            <Icon path={ArrowDropUp} rotate={direction?.direction == "descending" ? 180 : 0} />
        </Button>
    {/if}
{/snippet}
<div
    class="grid-header-cell cursor-pointer"
    style="{['left', 'right'].includes(column.pinning.position) && `background-color: black;`}"
    class:offset-left={column.pinning.position === 'left'}
    class:offset-right={column.pinning.position === 'right'}
    style:--offset={`${column.pinning.offset}px`}
    >
        <div
            aria-label="Click to sort column"
            role="button"
            tabindex="0"
            class="flex w-full items-center  gap-1 overflow-hidden"
            class:justify-end={column.align === 'right'}
            class:justify-center={column.align === 'center'}
            class:justify-start={column.align === 'left'}
        >   
            {#if column.headerCell}
                {@render column.headerCell({ column, datagrid:grid })}
            {:else}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div onclick={toggleSort} class="overflow-hidden inline-flex items-center text-ellipsis" style="height:35px;">{column.header}</div>
                {@render sorter()}
                {@render filter()}
            {/if}
           
        </div>
</div>

<style>
    .grid-header-cell {
        display: flex;
        flex-direction: column;
        padding: 0.5rem;
        --border-right: 1px solid hsl(var(--grid-border));

        min-width: 0;
        max-width: 100%;
        align-items: center;
        justify-content: center;
        gap: 0.25rem;
    }

    .grid-header-cell:last-child {
        border-right: none;
    }
</style>