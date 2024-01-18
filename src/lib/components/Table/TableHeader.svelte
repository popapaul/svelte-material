
<script>
    import "./TableHead.scss";
    import {setContext} from "svelte";
    setContext("tbl-header",true);
</script>

<thead class="s-table-head">
    <slot />
</thead>
