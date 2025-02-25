<script lang="ts" generics="T">
	import { setContext, untrack , type Snippet, type Component } from "svelte";
	import { DatagridCore, type LeafColumn, type GridBasicRow, type DatagridCoreConfig, type ColumnSizeState } from "./datagrid/index.svelte";
	import CellHeader  from "./CellHeader.svelte";
	import Column from "./Column.svelte";
    import Button from "../Button/Button.svelte";
    import TextField from "../TextField/TextField.svelte";
    import Pagination from "../Pagination/Pagination.svelte";
    
    import Icon from "../Icon/Icon.svelte";
    import {flip} from "svelte/animate"
	import { debounce } from "../../internal/Debounce";
    import {ArrowDropUp} from "@paulpopa/icons/md/outlined"   
    import CellData from "./CellData.svelte";
    import { slide } from "svelte/transition"
    import { Search } from '@paulpopa/icons/md/outlined';

    type Props = {
        data:T[]; 
        columns?: DatagridCoreConfig<T>["columns"]; 
        class?:string, 
        createBasicRowIdentifier?: (row:T) => string,
        footer?:Snippet<[DatagridCore<T>]>, 
        expand?:Snippet<[GridBasicRow<T>,  DatagridCore<T>]>, 
        children:Snippet<[Component<LeafColumn<T>>]>; 
        header?:Snippet<[DatagridCore<T>]>,
        onSwitch?: (event:{dragged:GridBasicRow<T>, target:GridBasicRow<T>}) => void
    } & DatagridCoreConfig<T>["features"]
    let { 
        data = $bindable(), 
        columns = $bindable([]), 
        footer, class:klass, 
        header, 
        createBasicRowIdentifier,
        expand, 
        onSwitch,
        children,
        ...features
     }:Props  = $props();


	export const grid = new DatagridCore({data, columns:[], createBasicRowIdentifier, features}, false);
    setContext("datagrid", grid);
 
     $effect(()=>{
        if(grid.initial.data == data) return;
       
        untrack(()=>{
            grid.initial.data = data;
            grid.processors.data.executeFullDataTransformation();
        })
     })
    type Position = 'top' | 'middle' | 'bottom';

 
function getMouseVerticalPosition(event: DragEvent): Position {
    // The element over which the drag event is triggered
    const element = event.target as HTMLElement;
   
    // Get the element's size and position relative to the viewport
    const elementRect = element.getBoundingClientRect();

    // Get the height of the element
    const elementHeight = elementRect.height;

    // Calculate mouse Y position relative to the element
    const mouseY = event.clientY - elementRect.top;

    // Determine the height of each third of the element
    const topThird = elementHeight / 3;
    const bottomThird = 2 * topThird;

    // Determine which third the mouse is in
    if (mouseY < topThird) {
        return 'top'; // Mouse is in the top third
    } else if (mouseY < bottomThird) {
        return 'middle'; // Mouse is in the middle third
    } else {
        return 'bottom'; // Mouse is in the bottom third
    }
}

    let _el =$state<HTMLElement>();
	let draggedItem: GridBasicRow<T>;
    let hovered: { row?: GridBasicRow<T>; position?: Position } = $state({});

   function isBefore(el1, el2) {
    if (el2.parentNode === el1.parentNode)
      for (
        var cur = el1.previousSibling;
        cur && cur.nodeType !== 9;
        cur = cur.previousSibling
      )
        if (cur === el2) return true;
    return false;
  }

  function dragStart(e:DragEvent, row: GridBasicRow<T>) {
    draggedItem = row
  }

  function dragOver(e:DragEvent, row: GridBasicRow<T>) {
    if (row == draggedItem) return;

    const position = getMouseVerticalPosition(e);
    hovered.row = row;
    hovered.position = position;
  }

  function dragEnd(e, row: GridBasicRow<T>) {
    if (row == draggedItem) return;
	e.preventDefault();	
   
	const index = grid.cache.paginatedRows.indexOf(row);
    grid.cache.paginatedRows =  grid.cache.paginatedRows.filter(x=> x!= draggedItem)

    const position = getMouseVerticalPosition(e);
   
    const offset = position == 'bottom' ? 0 : 0;

    grid.cache.paginatedRows.splice(index + offset, 0, draggedItem);
    onSwitch?.({dragged:draggedItem, target: row});

    handleDrag.clear();
  }

  function touchStart(e) {
    console.log("touchStart()");
    e.preventDefault();

    if (e.touches.length == 1) {
      _el = e.targetTouches[0].target;
      _el.style.backgroundColor = "#e5e5e5";
    }
  }

  function touchMove(e) {
    console.log("touchMove()");
    e.preventDefault();

    if (isBefore(_el, e.target))
      e.target.parentNode.insertBefore(_el, e.target);
    else e.target.parentNode.insertBefore(_el, e.target.nextSibling);
  }

  function generateGridTemplate(columns: ColumnSizeState[]): string {
    return columns
        .map(col => {
            if(col.width) 
                return typeof col.width === "number" ? `${col.width}px` : col.width;

            const min = (col.minWidth ?? col.width ?? 100) + "px";
            const max = (col.maxWidth ?? col.width ?? 100) + "px"; 

            return `minmax(${min}, ${col.grow ? max : "1fr"})`;
        })
        .join(" ");
    }

  function touchEnd(e) {
    console.log("touchEnd()");
  }
    const handleDrag = debounce((e, row)=>dragOver(e, row),1);

</script>
{@render children(Column)}
<div class="grid-wrapper rounded-md overflow-hidden {klass}" style="--cols-count:{grid.columns.length+1};">
    <header class="px-4 py-1 flex bg-white">
        {@render header?.(grid)}
        <TextField clearable class="ml-auto max-w-[250px]" bind:value={grid.features.globalSearch.value}  onclear={() => (grid.features.globalSearch.value = '')}>
			{#snippet prepend()}
				<Icon path={Search} size="22" />
			{/snippet}
            Search
        </TextField>
    </header>
	<div class="grid-content" style="grid-template-columns: {expand ? "50px" :""} {generateGridTemplate(grid.columnManager.getLeafColumns().map(y=>y.state.size))}">
		<div class="grid-header">
			<div class="grid-header-row">
                {#if expand}
                    <div></div>
                {/if}
				{#each grid.columnManager.getLeafColumns() as column}
					<CellHeader {grid} {column}/>
				{/each}
			</div>
		</div>
		<div class="grid-body">
			{#each grid.rows.getBasicRows() as row(row.identifier)}
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div class="grid-row {hovered.position}" class:hovered={hovered.row == row} animate:flip={{duration:300}}
                    draggable="true"
                    ondragstart={() => (draggedItem = row)}
                    ondragover={(e)=> {e.preventDefault();  dragOver(e, row)}}
                    ondrop={(e)=>dragEnd(e,row)}
                    ondragend={()=>hovered = {row:null, position:null}}
                    ontouchstart={touchStart}
                    ontouchmove={touchMove}
                    ontouchend={touchEnd}>
                    {#if expand}
                            <Button
                                depressed
                                icon
                                class="m-auto"
                                size="small"
                                onclick={() => grid.handlers.rowExpanding.toggleRowExpansion(row.identifier)}>
                                <Icon path={ArrowDropUp} rotate={row.isExpanded() ? 180 : 90} />
                            </Button>
                        {/if}
                        {#each grid.columnManager.getLeafColumnsInOrder() as column}
                            <CellData datagrid={grid} {row} {column} />
                        {/each}
                    {#if expand && row.isExpanded()}
                        <div class="row-expand" transition:slide={{axis:"y"}}>
                            {@render expand(row, grid)}
                        </div>
                    {/if}
                </div>
               
			{/each}

		</div>
	</div>
    <footer class="px-4 py-1">
        {@render footer?.(grid)}
        
        <Pagination
            type="select"
            bind:page={grid.features.pagination.page}
            bind:pageSize={grid.features.pagination.pageSize}
            count={grid.features.pagination.count} />
    </footer>
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
            display: grid;
            overflow: auto;
            position: relative;
            grid-auto-rows: max-content;
        }
        .row-expand{
            border-top: 1px solid hsl(var(--grid-border));
            grid-column: span var(--cols-count);
        }
        .grid-body{
            grid-column: span var(--cols-count);
            grid-template-columns: subgrid;
            display:grid;
            grid-auto-rows: max-content;
        }

        footer{
            border-top: 1px solid hsl(var(--grid-border));
        }
        header{
            border-bottom: 1px solid hsl(var(--grid-border));
        }
      

        .grid-header {
            top: 0;
            z-index: 11;
            background-color: hsl(var(--grid-header-row-background));
            position: sticky;
            grid-column: span var(--cols-count);
            grid-template-columns: subgrid;
            display:grid;
        }
        :global(.grid-content .grid-content .grid-header){
            z-index: 10;
        }
        .grid-header-row {
            background-color: hsl(var(--grid-header-row-background));
            display: grid;
            grid-column: span var(--cols-count);
            grid-template-columns: subgrid;
            border-bottom: 1px solid hsl(var(--grid-border));
            min-width: fit-content;
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


    /* Grid Rows */
    .grid-row {
        grid-column: span var(--cols-count);
        grid-template-columns: subgrid;
        display:grid;
        border-bottom: 1px solid hsl(var(--grid-border));
        border-top: none;
        min-width: fit-content;
        transition: 150ms;
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


    .hovered{
        position: relative;
    }
    .hovered::before, .hovered::after{
        content:"";
        opacity:0;
        height:7px;
        position: absolute;
        left:10px;
        right:10px;
        z-index: 2;
        border-radius: 4px;
        transition: all 300ms ;
    }
    .hovered.top::before, .hovered.bottom::after {
        content:"";
        background-color: orange !important;
        opacity: 1;
    }
    .hovered::before{
        top:-4px;
    }
    .hovered::after{
        bottom:-4px;
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