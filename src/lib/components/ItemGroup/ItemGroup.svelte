<script module lang="ts">
	export const ITEM_GROUP = {};

	export interface ItemGroupContext<T extends any> {
		select: (val: T) => void;
		values: T[];
		index: () => number;
		activeClass: string;
	}
	export const DEFAULTS:ItemGroupContext<any> = {
		select: () => null,
		index: () => 0,
		values: [],
		activeClass: 'active'
	};
</script>

<script lang="ts" generics="T, M extends boolean = false">
	import type { ConditionalBoolean } from '../../types';
	import './ItemGroup.scss';
	import { setContext } from 'svelte';

	type DiscriminatedProps =  { multiple:true, value:T[] } | { multiple:false, value:T };
	
	
	type Props =  {
		/** classes added to item group */
		class?: string;
		/** class to add to item when active */
		activeClass?: string;
		// /** value of the group */
		value?: ConditionalBoolean<T,M>;
		// /** allows to select multiple items */
		multiple?: M;
		/** makes sure atleast one item is selected */
		mandatory?: boolean;
		/** max number of selection */
		max?: number;
		/** roles of item */
		role?: string;
		/** styles added to item group */
		style?: string;
		onchange?: (value:ConditionalBoolean<T,M>) => void;

		children?: import('svelte').Snippet;
	} //& DiscriminatedProps;

	let {
		class: klass = '',
		activeClass = '',
		value = $bindable(),
		multiple,
		mandatory = false,
		max = Infinity,
		role = null,
		style = null,
		onchange,
		children
	}: Props = $props();

	
	const internal = $derived({
		multiple,
		activeClass,
		get value(){ return multiple ? value ?? [] : value },
		set value(val){ value = val as any}
	} as DiscriminatedProps);	


	let startIndex = -1;
	setContext(ITEM_GROUP, {
		select: (val:T) => {
			
			if (internal.multiple == true) {
				if (internal.value.includes(val)) {
					if (!mandatory || internal.value.length > 1) {
						//internal.value.splice(internal.value.indexOf(val), 1);
						internal.value = internal.value.filter(x=> x != val);
					}
				} 
				else if ((internal.value.length) < max) internal.value = [...internal.value, val];
			} else if (internal.value === val) {
				if (!mandatory) internal.value = null;
			} else internal.value = val;

			onchange?.(internal.value as any);
		},
		get values(){ return Array.isArray(internal.value) ? internal.value : [internal.value]},
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
