<script lang="ts">
	import { preventDefault } from 'svelte/legacy';

	import './RangePips.css';

	// range slider props

	// range pips / values props

	// formatting props

	// stylistic props

	// methods
	interface Props {
		range?: 'min' | 'max' | boolean;
		min?: number;
		max?: number;
		step?: number;
		values?: any;
		vertical?: boolean;
		reversed?: boolean;
		hoverable?: boolean;
		disabled?: boolean;
		pipstep?: number;
		all?: 'label' | boolean;
		first?: any;
		last?: any;
		rest?: any;
		prefix?: string;
		suffix?: string;
		formatter?: any;
		focus?: any;
		orientationStart?: any;
		percentOf?: any;
		moveHandle?: any;
		fixFloat?: any;
	}

	let {
		range = false,
		min = 0,
		max = 100,
		step = 1,
		values = [(max + min) / 2],
		vertical = false,
		reversed = false,
		hoverable = true,
		disabled = false,
		pipstep = null,
		all = true,
		first = undefined,
		last = undefined,
		rest = undefined,
		prefix = '',
		suffix = '',
		formatter = (value: number, index: number, procentage: number) => value,
		focus = undefined,
		orientationStart = undefined,
		percentOf = undefined,
		moveHandle = undefined,
		fixFloat = undefined
	}: Props = $props();

	let pipStep =
		$derived(pipstep ||
		((max - min) / step >= (vertical ? 50 : 100) ? (max - min) / (vertical ? 10 : 20) : 1));

	let pipCount = $derived((max - min) / (step * pipStep));

	let pipVal = $derived(function (val) {
		return fixFloat(min + val * step * pipStep);
	});

	let isSelected = $derived(function (val) {
		return values.some((v) => fixFloat(v) === fixFloat(val));
	});

	let inRange = $derived(function (val) {
		if (range === 'min') {
			return values[0] > val;
		} else if (range === 'max') {
			return values[0] < val;
		} else if (range) {
			return values[0] < val && values[1] > val;
		}
	});

	function labelClick(val) {
		if (!disabled) {
			moveHandle(undefined, val);
		}
	}
</script>

<div class="rangePips" class:disabled class:hoverable class:vertical class:reversed class:focus>
	{#if (all && first !== false) || first}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<span
			class="pip first"
			class:selected={isSelected(min)}
			class:in-range={inRange(min)}
			style="{orientationStart}: 0%;"
			onclick={() => labelClick(min)}
			onkeydown={() => labelClick(min)}
			ontouchend={preventDefault(() => labelClick(min))}
		>
			{#if all === 'label' || first === 'label'}
				<span class="pipVal">
					{#if prefix}<span class="pipVal-prefix">{prefix}</span>{/if}{formatter(
						fixFloat(min),
						0,
						0
					)}{#if suffix}<span class="pipVal-suffix">{suffix}</span>{/if}
				</span>
			{/if}
		</span>
	{/if}

	{#if (all && rest !== false) || rest}
		{#each Array(pipCount + 1) as _, i}
			{#if pipVal(i) !== min && pipVal(i) !== max}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<span
					class="pip"
					class:selected={isSelected(pipVal(i))}
					class:in-range={inRange(pipVal(i))}
					style="{orientationStart}: {percentOf(pipVal(i))}%;"
					onclick={() => labelClick(pipVal(i))}
					onkeydown={() => labelClick(pipVal(i))}
					ontouchend={preventDefault(() => labelClick(pipVal(i)))}
				>
					{#if all === 'label' || rest === 'label'}
						<span class="pipVal">
							{#if prefix}<span class="pipVal-prefix">{prefix}</span>{/if}{formatter(
								pipVal(i),
								i,
								percentOf(pipVal(i))
							)}{#if suffix}<span class="pipVal-suffix">{suffix}</span>{/if}
						</span>
					{/if}
				</span>
			{/if}
		{/each}
	{/if}

	{#if (all && last !== false) || last}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<span
			class="pip last"
			class:selected={isSelected(max)}
			class:in-range={inRange(max)}
			style="{orientationStart}: 100%;"
			onclick={() => labelClick(max)}
			onkeydown={() => labelClick(max)}
			ontouchend={preventDefault(() => labelClick(max))}
		>
			{#if all === 'label' || last === 'label'}
				<span class="pipVal">
					{#if prefix}<span class="pipVal-prefix">{prefix}</span>{/if}{formatter(
						fixFloat(max),
						pipCount,
						100
					)}{#if suffix}<span class="pipVal-suffix">{suffix}</span>{/if}
				</span>
			{/if}
		</span>
	{/if}
</div>
