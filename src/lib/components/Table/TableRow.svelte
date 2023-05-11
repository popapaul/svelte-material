<script lang="ts">
    export let style="";
    let klass = '';
    export { klass as class};
    export let level:number=0;
</script>

<tr class="s-table-row {klass}" style="--tbl-level:{level}; {style}">
    <slot/> 
</tr>

<style lang="scss" src="./TableRow.scss" global></style>