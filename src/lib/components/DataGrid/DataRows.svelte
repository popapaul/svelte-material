<script lang="ts">
	import './DataRows.scss';
	import { getContext } from 'svelte';
	import { DATA_GRID_CONTEXT, type DataGridContext } from './DataGrid.svelte';
	import DataRow from './DataRow.svelte';

	type T = $$Generic;
	export let data: T[];
	export let hasChildren: (item: T) => boolean = null;
	export let getChildren: (item: T) => Promise<T[]> = null;
	export let sorting = false;
	export let expand = false;

	const context = getContext<DataGridContext<any>>(DATA_GRID_CONTEXT);

	const sort = (items: T[]) => {
		const column = Object.values($context.columns).find((column) => column.direction);
		if (!column || !sorting) return data;
		return items.sort((a, b) => {
			const sortBy = column.sortBy;
			const propriety =
				column.propriety || ((item: T) => sortBy.split('.').reduce((acc, key) => acc[key], item));
			const compare =
				column.compare || ((a, b) => String(propriety(a)).localeCompare(String(propriety(b))));
			const result = compare(a, b);
			if (result != 0) return column.direction == 'asc' ? result : -result;
			return 0;
		});
	};

	let children: T[] = [];
	const handleExpand = async (item: T) => {
		if (children.length) return;
		children = await getChildren(item).catch(() => []);
	};
</script>

{#each sort(data) as context, index}
	{@const anyChildren = hasChildren?.(context)}
	<DataRow
		item={context}
		expand={expand || !!hasChildren}
		on:expand={() => anyChildren && handleExpand(context)}
	>
		<slot {index} {context} />
		<slot name="expand" slot="expand" />
	</DataRow>
{/each}
