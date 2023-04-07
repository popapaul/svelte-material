<script lang="ts">
    import Button from "../Button/Button.svelte"
    import Icon from "../Icon/Icon.svelte";
    import Add from "../../internal/Icons/add"

    import { createEventDispatcher } from "svelte";
    import { fade } from "svelte/transition";
    export let colors:string[]=[];
    export let color:string;
    import { flip } from "svelte/animate";
    import Menu from "../Menu/Menu.svelte";
    import ListItem from "../List/ListItem.svelte";
    import List from "../List/List.svelte";

    const dispatch = createEventDispatcher();
    const addColor = ()=>{
        if(!color) return;
        colors.push(color);
        colors = [...new Set(colors)];
        dispatch("change", colors);
    }

    const selectColor = (color:string)=>{
        dispatch("select", color);
    }
</script>

<div class="swatches">
    {#each colors as color(color)}
        <div transition:fade animate:flip>
            <Menu rightClick>
                <Button slot="activator" on:click={()=>selectColor(color)}  icon fab size="x-small" style="color:{color};">
                    <div class="swatch" style="background-color:{color};"></div>
                </Button>
                <List>
                    <ListItem on:click={()=>colors=colors.filter(x=>x!=color)}> remove</ListItem>
                </List>
            </Menu>
        </div>
    {/each}
    {#if color && !colors.some(x=>x==color)}
        <div in:fade>
            <Button disabled={!color} on:click={addColor} style="color:{color};" icon fab size="x-small">
                <div class="swatch" style="background-color:{color};color:white;">
                    <Icon path={Add}/>
                </div>
            </Button>
        </div>  
    {/if}
 
</div>

<style >
    .swatches{
        display:flex;
        flex-wrap: wrap;
    }
    .swatch{
        height:24px;
        width:24px;
        margin:auto;
        border-radius: 50px;
    }
</style>