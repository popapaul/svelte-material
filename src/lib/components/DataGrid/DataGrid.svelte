<script lang="ts" generics="T">
	import { setContext , type Snippet, type Component } from "svelte";
	import { Datagrid, type ColumnDef, type Row } from "./datagrid/index.svelte";
	import  CellHeader  from "./CellHeader.svelte";
	import  CellData  from "./CellData.svelte";
	import Column from "./Column.svelte";
    import {slide} from "svelte/transition"
	type ColumnComponent =   Component<ColumnDef<T>>;
    let { data = $bindable(), columns = $bindable([]), footer, class:klass, header, expand, children }:{ columns?: ColumnDef<T>[]; class?:string, data:T[], footer?:Snippet, expand?:Snippet<[Row<T>, Datagrid<T>]>, children:Snippet<[ColumnComponent]>; header?:Snippet, }  = $props();
	setContext("columns", columns);
	let grid = new Datagrid({
		data,
		columns
	})
    $effect(()=>{
        grid.original.data = data;
    })
   

	$effect(()=>{
		grid.original.columns = columns;
		grid.columnsProcessor.transform();
	})
    
	
</script>
{@render children(Column)}
<div class="grid-wrapper {klass}">
    <div>
        {@render header?.()}
    </div>
	<div class="grid-content">
		<div class="grid-header">
            
			<div class="grid-header-row">
				{#each grid.columnManager.getVisibleColumns() as column}
					<CellHeader {grid} {column}/>
				{/each}
			</div>
		</div>

		<div class="grid-body">
			{#each grid.rows as row}
				<div class="grid-row">
					{#each grid.columnManager.getVisibleColumns() as column}
						<CellData {grid} {row} {column} />
					{/each}
				</div>
				{#if expand && grid.rowManager.isRowExpanded(String(row?.original?.id))}
					<div transition:slide={{axis:"y"}} class="grid-row">
                        {@render expand(row, grid)}
					</div>
				{/if}
			{/each}
		</div>
	</div>
    <div>
        {@render footer?.()}
    </div>
</div>

<style>
    .grid-wrapper{
        width: 100%;
        display: flex;
        flex-direction: column;
            --grid-row-even-background: 0 0% 100%;
            --grid-row-odd-background: 200 10% 96%;
            --grid-header-row-background: 200 0% 98%;

            --grid-border:0 0% 80%;


            --table-primary-hover: 0 0% 92%;
            --table-secondary: 0 0% 96%;
            --table-secondary-hover: 0 0% 92%;

            --table-row-odd: 0 0% 99%;
            --table-row-odd-hover: 0 0% 86%;
            --table-row-even: 0 0% 95%;
            --table-row-even-hover: 0 0% 89%;
        

            &.dark {
            --table-primary: 0 0% 9%;
            --table-primary-hover: 0 0% 5%;
            --table-secondary: 0 0% 10%;
            --table-secondary-hover: 0 0% 5%;

            --table-row-odd: 0 0% 9%;
            --table-row-odd-hover: 0 0% 5%;
            --table-row-even: 0 0% 10%;
            --table-row-even-hover: 0 0% 5%;
        }
       
    }
    /* Grid Content and Header */
        .grid-content {
            background-color: hsl(var(--grid-row-even-background));
            
            flex-grow: 1;
            max-height: 100%;
            display: flex;
            flex-direction: column;
            overflow: auto;
            position: relative;
        }

      

        .grid-header {
            top: 0;
            z-index: 11;
            background-color: hsl(var(--grid-header-row-background));
            position: sticky;
        }
        :global(.grid-content .grid-content .grid-header){
            z-index: 10;
        }
        .grid-header-row {
            background-color: hsl(var(--grid-header-row-background));
            display: flex;
            border-bottom: 1px solid hsl(var(--grid-border));
            min-width: fit-content;
        }



/* Grid Rows */
.grid-row {
    display: flex;
    border-bottom: 1px solid hsl(var(--grid-border));
    border-top: none;
    min-width: fit-content;
    transition: 150ms;
}

.grid-row:last-child {
    border-bottom: none;
}

.grid-row:nth-child(odd) {
    background-color: hsl(var(--grid-row-odd-background));
}

.grid-row:hover:nth-child(odd) {
    background-color: hsl(var(--grid-row-odd-background-hover));
}

.grid-row:nth-child(even) {
    background-color: hsl(var(--grid-row-even-background));
}

.grid-row:hover:nth-child(even) {
    background-color: hsl(var(--grid-row-even-background-hover));
}



/* Sticky Offsets */
.offset-left {
    left: var(--offset);
    position: sticky;
}

.offset-right {
    right: var(--offset);
    position: sticky;
}

/* Pagination */
.pagination {
    background-color: hsl(var(--grid-header-row-background));
    padding: 0.75rem;
    border: 1px solid hsl(var(--grid-border));
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: center;
    gap: 0.75rem;
}

@media (min-width: 640px) {
    .pagination {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

/* Pagination Details */
.pagination-details {
    --tw-text-opacity: 1;
    color: hsl(var(--muted-foreground) / var(--tw-text-opacity));
    order: 2;
    column-span: 2;
    display: none;
    text-align: center;
    font-size: 0.75rem; /* 12px */
    line-height: 1rem; /* 16px */
}

@media (min-width: 640px) {
    .pagination-details {
        order: 1;
        grid-column: span 1 / span 1;
        display: block;
        text-align: left;
    }
}

/* Pagination Navigation and Page Wrapper */
.pagination-navigation-container {
    order: 1;
    display: flex;
    gap: 0.5rem;
}

@media (min-width: 640px) {
    .pagination-navigation-container {
        order: 2;
        justify-content: center;
    }
}

.pagination-per-page-wrapper {
    order: 1;
    display: flex;
    justify-content: flex-end;
}

@media (min-width: 640px) {
    .pagination-per-page-wrapper {
        order: 2;
    }
}

/* Pagination Buttons */
.pagination-button {
    border: 1px solid hsl(var(--grid-border));
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.pagination-button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

.pagination-button:hover:not(:disabled) {
    background-color: theme('colors.orange.400');
}

/* Pagination Inputs and Select */
.pagination-input,
.pagination-select {
    border-radius: 0.25rem;
    border: 1px solid hsl(var(--grid-border));
    padding: 0 0.5rem;
    height: 2rem;
}

.pagination-input {
    max-width: 5rem;
}

/* Label 
label {
    padding-bottom: 0.25rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
}
*/
</style>