<script module>
	import uid from '../../internal/uid';
</script>

<script lang="ts" generics="T">
	import './Switch.scss';
	import TextColor from '../../internal/TextColor';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {
		/** Class to add to switch wrapper. */
		class?: string;
		/** Color of the switch when active. */
		color?: string;
		/** The value for the switch. */
		value?: T;
		/** Combines components into a single group. */
		group?: T[];
		/** Get/Set checked state. */
		checked?: boolean;
		/** Make switch inset. */
		inset?: boolean;
		/** Makes the switch dense. */
		dense?: boolean;
		/** Disables the switch. */
		disabled?: boolean;
		/** Id for switch. */
		id?: string;
		/** Styles to add to switch. */
		style?: string;
		/** The <input/> element of the switch. */
		inputElement?: HTMLInputElement;
		/** The children (Svelte snippet). */
		children?: import('svelte').Snippet;
	};
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
		children,
		onchange,
		...rest
	}:Props = $props();

	id = id || `s-switch-${uid(5)}`;

	const hasValidGroup = Array.isArray(group);
	if (hasValidGroup && value) {
		if (group.indexOf(value) >= 0) checked = true;
	}

	function groupUpdate(event) {
		if (hasValidGroup && value) {
			const i = group.indexOf(value);
			if (i < 0) {
				group.push(value);
			} else {
				group.splice(i, 1);
			}
			group = group;
		}
		onchange?.(event)
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
			onchange={groupUpdate}
			{...rest}
		/>
		<div class="s-switch__track"></div>
		<div class="s-switch__thumb"></div>
	</div>
	<label for={id}>
		{@render children?.()}
	</label>
</div>
