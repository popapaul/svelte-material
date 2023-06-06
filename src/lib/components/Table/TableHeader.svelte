
<script>
    import {setContext} from "svelte";
    setContext("tbl-header",true);
</script>

<thead class="s-table-head">
    <slot />
</thead>

<style lang="scss" src="./TableHead.scss" global></style>

