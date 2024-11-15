<script module lang="ts">
	export const ITEM_GROUP = {};

	export interface ItemGroupContext {
		select: (val: any) => void;
		register: (setValue: (values: any[]) => void) => void;
		index: () => number;
		activeClass: string;
	}
</script>

<script lang="ts">
	import { run } from 'svelte/legacy';

	import './ItemGroup.scss';
	import { setContext, createEventDispatcher, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';

	/** classes added to item group */

	
	
	interface Props {
		class?: string;
		/** class to add to item when active */
		activeClass?: string;
		/** value of the group */
		value?: any;
		/** allows to select multiple items */
		multiple?: boolean;
		/** makes sure atleast one item is selected */
		mandatory?: boolean;
		/** max number of selection */
		max?: any;
		/** roles of item */
		role?: string;
		/** styles added to item group */
		style?: string;
		children?: import('svelte').Snippet;
	}

	let {
		class: klass = '',
		activeClass = '',
		value = $bindable(),
		multiple = false,
		mandatory = false,
		max = Infinity,
		role = null,
		style = null,
		children
	}: Props = $props();

	const dispatch = createEventDispatcher();
	const valueStore = writable(value);
	run(() => {
		valueStore.set(value);
	});

	let startIndex = -1;
	setContext(ITEM_GROUP, {
		select: (val) => {
			if (multiple) {
				if (value?.includes(val)) {
					if (!mandatory || value.length > 1) {
						value.splice(value.indexOf(val), 1);
						value = [...value];
					}
				} else if ((value?.length ?? 0) < max) value = [...(value ?? []), val];
			} else if (value === val) {
				if (!mandatory) value = null;
			} else value = val;
			dispatch('change', value);
		},
		register: (setValue) => {
			const u = valueStore.subscribe((val) => {
				setValue(multiple ? val : [val]);
			});
			onDestroy(u);
		},
		index: () => {
			startIndex += 1;
			return startIndex;
		},
		activeClass
	});
</script>

<div class="s-item-group {klass}" {role} {style}>
	{@render children?.()}
</div>
