<script lang="ts" generics="T">
    import type { LeafColumn, DatagridCore, FilterOperator, FilterCondition } from "./datagrid/core/index.svelte";
    import { Info, Settings } from '@paulpopa/icons/md/outlined';
    import Button from "../Button/Button.svelte";
    import Icon from "../Icon/Icon.svelte";
    let { column, grid, onColumnResize }: { grid:DatagridCore<T>, column: LeafColumn<T>, onColumnResize?: (columnId: string, newWidth: number) => void } = $props();
    import { ArrowDropUp } from "@paulpopa/icons/md/outlined"   
	import { Menu } from "../Menu";
	import { Select } from "../Select";
	import { TextField } from "../TextField";
	import { DateTimeField } from "../DateTimeField";
    
    const toggleSort = () => column.sortable && grid.handlers.sorting.toggleColumnSort(column, false);
    
    const cellType = $derived("getValueFn" in column ?  column.getValueFn(grid.originalState.data[0]) : null);

    // Resize functionality
    let isResizing = $state(false);
    let startX = $state(0);
    let startWidth = $state(0);
    let currentWidth = $state(column.width || 150); // Default width if not set

    function startResize(event: MouseEvent) {
        isResizing = true;
        startX = event.clientX;
        startWidth = currentWidth;
        
        // Prevent text selection during resize
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'col-resize';
        
        document.addEventListener('mousemove', handleResize);
        document.addEventListener('mouseup', stopResize);
    }

    function handleResize(event: MouseEvent) {
        if (!isResizing) return;
        
        const deltaX = event.clientX - startX;
        const newWidth = Math.max(50, startWidth + deltaX); // Minimum width of 50px
        currentWidth = newWidth;
        
        column.width = newWidth; // Update the column width
        // Call the resize callback if provided
        onColumnResize?.(column.columnId, newWidth);
    }

    function stopResize() {
        isResizing = false;
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
        
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', stopResize);
    }

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

    
    const filterCondition = $derived(grid.features.filtering.filterConditions.find(c => c.columnId === column.columnId) ?? { columnId: column.columnId, operator: "equals", value: null, valueTo: null } as FilterCondition  );
    const cellValues = $derived(Array.from(new Set(grid.originalState.data.map(row => column.getValueFn(row)))));
</script>


{#snippet filter()}
    {#if column.filterable}
        <Menu class="w-[420px] max-h-[500px] overflow-y-auto" closeOnClick={false}>
            {#snippet activator()}
                <Button 
                    fab 
                    depressed 
                    class="w-5 h-5 {filterCondition.value || filterCondition.valueTo ? '!bg-blue-500 !text-white' : ''}"
                    title="Filter column">
                    <Icon size={16} path={Settings} />
                </Button>
            {/snippet}

            <div class="p-4 space-y-4">
                <!-- Header -->
                <div class="flex items-center justify-between border-b border-slate-400 dark:border-slate-700 pb-1">
                    <h3 class="text-sm font-semibold">
                        Filter: {column.header}
                    </h3>
                    {#if filterCondition.value || filterCondition.valueTo}
                        <Button 
                            size="small" 
                            text 
                            class="text-red-500 hover:text-red-700"
                            onclick={() => grid.handlers.filtering.clearFilter(column.columnId)}>
                            Clear
                        </Button>
                    {/if}
                </div>

                <!-- Operator Selection -->
                <div class="space-y-2">
                    <Select 
                        title="Condition"
                        fullWidth={true}
                        class="w-full"
                        onchange={(op) => grid.handlers.filtering.changeFilterOperator(column.columnId, op)} 
                        value={grid.features.filtering.getConditionOperator(column.columnId)} 
                        items={getAvailableOperators(cellType)} 
                        mandatory />
                </div>

                <!-- Value Input Section -->
                <div class="space-y-2">
                    {#if ["contains", "notContains", "startsWith", "endsWith"].includes(filterCondition.operator)}
                        <TextField 
                            title="Filter value"
                            value={filterCondition.value}
                            onchange={(value) => grid.handlers.filtering.updateFilterCondition({column, value, operator: filterCondition.operator})}
                            class="w-full" />
                            
                    {:else if ["equals", "notEquals", "greaterThan", "lessThan", "greaterThanOrEqual", "lessThanOrEqual"].includes(filterCondition.operator)}
                        {#if typeof cellType == "number"}
                            <TextField 
                                title="Filter value"
                                type="number" 

                                value={filterCondition.value}
                                onchange={(value) => grid.handlers.filtering.updateFilterCondition({column, value, operator: filterCondition.operator})}
                                class="w-full" />
                        {:else if cellType instanceof Date}
                            <DateTimeField 
                                title="Filter value"
                                value={filterCondition.value} 
                                onchange={(value) => grid.handlers.filtering.updateFilterCondition({column, value, operator: filterCondition.operator})}
                                class="w-full" />
                        {:else if typeof cellType == "string" && ["equals", "notEquals"].includes(filterCondition.operator)}
                            <TextField  
                                title="Filter value"
                                value={filterCondition.value}
                                onchange={(value) => grid.handlers.filtering.updateFilterCondition({column, value, operator: filterCondition.operator})}
                                class="w-full" />
                        {/if}
                        
                    {:else if filterCondition.operator === "between"}
                        {#if typeof cellType == "number"}
                            <div class="space-y-3">
                                <TextField 
                                    title="Filter value"
                                    type="number" 
                                    value={filterCondition.value}
                                    onchange={(value) => grid.handlers.filtering.updateFilterCondition({column, value, valueTo: filterCondition.valueTo,  operator: filterCondition.operator})}
                                    class="w-full">
                                    {#snippet prepend()}
                                        <span class="text-xs text-slate-500">Min</span>
                                    {/snippet}
                                </TextField>
                                <TextField 
                                    type="number" 
                                    title="Filter value"
                                    value={filterCondition.valueTo}
                                    onchange={(valueTo) => grid.handlers.filtering.updateFilterCondition({column, value: filterCondition.value, valueTo, operator: filterCondition.operator})}
                                    class="w-full">
                                    {#snippet prepend()}
                                        <span class="text-xs text-slate-500">Max</span>
                                    {/snippet}
                                </TextField>
                            </div>
                        {:else if cellType instanceof Date}
                            <DateTimeField 
                                title="Filter value"
                                isRange={true} 
                                value={[filterCondition.value, filterCondition.valueTo]}
                                onChange={(values) => grid.handlers.filtering.updateFilterCondition({
                                    column, 
                                    value: values[0],
                                    valueTo: values[1], 
                                    operator: filterCondition.operator
                                })}
                                class="w-full" />
                        {/if}
                        
                    {:else if filterCondition.operator === "inList" || filterCondition.operator === "notInList"}
                        <div class="space-y-3">
                            <Select 
                                title="Filter value"
                                multiple
                                onchange={(value) => grid.handlers.filtering.updateFilterCondition({column, value, operator: filterCondition.operator})} 
                                value={filterCondition.value} 
                                items={cellValues}
                                class="w-full" />
                            
                            {#if cellValues.length > 10}
                                <div class="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 rounded p-2">
                                    <Icon size={14} path={Info} class="inline mr-1" />
                                    Showing {Math.min(10, cellValues.length)} of {cellValues.length} unique values
                                </div>
                            {/if}
                        </div>
                        
                    {:else if ["empty", "notEmpty"].includes(filterCondition.operator)}
                        <div class="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-center">
                            <Icon size={20} path={Info} class="mx-auto mb-2 text-slate-400" />
                            No additional configuration needed for this filter type
                        </div>
                    {/if}
                </div>

                <!-- Active Filter Preview -->
                {#if filterCondition.value || filterCondition.valueTo}
                    <div class="border-t border-slate-200 dark:border-slate-700 pt-3">
                        <div class="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                            Active Filter
                        </div>
                        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                            <div class="text-sm font-medium text-blue-700 dark:text-blue-300">
                                {column.header} {filterCondition.operator}
                                {#if filterCondition.operator === "between"}
                                    {filterCondition.value} and {filterCondition.valueTo}
                                {:else if Array.isArray(filterCondition.value)}
                                    [{filterCondition.value.join(", ")}]
                                {:else}
                                    "{filterCondition.value}"
                                {/if}
                            </div>
                        </div>
                    </div>
                {/if}

                <!-- Action Buttons -->
                <div class="flex gap-2 pt-2 ">
                    <Button 
                        size="small" 
                        text
                        class="flex-1 success-color"
                        onclick={() => grid.features}>
                        Apply Filter
                    </Button>
                    <Button 
                        size="small" 
                          text
                        class="px-4 error-color"
                        onclick={() => grid.features.sorting.removeSortConfig(column.columnId)}>
                        Clear
                    </Button>
                </div>
            </div>
        </Menu>
    {/if}
{/snippet}

{#snippet sorter()}
    {#if column.sortable}
        {@const direction = grid.features.sorting.getSortConfigByColumnId(column.columnId)}
        <Button onclick={toggleSort} fab depressed class="w-3 h-3 mr-1 {direction ? "" : "opacity-0"}" title="Sort column">
            <Icon size={20} path={ArrowDropUp} rotate={direction?.direction == "descending" ? 180 : 0} />
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
            class="flex w-full items-center  overflow-hidden"
            class:justify-end={column.align === 'right'}
            class:justify-center={column.align === 'center'}
            class:justify-start={column.align === 'left'}
        >   
            {#if column.headerCell}
                {@render column.headerCell({ column, datagrid:grid })}
            {:else}
                  {@render sorter()}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div onclick={toggleSort} class="overflow-hidden inline-flex items-center text-ellipsis" style="height:35px;">{column.header}</div>
                {@render (column.filter ?? filter)()}
            {/if}
        </div>
        
        <!-- Resize Handle -->
        <div 
            class="resize-handle"
            class:resizing={isResizing}
            role="button"
            tabindex="0"
            title="Drag to resize column"
            onmousedown={startResize}
        ></div>
</div>

<style>
    .grid-header-cell {
        display: flex;
        flex-direction: column;
        padding: 0.5rem;
        --border-right: 1px solid hsl(var(--grid-border));
        position: relative;
        min-width: 0;
        max-width: 100%;
        align-items: center;
        justify-content: center;
        gap: 0.1rem;
    }

    .grid-header-cell:last-child {
        border-right: none;
    }

    .resize-handle {
        --primary: 210 40% 50%;
        position: absolute;
        right: -2px;
        top: 0;
        bottom: 0;
        width: 4px;
        cursor: col-resize;
        background: transparent;
        border-right: 2px solid transparent;
        transition: border-color 0.2s ease;
        z-index: 10;
    }

    .grid-header-cell:hover .resize-handle,
    .resize-handle.resizing {
        border-right-color: hsl(var(--primary, 210 40% 50%));
        background: radial-gradient(black, transparent);
    }

    .resize-handle:active {
        border-right-color: hsl(var(--primary, 210 40% 40%));
        background: radial-gradient(black, transparent);
    }

    /* Add visual feedback when resizing */
    .grid-header-cell:has(.resize-handle.resizing) {
        background: hsla(var(--primary, 210 40% 50%), 0.05);
    }
</style>