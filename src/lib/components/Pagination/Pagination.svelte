<script lang="ts">
	import './Pagination.scss';
	import Select from '../Select/Select.svelte';
	import Button from '../Button/Button.svelte';
	import Icon from '../Icon/Icon.svelte';
	import icons from '../../internal/Icons';
	import { createEventDispatcher } from 'svelte';

	

	interface Props {
		class?: string;
		buttons?: any;
		pageSize?: number;
		count?: number;
		pageSizes?: number[];
		page?: number;
		pageSelect?: boolean;
		type?: string;
		style?: string;
	}

	let {
		class: klass = '',
		buttons = [-2, -1, 0, 1, 2],
		pageSize = $bindable(),
		count = 0,
		pageSizes = Array.from(new Set([pageSize, 10, 25, 50, 75, 100, 150].filter(Boolean))).sort((a, b) => a - b),
		page = $bindable(),
		pageSelect = true,
		type = 'buttons',
		style = ''
	}: Props = $props();

	const size = $derived(pageSize ?? pageSizes[0]);
	const index = $derived(page ?? 0);

	const dispatch = createEventDispatcher();

	const calcDisplacer = (index: number) => {
		if (index - middle < 0) return Math.abs(0 - (index - middle));
		if (Number(index) + middle > pageCount - 1) return pageCount - 1 - (Number(index) + middle);
		return 0;
	};

	function onChange(event, index) {
		page = index;
		const detail = { event, index};
		dispatch('change', detail);
	}

	let lastPage = $derived(Math.max(Math.ceil(count / size) - 1, 0));
	let middle = $derived(Math.floor(buttons.length / 2));
	let pageCount = $derived(Math.ceil(count / size) || 1);
</script>

<div class="s-pagination {klass}">
	<span style="width:120px; {style}">{page * pageSize + 1}-{Math.min((Number(page) + 1) * pageSize, count)} din {count}</span>
	{#if pageSelect}
		<Select
			style="max-width:120px;"
			mandatory
			items={pageSizes.map((size) => ({ name: size?.toString(), value: size }))}
			value={size}
			on:change={({detail})=> pageSize = detail}
		>
			Randuri
		</Select>
	{/if}
	<div class="flex gap-2">
		<Button fab size="x-small" on:click={(e) => onChange(e, 0)} disabled={index == 0}>
			<Icon path={icons.arrow_left_double} />
		</Button>
		<Button fab size="x-small" on:click={(e) => onChange(e, index - 1)} disabled={index == 0}>
			<Icon path={icons.arrow_left} />
		</Button>

		{#if type == 'buttons'}
			{#each buttons.map((x) => x + calcDisplacer(index)) as button}
				{#if index + button >= 0 && index + button < pageCount}
					<Button
						fab
						size="x-small"
						class={index + button == index ? 'secondary-color' : 'primary-color'}
						variant={index == index + button ? 'raised' : 'text'}
						on:click={(e) => onChange(e, index + button)}
					>
						<span class="s-number">{index + button + 1}</span>
					</Button>
				{/if}
			{/each}
		{:else}
			<Select
				dense
				style="width:60px;"
				mandatory
				items={Array.from(Array(pageCount).keys()).map((size) => ({
					name: (size + 1).toString(),
					value: size
				}))}
				value={index}
				on:change={(e) => onChange(e, e.detail)}
			></Select>
		{/if}

		<Button
			fab
			size="x-small"
			on:click={(e) => onChange(e, Number(index) + 1)}
			disabled={index == lastPage}
		>
			<Icon path={icons.arrow_right} />
		</Button>

		<Button fab size="x-small" on:click={(e) => onChange(e, lastPage)} disabled={index == lastPage}>
			<Icon path={icons.arrow_right_double} />
		</Button>
	</div>
</div>
