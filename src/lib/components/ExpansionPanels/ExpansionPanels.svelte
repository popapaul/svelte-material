<script module lang="ts">
	export const EXPANSION_PANELS = {};

	export interface EXPANSION_PANELS_Context {
		values: number[];
		disabled: boolean;
		selectPanel: (index: number) => void;
		index: () => number;
	}
</script>

<script lang="ts">
	import './ExpansionPanels.scss';
	import { setContext } from 'svelte';

	// Classes to add to panel container.
	

	// 0 based indices of the active panels.

	// Make multiple panels active at the same time.

	// Make is necessary for at least one panel to be selected.

	// Accordion style panels.

	// Make panels popout when active.

	// Make panels inset when active.

	// Remove shadow from panels.

	// Remove border radius from panels.

	// Disable all the panels.

	// Styles to add to the panel container.
	interface Props {
		class?: string;
		value?: number[];
		multiple?: boolean;
		mandatory?: boolean;
		accordion?: boolean;
		popout?: boolean;
		inset?: boolean;
		flat?: boolean;
		tile?: boolean;
		disabled?: boolean;
		style?: string;
		children?: import('svelte').Snippet;
		onchange?:(value:{ index:number, active: boolean })=>void
	}

	let {
		class: klass = '',
		value = $bindable([]),
		multiple = false,
		mandatory = false,
		accordion = false,
		popout = false,
		inset = false,
		flat = false,
		tile = false,
		disabled = null,
		style = null,
		onchange,
		children
	}: Props = $props();

	let startIndex = -1;

	setContext(EXPANSION_PANELS, {
		get values(){return value},
		get disabled(){return disabled},
		selectPanel: (index) => {
			if (value.includes(index)) {
				if (!(mandatory && value.length === 1)) {
					value.splice(value.indexOf(index), 1);
					value = value;
					onchange?.({ index, active: false })
				}
			} else {
				if (multiple) {
					value.push(index);
					value = value;
				} else {
					value = [index];
				}
				onchange?.({ index, active: false })
			}
		},
		index: () => {
			startIndex += 1;
			return startIndex;
		}
	});
</script>

<div
	class="s-expansion-panels {klass}"
	class:accordion
	class:popout
	class:inset
	class:flat
	class:tile
	{style}
>
	{@render children?.()}
</div>
