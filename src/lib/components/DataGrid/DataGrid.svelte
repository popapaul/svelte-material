<script context="module" lang="ts">
	export const DATA_GRID_CONTEXT = {};

	export type Direction = 'asc' | 'desc' | null;

	export interface Column<T> {
		sortBy: string;
		direction: Direction;
		propriety?: (item: T) => string | number | boolean;
		compare: (a: T, b: T) => number;
	}

	export type DataGridContext<T = any> = ReturnType<typeof createContext<T>>;

	function createContext<T>(data: T[], multipleSort: boolean, dispatch) {
		const _context = writable({
			data,
			columns: {} as Record<string, Column<T>>,
			hasChildren: null as (item: T) => boolean,
			getChildren: null as (item: T) => Promise<T[]>
		});
		const { subscribe, set, update } = _context;

		return {
			rows: 0,
			set,
			subscribe,
			registerColumn: (column: Column<T>) => {
				column.sortBy = column.sortBy || crypto.randomUUID();
				update((context) => {
					context.columns[column.sortBy] = column;
					return { ...context, data };
				});
				return column.sortBy;
			},
			handleSort: (sortBy: string, reverse: boolean = false) => {
				let direction: Direction = null;

				update((context) => {
					const columns = context.columns;
					if (!multipleSort)
						Object.keys(columns).forEach((key) => key != sortBy && (columns[key].direction = null));
					switch (columns[sortBy].direction) {
						case 'asc':
							direction = 'desc';
							break;
						case 'desc':
							direction = 'asc';
							break;
						default:
							direction = reverse ? 'desc' : 'asc';
							break;
					}

					columns[sortBy].direction = direction;
					dispatch('sort', { sortBy, direction });
					return { ...context, data, columns };
				});
				return direction;
			}
		};
	}
</script>

<script lang="ts">
	import Columns from './DataRows.svelte';
	import { writable } from 'svelte/store';
	import { setContext, createEventDispatcher } from 'svelte';
	import { TableBody, TableHeader, Table, TableCell } from '../Table';

	type T = $$Generic;
	type $$Events = {
		sort: CustomEvent<{ sortBy: string; direction: Direction }>;
	};

	interface $$Slots {
		default: { context?: T; index?: number };
		expand: { context?: T; index?: number };
		toolbar: any;
		aggregate: any;
		footer: any;
	}

	export let data: T[];
	export let multipleSort = false;
	export let hasChildren: (item: T) => boolean = null;
	export let getChildren: (item: T) => Promise<T[]> = null;
	export let sorting: boolean = false;
	export let expand = false;

	const dispatch = createEventDispatcher();

	const context = createContext(data, multipleSort, dispatch);

	setContext<DataGridContext<T>>(DATA_GRID_CONTEXT, context);
	$: context.set({ data, columns: $context.columns, getChildren, hasChildren });
</script>

<Table {...$$restProps}>
	<slot name="toolbar" slot="toolbar" />

	<TableHeader>
		{#if hasChildren || expand}
			<TableCell width="50px" />
		{/if}
		<slot />
	</TableHeader>

	<TableBody>
		<Columns data={$context.data} {expand} {sorting} let:context let:index>
			<slot {context} {index} />
			<slot name="expand" slot="expand" {context} />
		</Columns>
		<slot name="aggregate" slot="aggregate" />
	</TableBody>

	<slot name="footer" slot="footer" />
</Table>
