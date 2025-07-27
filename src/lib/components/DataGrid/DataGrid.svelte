<script lang="ts" generics="T">
	import { onMount, setContext, untrack , type Component, type ComponentProps, type Snippet } from "svelte";
	import { DatagridCore,  type GridBasicRow, type ColumnSizeState, type DatagridCoreConfig, type GridRow, type FilterCondition } from "./datagrid/core/index.svelte";
	import CellHeader  from "./CellHeader.svelte";
	import Column from "./Column.svelte";
    import Button from "../Button/Button.svelte";
    import TextField from "../TextField/TextField.svelte";
    import Pagination from "../Pagination/Pagination.svelte";
    import "./datagrid/style.css";
    import Icon from "../Icon/Icon.svelte";
    import {flip} from "svelte/animate"
	import { debounce } from "../../internal/Debounce";
    import {ArrowDropUp} from "@paulpopa/icons/md/outlined"   
    import CellData from "./CellData.svelte";
    import { slide } from "svelte/transition"
    import { Search } from '@paulpopa/icons/md/outlined';
	import { VirtualList } from "./datagrid/virtualization";
	import Header from "./Header.svelte";
	import { PersistentState } from "../../actions/localStorage/index.svelte";

    type Props = {
        data:T[]; 
        class?:string, 
        virtualization?:boolean,
        children?: Snippet<[ { Column: Component<ComponentProps<Column<T>>> } ]>;
        createBasicRowIdentifier?: (row:T) => string,
        footer?: Snippet<[ { grid: DatagridCore<T> } ]>;
        header?: Snippet<[ { grid: DatagridCore<T> } ]>;
        expand?: Snippet<[ { row: GridRow<T>; original:T, grid: DatagridCore<T> } ]>;
        onSwitch?: (event:{dragged:GridRow<T>, target:GridRow<T>}) => void,
        expandable?: (row:GridRow<T>)=>{ isExpanded:boolean } | false,
        count?: number;
        globalSearchEnabled?:boolean;
        serverSide?:boolean,
        state?:{
            page?: number;
            size?: number;
            search?: string;
            sortBy?: string;
            order?: string;
            filters?: Omit<FilterCondition<T>, "getValueFn">[]
        },

    } & DatagridCoreConfig<T>["initialState"]
    let { 
        data = $bindable<T[]>(), 
        footer, 
        class:klass, 
        header, 
        createBasicRowIdentifier,
        expand, 
        onSwitch,
        children,
        expandable,
        virtualization,
        state:context = $bindable(),
        serverSide = false,
        count = 0,
        globalSearchEnabled = true,
        ...restState
     }:Props  = $props();
  
    const initialState:DatagridCoreConfig<T>["initialState"] = {...restState};
    Object.assign(initialState, {
        pagination: { manual: serverSide, page: context?.page?? 1, pageSize: context?.size??25, totalCount: count },
        sorting: {
            isManual: serverSide,
            allowMultiSort:false,
            sortConfigs: context?.sortBy ? [{ columnId: context.sortBy, direction: context.order === "asc" ? "ascending" : "descending" }] : [],
        },
        globalSearch: { isManual: serverSide, searchQuery: context?.search ?? "" }
    } satisfies DatagridCoreConfig<T>["initialState"]);

	const grid = new DatagridCore({data, columns:[], rowIdGetter:createBasicRowIdentifier, initialState}, false);
    setContext("datagrid", grid);
    if (context) {
        
        grid.events.on("onPageSizeChange", console.log);
        grid.events.on("onPageChange", ({ newPage }) => context.page = newPage);
        grid.events.on("onPageSizeChange", ({ pageSize }) => context.size = pageSize);
        grid.events.on("onSearchQueryChange", ({ newQuery }) => context.search = newQuery);
        grid.events.on("onFilterChange", () => context.filters = grid.features.filtering.filterConditions.map(({columnId, value, valueTo, operator})=> ({ columnId, value, valueTo, operator  }))),
        grid.events.on("onColumnSort", () => {
            const sort = grid.features.sorting.sortConfigs?.[0];
            context.sortBy = sort?.columnId ?? "";
            context.order = sort?.direction === "descending" ? "desc" : sort?.direction === "ascending" ? "asc" : null;
        });
    }

    $effect(()=>{
        grid.features.pagination.totalCount = Number(count);
    })
     $effect(()=>{
        data;
        untrack(()=>{
            grid.originalState.data = data;
            grid.cacheManager.invalidate('everything');
		    grid.refresh(() => {}, { recalculateAll: true });
        })
     });




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
	let draggedItem: GridRow<T>;
    let hovered: { row?: GridRow<T>; position?: Position } = $state({});

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

  function dragStart(e:DragEvent, row: GridRow<T>) {
    draggedItem = row
  }

  function dragOver(e:DragEvent, row: GridRow<T>) {
    if (row == draggedItem) return;

    const position = getMouseVerticalPosition(e);
    hovered.row = row;
    hovered.position = position;
  }

  function dragEnd(e, row: GridRow<T>) {
    if (row == draggedItem) return;
	e.preventDefault();	
   
	const index = grid.cacheManager.paginatedRows.indexOf(row);
    grid.cacheManager.paginatedRows =  grid.cacheManager.paginatedRows.filter(x=> x!= draggedItem)

    const position = getMouseVerticalPosition(e);
   
    const offset = position == 'bottom' ? 0 : 0;

    grid.cacheManager.paginatedRows.splice(index + offset, 0, draggedItem);
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
    const touchMoveDebounce = debounce((e)=>touchMove(e),1);

    const storage = new PersistentState("datagrid-columns", { });
    setContext("datagrid-columns", storage);

    const leafColumns = $derived(grid.columns.getLeafColumnsInOrder.filter(c => c.visible));

  const hasExpand = expand || grid.features.hierarchy.enabled;
  onMount(() => {
    // Initialize the grid after the component is mounted
    const rows = grid.rows.getVisibleRows();
    rows.forEach(row => {
      if (expandable?.(row)) 
        grid.features.rowExpanding.toggleRowExpansion(row.identifier);
    });
  });
</script>

{#snippet rowSnippet({item:row}:{item:GridRow<T>})}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="grid-row {hovered.position}" class:hovered={hovered.row == row} 
      draggable="true"
      ondragstart={() => (draggedItem = row)}
      ondragover={(e)=> {e.preventDefault();  dragOver(e, row)}}
      ondrop={(e)=>dragEnd(e,row)}
      ondragend={()=>hovered = {row:null, position:null}}
      ontouchstart={touchStart}
      ontouchmove={touchMove}
      ontouchend={touchEnd}>
      {#if grid.features.hierarchy.enabled}
        {#if grid.features.hierarchy.hasChildren?.(row)}
            <Button
                depressed
                icon
                class="m-auto"
                style="margin-left:{(row.depth ?? 0) * 20}px;"
                size="small"
                onclick={() => grid.features.hierarchy.toggleRowExpansion(row.identifier)}>
                <Icon path={ArrowDropUp} rotate={row.isExpanded() ? 180 : 90} />
            </Button>
            {:else}
            <div></div>
        {/if}
             
          {/if}

          {#if expand}
            {#if !expandable || expandable(row)}
              <Button
                  depressed
                  icon
                  class="m-auto"
                  size="small"
                  onclick={() => grid.features.rowExpanding.toggleRowExpansion(row.identifier)}>
                  <Icon path={ArrowDropUp} rotate={row.isExpanded() ? 180 : 90} />
              </Button>
              {:else}
              <div></div>
              {/if}
          {/if}

          {#each leafColumns as column}
              <CellData datagrid={grid} {row} {column} />
          {/each}
      {#if expand && row.isExpanded()}
          <div class="row-expand" transition:slide={{axis:"y"}}>
              {@render expand({row, original:row.original, grid})}
          </div>
      {/if}
  </div>
{/snippet}

{#snippet headerSnippet()}
    <Header {grid} {leafColumns} {hasExpand}  />
{/snippet}

{@render children({Column})}
<div class="grid-wrapper rounded-md overflow-hidden {klass}" style="--cols-count:{grid._columns.length+1};">
    
    <header class="px-4 py-1 relative flex bg-white">
        {@render header?.({ grid})}

        {#if globalSearchEnabled}
            <TextField clearable class="ml-auto max-w-[250px]" value={grid.features.globalSearch.searchQuery} oninput={({target})=>grid.features.globalSearch.updateSearchQuery(target.value)}  onclear={() => grid.features.globalSearch.updateSearchQuery("")}>
                {#snippet prepend()}
                    <Icon path={Search} size="22" />
                {/snippet}
                Search
            </TextField>
        {/if}
    </header>
	<div class="grid-content overflow-auto"  style="height:{virtualization ? 0 : "auto"}; grid-template-columns: {hasExpand ? "30px" :""} {generateGridTemplate(leafColumns)}">
        {#if virtualization}
            <VirtualList header={headerSnippet} v1_slot={rowSnippet} class="grid-body" items={grid.rows.getVisibleRows()}/>
        {:else}
            <div class="grid-body  auto-rows-[min-content]">
                {@render headerSnippet()}
                {#each grid.rows.getVisibleRows() as item}
                    {@render rowSnippet({ item })}
                {/each}
            </div>
        {/if}
	</div>
    <footer class="px-4 py-1 bg-white">
        {@render footer?.({grid})}
        <Pagination
            type="select"
            page={grid.features.pagination.page}
            pageSize={grid.features.pagination.pageSize}
            onchange={(page)=>grid.features.pagination.goToPage(page)}
            onSizeChange={(size)=>grid.features.pagination.setPageSize(size)}
            count={grid.features.pagination.totalCount} />
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
            grid-template-rows: max-content 1fr;
            background-color: hsl(var(--grid-row-even-background));
            flex-grow: 1;
            max-height: 100%;
            display: grid;
            height:0;
            position: relative;
        }
        .row-expand{
            border-top: 1px solid hsl(var(--grid-border));
            grid-column: span var(--cols-count);
        }
        :global(.grid-body){
            grid-column: span var(--cols-count);
            grid-template-columns: subgrid;
            display:grid;

        }

        footer{
            border-top: 1px solid hsl(var(--grid-border));
        }
        :global(.grid-wrapper header){
            grid-column: span var(--cols-count);
            border-bottom: 1px solid hsl(var(--grid-border));
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