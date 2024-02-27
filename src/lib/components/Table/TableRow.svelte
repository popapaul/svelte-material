<script lang="ts">
	import './TableRow.scss';
	export let style = '';
	let klass = '';
	export { klass as class };
	export let level: number = 0;
</script>

<tr class="s-table-row {klass}" style="--tbl-level:{level}; {style}">
	<slot />
</tr>
