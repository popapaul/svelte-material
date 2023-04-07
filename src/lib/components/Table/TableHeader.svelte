
<script>
    import {setContext} from "svelte";
    setContext("tbl-header",true);
</script>

<thead class="s-table-head">
    <tr class="s-table-row">
        <slot />
    </tr>
</thead>

<style lang="scss" src="./TableHead.scss" global></style>

