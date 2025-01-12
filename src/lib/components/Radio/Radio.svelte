<script module>
	import uid from '../../internal/uid';
</script>

<script lang="ts">
	import './Radio.scss';
	import TextColor from '../../internal/TextColor';
	import { ripple as Ripple } from '../../actions/Ripple';
	import { FORM_FIELDS, type FormContext } from '../Form/Form.svelte';
	import { getContext } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	const context = getContext<FormContext>(FORM_FIELDS);

	// Add class to radio wrapper.
	

	// Color of the radio when active.

	// Disables the radio.

	// Bind radio to a group.

	// Value for the radio.

	// Id for the checkbox.

	// Styles for the radio wrapper.

	// The <input/> element of the radio.
	interface Props extends HTMLInputAttributes{
		class?: string;
		color?: string;
		disabled?: boolean;
		group?: string | number | string[] | boolean;
		value?: string | number | string[] | boolean;
		id?: string;
		style?: string;
		/**
	 * A list of validator functions that take the radio field value and return an error
	 * message, or `true` otherwise.
	 */
		rules?: ((value: any) => string)[];
		inputElement?: HTMLInputElement;
		children?: import('svelte').Snippet;
	}

	let {
		class: klass = '',
		color = 'primary',
		disabled = false,
		group = $bindable(),
		value = null,
		id = $bindable(),
		style = null,
		onchange,
		rules = [],
		inputElement = $bindable(),
		children,
		...rest
	}: Props = $props();

	let errorMessages: string[] = $state([]);

	export function validate() {
		errorMessages = rules.map((r) => r(group)).filter((r) => typeof r === 'string');
		return errorMessages;
	}

	const check = (_: any) => {
		if (!rules.map((r) => r(group)).filter((r) => typeof r === 'string').length) errorMessages = [];
	};

	$effect(() => {
		check(group);
	});
	const handleChange = (event) =>{
		validate();
		onchange?.(event)
	}
	context?.register({ id, validate });

	id = id || `s-radio-${uid(5)}`;
	let active = $derived(group === value);
</script>

<div class="s-radio {klass}" {style}>
	<div
		class="s-radio__wrapper"
		class:disabled
		use:TextColor={!disabled && active && color}
		use:Ripple={{ centered: true }}
	>
		<input
			type="radio"
			bind:this={inputElement}
			bind:group
			onchange={handleChange}
			{id}
			{value}
			{disabled}
			{...rest}
		/>
		<div class="s-radio__background"></div>
	</div>
	<div
		style="display:flex;flex-direction:column"
		use:TextColor={!!errorMessages.length ? 'error' : color}
	>
		<label for={id}>
			{@render children?.()}
		</label>
		<!-- svelte-ignore a11y_label_has_associated_control -->
		<label>
			{#each errorMessages.slice(0, 1) as message}<span>{message}</span>{/each}
		</label>
	</div>
</div>
