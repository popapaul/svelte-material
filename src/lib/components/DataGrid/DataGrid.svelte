<script lang="ts" generics="T">
	import { setContext , type Snippet, type Component } from "svelte";
	import { Datagrid, type ColumnDef, type Row } from "./datagrid/index.svelte";
	import  CellHeader  from "./CellHeader.svelte";
	import  CellData  from "./CellData.svelte";
	import Column from "./Column.svelte";
    import {slide} from "svelte/transition"
	type ColumnComponent =   Component<ColumnDef<T>>;
    let { data = $bindable(), footer, class:klass, header, expand, children }:{ class?:string, data:T[], footer?:Snippet, expand?:Snippet<[Row<T>, Datagrid<T>]>, children:Snippet<[ColumnComponent]>; header?:Snippet, }  = $props();
    let columns:ColumnDef<T>[] = $state([]); 
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
            height: 0;
            flex-grow: 1;
            max-height: 100%;
            display: flex;
            flex-direction: column;
            overflow: auto;
            position: relative;
        }

        .grid-header {
            top: 0;
            z-index: 99;
            background-color: hsl(var(--grid-header-row-background));
            position: sticky;
        }

        .grid-header-row {
            background-color: hsl(var(--grid-header-row-background));
            display: flex;
            border-bottom: 1px solid hsl(var(--grid-border));
            min-width: fit-content;
        }

/* Label */
label {
    padding-bottom: 0.25rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
}

</style>