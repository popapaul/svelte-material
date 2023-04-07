<script context="module" lang="ts">
  export const TABLE_SORT = {};

  export type Direction = "asc" | "desc";

  export interface TableSort{
    handleSort: (by: string, reverse:boolean) => void;
    sort:Writable<Record<string,Direction>>,
  }
</script>

<script lang="ts">
  import { setContext, createEventDispatcher } from "svelte";
  import { writable, type Writable } from "svelte/store";
	import TableCell from "./TableCell.svelte";
  import TableHeader from "./TableHeader.svelte"
  import TableRow from "./TableRow.svelte";
  
  type T = $$Generic;
  type $$Events = {
    sort: CustomEvent<{sortBy:string, direction:Direction, sort:Record<string,Direction>}>;
  }

  let klass = '';
  export { klass as class };
  export let data:T[]=[];
  export let elevation:number=1;
  export let fixed = false;
  export let expansion=false;
  export let multipleSort=false;
  export let sort:Record<string,Direction> = {};

  const dispatch = createEventDispatcher();
  const sortContext = writable<Record<string,Direction>>(sort);

  const handleSort = (by: string, reverse:boolean) => {
   switch(sort[by]){
     case "asc":
        sort[by] = reverse ? "asc" : "desc"; break;
     case "desc":
        sort[by] = reverse ? "asc" : null; break;
     default:
        sort[by] = reverse ? "desc" : "asc"; break;
   }
   if(!multipleSort) sort = {[by]: sort[by]};
   sortContext.set(sort);
   dispatch("sort", {
    sortBy: by,
    direction: sort[by],
    sort,
  })
  }
 
  setContext<TableSort>(TABLE_SORT, {sort:sortContext, handleSort});
</script>


<style lang="scss" src="./Table.scss"></style>

<div class="s-table elevation-{elevation} {klass}">

  {#if $$slots.toolbar}
    <div class="toolbar">
      <slot name="toolbar"/>
    </div>
  {/if}

  <div class="s-table-container">
    <table class:layout-fixed={fixed}>
      <TableHeader>
        {#if expansion}
          <TableCell width="50px"/>
        {/if}
        <slot />
      </TableHeader>

      <tbody>
        {#each data??[] as context,index}
          <TableRow {expansion}>
              <slot {index} {context} />
              <slot name="expand" slot="expand" {index} {context} />
          </TableRow>
        {/each}
      </tbody>

        <slot name="aggregate"/>
    </table>
  </div>

  {#if $$slots.footer}
    <div class="s-table-footer">
      <slot name="footer"/>
    </div>
  {/if}
</div>
  