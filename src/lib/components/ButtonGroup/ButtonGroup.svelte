<script lang="ts">
	import ItemGroup from '../ItemGroup/ItemGroup.svelte';
	import './ButtonGroup.scss';

	// Classes to add to button group.
	

	// Does not remove box shadow.

	// Remove border.

	// Remove border radius.

	// Add border radius to the first and last button.

	// Identifies buttons as active with this class.

	// Array or string with the active button(s) value.

	// Forces a value to always be selected (if available).

	// Allow multiple selections, makes the value prop an array.

	// Maximun number of selections.

	// Styles to apply to button group.
	interface Props {
		class?: string;
		elevated?: boolean;
		borderless?: boolean;
		tile?: boolean;
		rounded?: boolean;
		activeClass?: string;
		value: any | any[];
		mandatory?: boolean;
		multiple?: boolean;
		max?: number;
		style?: string;
		children?: import('svelte').Snippet;
	}

	let {
		class: klass = '',
		elevated = false,
		borderless = false,
		tile = false,
		rounded = false,
		activeClass = 'active',
		value = $bindable(),
		mandatory = false,
		multiple = false,
		max = Infinity,
		style = null,
		children
	}: Props = $props();
</script>

<ItemGroup on:change bind:value {activeClass} {multiple} {mandatory} {max}>
	<div class="s-btn-group {klass}" class:elevated class:borderless class:tile class:rounded {style}>
		{@render children?.()}
	</div>
</ItemGroup>
