<script module>
	import uid from '../../internal/uid';
</script>

<script>
	import { createBubbler, handlers } from 'svelte/legacy';

	const bubble = createBubbler();
	import './Switch.scss';
	import TextColor from '../../internal/TextColor';

	// Add class to switch wrapper.
	

	// Color of the switch when active.

	// The value for the switch.

	// Combines components into a single group.

	// Get/Set checked state.

	// make switch inset.

	// Makes the switch dense.

	// Disables the switch.

	// Id for switch.

	// Styles to add to switch.

	// The <input/> element of the switch.
	/** @type {{class?: string, color?: string, value?: any, group?: any, checked?: boolean, inset?: boolean, dense?: boolean, disabled?: boolean, id?: any, style?: any, inputElement?: any, children?: import('svelte').Snippet}} */
	let {
		class: klass = '',
		color = 'primary',
		value = null,
		group = $bindable([]),
		checked = $bindable(false),
		inset = false,
		dense = false,
		disabled = false,
		id = $bindable(),
		style = null,
		inputElement = $bindable(),
		children
	} = $props();

	id = id || `s-switch-${uid(5)}`;

	const hasValidGroup = Array.isArray(group);
	if (hasValidGroup && value) {
		if (group.indexOf(value) >= 0) checked = true;
	}

	function groupUpdate() {
		if (hasValidGroup && value) {
			const i = group.indexOf(value);
			if (i < 0) {
				group.push(value);
			} else {
				group.splice(i, 1);
			}
			group = group;
		}
	}
</script>

<div class="s-switch {klass}" {style}>
	<div
		class="s-switch__wrapper"
		class:dense
		class:inset
		class:disabled
		use:TextColor={checked && color}
	>
		<input
			type="checkbox"
			bind:this={inputElement}
			role="switch"
			aria-checked={checked}
			bind:checked
			{id}
			{disabled}
			{value}
			onchange={handlers(groupUpdate, bubble('change'))}
		/>
		<div class="s-switch__track"></div>
		<div class="s-switch__thumb"></div>
	</div>
	<label for={id}>
		{@render children?.()}
	</label>
</div>
