<script module>
	import uid from '../../internal/uid';

	const check = 'M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z';
	const dash = 'M4,11L4,13L20,13L20,11L4,11Z';
</script>

<script lang="ts" generics="T">
	import './Checkbox.scss';
	import { ripple as Ripple } from '../../actions/Ripple';
	import TextColor from '../../internal/TextColor';
	import { getContext } from 'svelte';
	import { FORM_FIELDS, type FormContext } from '../Form/Form.svelte';
	import type {  HTMLInputAttributes } from 'svelte/elements';

	const context = getContext<FormContext>(FORM_FIELDS);

	// Add class to checkbox wrapper.
	
	// Class to add to checkbox when it is checked or indeterminate.

	// Get/Set checked state.

	// Get/Set indeterminate state.

	// Make the checkbox disabled.

	// The value for the checkbox.

	// Combines components into a single group.

	// Id for the checkbox, defaults to a random uid.

	// Styles to add to checkbox.

	// The <input/> element of the checkbox.

	interface Props extends HTMLInputAttributes{
		class?: string;
		color?: string;
		checked?: boolean;
		indeterminate?: boolean;
		disabled?: boolean;
		errorCount?: number;
		/**
		* A list of validator functions that take the text field value and return an error
		* message, or `true` otherwise.
		*/
		rules?: ((value: string) => string)[];
		value?: T;
		group?: T[];
		/** Hint text. */
		hint?: string;
		id?: string;
		style?: string;
		inputElement?: HTMLInputElement;
		messages?: string[];
		error?: boolean;
		children?: import('svelte').Snippet;
		ongroup?:(group:T[])=>void;
	}

	let {
		class: klass = '',
		color = 'primary',
		checked = $bindable(),
		indeterminate = $bindable(false),
		disabled = false,
		errorCount = 1,
		rules = [],
		value = null,
		group = $bindable(),
		hint = '',
		id = $bindable(),
		style = null,
		inputElement = $bindable(),
		messages = [],
		error = $bindable(false),
		children,
		onchange,
		ongroup,
		...rest
	}: Props = $props();

	id = id || `s-checkbox-${uid(5)}`;

	let errorMessages: string[] = $state([]);

	export function validate() {
		errorMessages = rules.map((r) => r(checked ? 'true' : '')).filter((r) => typeof r === 'string');
		error = !!errorMessages.length;
		return errorMessages;
	}

	context?.register({ id, validate });

	let hasValidGroup = $derived(Array.isArray(group));
	$effect(() => {
		if (hasValidGroup && value != null) {
			checked = group.indexOf(value) >= 0;
		}
	});
	const handleChange = (event)=>{
		groupUpdate();
		onchange?.(event);
	}

	function groupUpdate() {

		if (!hasValidGroup) group = [];
		if (value != null) {
			const i = group.indexOf(value);
			if (i < 0) {
				group.push(value);
			} else {
				group.splice(i, 1);
			}
			group = group;
		}
		ongroup?.(group);
	}
</script>

<div class="s-checkbox {klass}" {style}>
	<div
		class="s-checkbox__wrapper"
		class:disabled
		

	>
		<input
			{...rest}
			type="checkbox"
			bind:this={inputElement}
			aria-checked={checked}
			bind:checked
			bind:indeterminate
			{id}
			{disabled}
			{value}
			onchange={handleChange}
		/>
		<div class="s-checkbox__background" aria-hidden="true">
			{#if checked || indeterminate}
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
					<path d={checked ? check : dash} />
				</svg>
			{/if}
		</div>
	</div>
	<div style="display:flex;flex-direction:column">
		<label for={id}>
			{@render children?.()}
		</label>
		<!-- svelte-ignore a11y_label_has_associated_control -->
		<div style="padding-left:12px">
			<span>{hint ?? ''}</span>
			{#each messages ?? [] as message}<span style="margin-right:8px;">{message}</span>{/each}
			{#each errorMessages.slice(0, errorCount) as message}<span>{message}</span>{/each}
		</div>
	</div>
</div>
