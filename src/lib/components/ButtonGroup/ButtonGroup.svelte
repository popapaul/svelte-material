<script lang="ts">
	import ItemGroup from '../ItemGroup/ItemGroup.svelte';
	import './ButtonGroup.scss';

	// Classes to add to button group.
	let klass: string = '';
	export { klass as class };

	// Does not remove box shadow.
	export let elevated: boolean = false;

	// Remove border.
	export let borderless: boolean = false;

	// Remove border radius.
	export let tile: boolean = false;

	// Add border radius to the first and last button.
	export let rounded: boolean = false;

	// Identifies buttons as active with this class.
	export let activeClass: string = 'active';

	// Array or string with the active button(s) value.
	export let value: any | any[];

	// Forces a value to always be selected (if available).
	export let mandatory: boolean = false;

	// Allow multiple selections, makes the value prop an array.
	export let multiple: boolean = false;

	// Maximun number of selections.
	export let max: number = Infinity;

	// Styles to apply to button group.
	export let style: string = null;
</script>

<ItemGroup on:change bind:value {activeClass} {multiple} {mandatory} {max}>
	<div class="s-btn-group {klass}" class:elevated class:borderless class:tile class:rounded {style}>
		<slot />
	</div>
</ItemGroup>
