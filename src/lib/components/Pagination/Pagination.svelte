<script lang="ts">
	import './Pagination.scss';
	import Select from '../Select/Select.svelte';
	import Button from '../Button/Button.svelte';
	import Icon from '../Icon/Icon.svelte';
	import icons from '../../internal/Icons';

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
		onchange?:(page:number)=>void,
		onSizeChange?:(size:number)=>void
	}

	let {
		class: klass = '',
		buttons = [-2, -1, 0, 1, 2],
		pageSize = $bindable(),
		count = 0,
		pageSizes = Array.from(new Set([pageSize, 10, 25, 50, 75, 100, 150].filter(Boolean))).sort((a, b) => a - b),
		page = $bindable(),
		pageSelect = true,
		onSizeChange,
		onchange,
		type = 'buttons',
		style = ''
	}: Props = $props();

	const size = $derived(pageSize ?? pageSizes[0]);
	const index = $derived(page ?? 1);

	const calcDisplacer = (index: number) => {
		if (index - middle < 0) return Math.abs(0 - (index - middle));
		if (Number(index) + middle > pageCount - 1) return pageCount - 1 - (Number(index) + middle);
		return 0;
	};

	function onChange(index) {
		page = index;
		onchange?.(page);
	}

	let lastPage = $derived(Math.max(Math.ceil(count / size), 1));
	let middle = $derived(Math.floor(buttons.length / 2));
	let pageCount = $derived(Math.ceil(count / size) || 1);
</script>

<div class="s-pagination {klass}">
	
	<span style="width:120px; {style}">{Math.min((page -1) * pageSize + 1, count)}-{Math.min((Number(page)) * pageSize, count)} din {count}</span>
	{#if pageSelect}
		<Select
			style="max-width:120px;"
			class="!grow"
			mandatory
			acceptValue
			items={pageSizes.map((size) => ({ name: size?.toString(), value: size }))}
			value={size}
			onchange={(detail)=> {pageSize = detail; onSizeChange?.(detail)}}
		>
			Randuri
		</Select>
	{/if}
	<div class="flex gap-2 items-center">
		<Button fab size="x-small" onclick={(e) => onChange(1)} disabled={index <= 1}>
			<Icon path={icons.arrow_left_double} />
		</Button>
		<Button fab size="x-small" onclick={(e) => onChange(index - 1)} disabled={index <= 1}>
			<Icon path={icons.arrow_left} />
		</Button>

		{#if type == 'buttons'}
			{#each buttons.map((x) => x + calcDisplacer(index)) as button}
				{#if index + button >= 0 && index + button < pageCount}
					<Button
						fab
						size="x-small"
						class={index + button == index ? 'secondary-color' : 'primary-color'}
						onclick={(e) => onChange(index + button)}
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
					name: (size+1).toString(),
					value: size + 1
				}))}
				value={index}
				onchange={(val) => onSizeChange?.(val)}
			></Select>
		{/if}

		<Button
			fab
			size="x-small"
			onclick={(e) => onChange(Number(index) + 1)}
			disabled={index >= lastPage}
		>
			<Icon path={icons.arrow_right} />
		</Button>

		<Button fab size="x-small" onclick={(e) => onChange(lastPage)} disabled={index >= lastPage}>
			<Icon path={icons.arrow_right_double} />
		</Button>
	</div>
</div>
