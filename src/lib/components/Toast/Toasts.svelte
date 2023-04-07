<script>
    import { toast } from './index'
    import { format } from '../../internal/Style';
    import { flip } from 'svelte/animate';
    import ToastItem from './ToastItem.svelte';

    export let top = false;
    export let left = false;
    export let bottom = false;
    export let right = false;
    export let center = false;
    export let offsetX = '8px';
    export let offsetY = '8px';
</script>

<style lang="scss" src="./Toasts.scss" global></style>

<div 
    class="s-snackbar__wrapper"
    class:top
    class:left
    class:bottom
    class:right
    class:center
    style="--s-snackbar-x:{format(offsetX)};--s-snackbar-u:{format(offsetY)};">
    {#each $toast as item(item)}
        <div animate:flip>
            <ToastItem {item} {...$$restProps}  />
        </div>
    {/each}
</div>