<script module lang="ts">
	export const EXPANSION_PANELS = {};

	export interface EXPANSION_PANELS_Context {
		values: Writable<any[]>;
		Disabled: Writable<any>;
		selectPanel: (index: any) => void;
		index: () => number;
	}
</script>

<script lang="ts">
	import './ExpansionPanels.scss';
	import { createEventDispatcher, setContext } from 'svelte';
	import { type Writable, writable } from 'svelte/store';

	// Classes to add to panel container.
	let klass = '';
	export { klass as class };

	// 0 based indices of the active panels.
	export let value: number[] = [];

	// Make multiple panels active at the same time.
	export let multiple: boolean = false;

	// Make is necessary for at least one panel to be selected.
	export let mandatory: boolean = false;

	// Accordion style panels.
	export let accordion: boolean = false;

	// Make panels popout when active.
	export let popout: boolean = false;

	// Make panels inset when active.
	export let inset: boolean = false;

	// Remove shadow from panels.
	export let flat: boolean = false;

	// Remove border radius from panels.
	export let tile: boolean = false;

	// Disable all the panels.
	export let disabled: boolean = null;

	// Styles to add to the panel container.
	export let style: string = null;

	const dispatch = createEventDispatcher();
	const values = writable(value);
	const Disabled = writable(disabled);

	$: values.set(value);
	$: Disabled.set(disabled);

	let startIndex = -1;

	setContext(EXPANSION_PANELS, {
		values,
		Disabled,
		selectPanel: (index) => {
			if (value.includes(index)) {
				if (!(mandatory && value.length === 1)) {
					value.splice(value.indexOf(index), 1);
					value = value;
					dispatch('change', { index, active: false });
				}
			} else {
				if (multiple) {
					value.push(index);
					value = value;
				} else {
					value = [index];
				}
				dispatch('change', { index, active: true });
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
	<slot />
</div>
