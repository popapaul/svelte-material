<script lang="ts">
	import Icon from '../Icon/Icon.svelte';
	import uid from '../../internal/uid';
	import clearIcon from '../../internal/Icons/close';
	import { getContext, createEventDispatcher } from 'svelte';
	import { FORM_FIELDS, type FormContext } from '../Form/Form.svelte';
	import TextColor from '../../internal/TextColor';

	const context = getContext<FormContext>(FORM_FIELDS);

	type $$Events = {
		input: KeyboardEvent & { target: EventTarget & HTMLInputElement };
		blur: Event & { target: EventTarget & HTMLInputElement };
		click: Event & { target: EventTarget & HTMLInputElement };
		change: Event & { target: EventTarget & HTMLInputElement };
		keydown: KeyboardEvent & { target: EventTarget & HTMLInputElement };
		focus: Event & { target: EventTarget & HTMLInputElement };
		clear: CustomEvent;
	};

	let klass = '';
	/** Classes to add to text field wrapper. */
	export { klass as class };
	/** Value of the text field. */
	export let value: string|number|Date = '';
	/** Color class of the text field when active. */
	export let color = 'primary';
	/** Whether text field is the `filled` material design variant. */
	export let filled = false;
	/** Whether text field is outlined by elevation. */
	export let solo = false;
	/** Whether text field is the `outlined` material design variant. */
	export let outlined = false;
	/** Whether text field do not have elevation. */
	export let flat = false;
	/** Whether text field height is reduced. */
	export let dense = false;
	/** Whether text field has rounded corners. */
	export let rounded = false;
	/** Whether text field has a clear button. */
	export let clearable = false;
	/** Whether text field is read-only. */
	export let readonly = null;
	/** Whether text field is disabled. */
	export let disabled = false;
	/** Placeholder content for text field. */
	export let placeholder = null;
	/** Hint text. */
	export let hint = '';
	/** Display a counter set to a desired input length. */
	export let counter = false;
	/** Error messages to display. */
	export let messages: string[] = [];
	/**
	 * A list of validator functions that take the text field value and return an error
	 * message, or `true` otherwise.
	 */
	export let rules: ((value: string) => string)[] = [];
	/** Number of error messages to display. Defaults to one. */
	export let errorCount = 1;
	/** Whether to delay validation until blur. */
	export let validateOnBlur = true;
	/** Whether text field has error. */
	export let error = false;
	/** Whether text field has `success` class. */
	export let success = false;
	/** Id of the text field. Defaults to a random uid. */
	export let id = `s-input-${uid(5)}`;
	/** Styles to add to text field wrapper. */
	export let style = null;
	/** Reference to text field element in the DOM. */
	export let autogrow = false;
	export let textarea = autogrow;
	export let inputElement: HTMLInputElement | HTMLTextAreaElement = null;
	export let underline = true;
	export let type: string = 'text';

	const dispatch = createEventDispatcher();
	let touched = false;
	let errorMessages: string[] = [];

	context?.register({ id, validate });

	let focused = false;

	$: touched && (value || !value) && validate();
	$: labelActive = !!placeholder || value || value?.toString?.() || focused;
	export function validate() {
		errorMessages = rules.map((r) => r(value?.toString())).filter((r) => typeof r === 'string');
		error = !!errorMessages.length;
		return errorMessages;
	}

	function onFocus() {
		focused = true;
	}

	function onBlur() {
		touched = true;
		focused = false;
		if (validateOnBlur) validate();
	}

	function clear() {
		value = '';
		dispatch('clear');
	}

	const handleChange = (e) => {
		value = e.target.value;
	};
</script>

<div
	class="s-text-field s-input {klass}"
	class:dense
	class:error
	class:success
	class:readonly
	class:disabled
	{style}
	use:TextColor={error ? 'error' : color}
>
	<slot name="prepend-outer" />
	<div class="s-input__control">
		<div class="s-input__slot">
			<div
				class="s-text-field__wrapper"
				class:filled
				class:solo
				class:dense
				class:outlined
				class:flat
				class:line={underline}
				class:rounded
			>
				<!-- Slot for prepend inside the input. -->
				<slot name="prepend" />

				<div class="s-text-field__input" class:active={labelActive}>
					<label for={id} class:active={labelActive}>
						<slot />
					</label>
					<slot name="content" />
					<!-- keypress Event is deprecated. Use keydown or keyup instead -->

					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<svelte:element
						this={textarea ? 'textarea' : 'input'}
						bind:this={inputElement}
						value={value??""}
						on:input={handleChange}
						{type}
						{placeholder}
						{id}
						{readonly}
						{disabled}
						on:focus={onFocus}
						on:blur={onBlur}
						on:change={validate}
						on:focus
						on:blur
						on:input
						on:click
						on:change
						on:keypress
						on:keydown
						on:keyup
						{...$$restProps}
					/>
				</div>

				{#if clearable && value !== ''}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div on:click={clear} style="cursor:pointer">
						<!-- Slot for the icon when `clearable` is true. -->
						<slot name="clear-icon">
							<Icon path={clearIcon} />
						</slot>
					</div>
				{/if}

				<!-- Slot for append inside the input. -->
				<slot name="append" />
			</div>
		</div>
		<div class="s-input__details">
			<div>
				<span>{hint ?? ''}</span>
				{#each messages.slice(0, errorCount) as message}
					<span>{message}</span>{/each}
				{#each errorMessages.slice(0, errorCount) as message}
					<span>{message}</span>
				{/each}
			</div>
			{#if counter}
				<span>{value?.toString?.()?.length}</span>
			{/if}
		</div>
	</div>
	<slot name="append-outer" />
</div>

<style lang="scss" src="./TextField.scss" global></style>

