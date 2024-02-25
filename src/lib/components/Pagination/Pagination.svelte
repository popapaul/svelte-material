<script lang="ts">
    import "./Pagination.scss";
    import Select from "../Select/Select.svelte";
    import Button from "../Button/Button.svelte";
    import Icon from "../Icon/Icon.svelte";
    import icons from "../../internal/Icons";
    import { createEventDispatcher } from 'svelte';

    let klass = '';
    export { klass as class };
    export let buttons = [-2, -1, 0, 1, 2];

    export let pageSize = 25;
    export let count=0;
    export let pageSizes:number[] = Array.from(new Set([pageSize,10, 25, 50, 75, 100, 150])).sort((a,b)=>a-b);
	export let page = 0;
    export let pageSelect=true;
    export let type = "buttons";
    export let style="";
  
    const dispatch = createEventDispatcher();

    const calcDisplacer = (page:number)=>{
		if(page - middle < 0)
			return Math.abs(0 - (page - middle));
		if( Number(page) + middle > pageCount-1)
			return pageCount -1 - (Number(page) + middle);
		return 0;
	}

    function onChange(event, index) {
		page = index;
		const detail = {
			event,
			page
		};
		dispatch('change', detail);
	}

    $: lastPage = Math.max(Math.ceil(count / pageSize) - 1, 0);
    $: middle = Math.floor(buttons.length/2);
	$: pageCount = Math.ceil(count / pageSize)||1;
</script>

<div class="s-pagination {klass}">
    <span style="width:120px; {style}">{page * pageSize + 1}-{Math.min((Number(page) + 1) * pageSize,count )} din {count}</span>
    {#if pageSelect}
        <Select
            style="width:60px;"
            mandatory
            items={pageSizes.map((size) => ({ name: size?.toString(), value: size }))}
            bind:value={pageSize}
        >
            Randuri
        </Select>
    {/if}
    <div class="flex gap-2">
        <Button
            fab
            size="x-small"
            on:click={(e) => onChange(e, 0)}
            disabled={page == 0}
        >
            <Icon  path={icons.arrow_left_double} />
        </Button>
        <Button
            fab
            size="x-small"
            on:click={(e) => onChange(e, page-1)}
            disabled={page == 0}
        >
            <Icon  path={icons.arrow_left} />
        </Button>

        {#if type == "buttons"}
        {#each (buttons.map(x => x + calcDisplacer(page))) as button}
            {#if page + button >= 0 && page + button < pageCount}
                <Button
                    fab
                    size="x-small"
                    class={page + button == page ? "secondary-color" : "primary-color"}
                    variant={page == page + button ? "raised" : "text"}
                    on:click={(e) => onChange(e, page + button)}
                >
                    <span class="s-number">{page + button + 1}</span>
                </Button>
            {/if}
        {/each}
        {:else}
            <Select
                dense
                style="width:60px;"
                mandatory
                items={Array.from(Array(pageCount).keys()).map((size) => ({ name: (size+1).toString(), value: size }))}
                value={page || 0}
                on:change={(e) => onChange(e, e.detail)}>
            </Select>
        {/if}
  
        <Button
            fab
            size="x-small"
            on:click={(e) => onChange(e, Number(page) + 1)}
            disabled={page == lastPage}
        >
            <Icon  path={icons.arrow_right} />
        </Button>

        <Button
            fab
            size="x-small"
            on:click={(e) => onChange(e, lastPage)}
            disabled={page == lastPage}
        >
            <Icon  path={icons.arrow_right_double} />
        </Button>
    </div>
</div>
