<script lang="ts">
    import "./TableCell.scss";
    let klass="";
    export {klass as class};
</script>

<th class="s-table-cell {klass}" on:click {...$$restProps}>
   <slot/>
</th>

