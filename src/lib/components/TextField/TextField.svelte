<script lang="ts" generics="T">
	import './TextField.scss';
	import Icon from '../Icon/Icon.svelte';
	import uid from '../../internal/uid';
	import clearIcon from '../../internal/Icons/close';
	import { getContext } from 'svelte';
	import { FORM_FIELDS, type FormContext } from '../Form/Form.svelte';
	import { Input } from '../Input';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { fade } from 'svelte/transition';
	
	interface Props extends HTMLInputAttributes {
		/** Classes to add to text field wrapper. */
		class?: string;
		/** Value of the text field. */
		value?: T;
		/** Color class of the text field when active. */
		color?: string;
		/** Whether text field is the `filled` material design variant. */
		filled?: boolean;
		/** Whether text field is outlined by elevation. */
		solo?: boolean;
		/** Whether text field is the `outlined` material design variant. */
		outlined?: boolean;
		/** Whether text field do not have elevation. */
		flat?: boolean;

		title?: string;
		/** Whether text field height is reduced. */
		dense?: boolean;
		/** Whether text field has rounded corners. */
		rounded?: boolean;
		/** Whether text field has a clear button. */
		clearable?: boolean;
		/** Whether text field is read-only. */
		readonly?: any;
		/** Whether text field is disabled. */
		disabled?: boolean;
		/** Placeholder content for text field. */
		placeholder?: any;
		/** Hint text. */
		hint?: string;
		/** Display a counter set to a desired input length. */
		counter?: boolean;
		/** Error messages to display. */
		messages?: string[] | string;
		/**
	 * A list of validator functions that take the text field value and return an error
	 * message, or `true` otherwise.
	 */
		rules?: ((value: string) => string)[];
		/** Number of error messages to display. Defaults to one. */
		errorCount?: number;
		/** Whether to delay validation until blur. */
		validateOnBlur?: boolean;
		/** Whether text field has error. */
		error?: boolean;
		/** Whether text field has `success` class. */
		success?: boolean;
		/** Id of the text field. Defaults to a random uid. */
		id?: any;
		/** Styles to add to text field wrapper. */
		style?: any;
		/** Reference to text field element in the DOM. */
		inputElement?: HTMLInputElement;
		underline?: boolean;
		type?: string;
		labelActive?: boolean;
		onclear?: () => void;
		children?: import('svelte').Snippet;
		append?: import('svelte').Snippet;
		prepend?: import('svelte').Snippet;
		prependOuter?: import('svelte').Snippet;
		appendOuter?: import('svelte').Snippet;
		content?: import('svelte').Snippet;
	}

	const context = getContext<FormContext>(FORM_FIELDS);

	let {
		class: klass = '',
		value = $bindable(),
		color = 'primary',
		filled = false,
		solo = false,
		outlined = false,
		flat = false,
		dense = false,
		rounded = false,
		clearable = false,
		readonly = null,
		disabled = false,
		placeholder = null,
		hint = '',
		counter = false,
		messages = [],
		rules = [],
		errorCount = 1,
		validateOnBlur = true,
		error = $bindable(),
		success = false,
		id = `s-input-${uid(5)}`,
		style = null,
		title,
		inputElement = $bindable(),
		underline = true,
		type = 'text',
		labelActive = false,
		children,
		prependOuter,
		appendOuter,
		prepend,
		append,
		content,
		onfocus,
		onblur,
		onclear,
		onchange,
		...rest
	}: Props = $props();

	let errorMessages: string[] = $state([]);

	context?.register({ id, validate });

	let focused = $state(false);
	
	export function validate() {
		const text = value ?? inputElement.value;
		errorMessages = rules.map((r) => r(text?.toString())).filter((r) => typeof r === 'string');
		error = !!errorMessages.length;
		return errorMessages;
	}

	function onFocus(event) {
		focused = true;
		onfocus?.(event)
	}

	function onBlur(event) {
		focused = false;
		onblur?.(event);
		if (validateOnBlur && rules?.length) validate();
	}

	function clear(event: Event) {
		event.preventDefault();
		event.stopPropagation();
		event.stopImmediatePropagation();
		value = null;
		onclear?.();
	}

	const handleChange = (e) => {
		validate();
		onchange?.(e);
	};
</script>

<Input class="s-text-field {klass}" {prependOuter} {appendOuter} {color} {dense} {readonly} {disabled} {error} {success} {style}>
	<div
		class="s-text-field__wrapper"
		class:filled
		class:solo
		class:outlined
		class:flat
		class:line={underline}
		class:rounded
	>
		<!-- Slot for prepend inside the input. -->

		{#if prepend}
			<div class="s-prepend">
				{@render prepend()}
			</div>
		{/if}

		<div class="s-text-field__input">
			{#if children || title}
				<label
					for={id}
					class:active={labelActive ||
						value ||
						value?.toString?.() ||
						focused ||
						['date', 'time', 'datetime-local'].includes(type)}
				>	
					{#if title}
						{title}
					{:else if children}
						{@render children()}
					{/if}
				</label>
			{/if}
				
			<!-- <slot name="content" /> -->
			<!-- keypress Event is deprecated. Use keydown or keyup instead -->
			{#if content}
				{@render content()}
			{:else}
				<input
					bind:this={inputElement}
					bind:value
					{type}
					{placeholder}
					{id}
					{readonly}
					{disabled}
					aria-invalid={error}
					onfocus={onFocus}
					onblur={onBlur}
					onchange={handleChange}
					{...rest}
				/>
			{/if}
		</div>


		{#if clearable && value?.toString().length > 0}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div transition:fade onclick={clear} style="cursor:pointer">
				<Icon size={20} path={clearIcon} />
			</div>
		{/if}

		<!-- Slot for append inside the input. -->
		 {#if append}
			<div class="s-append">
				{@render append()}
			</div>
		{/if}
	</div>

	{#snippet info()}
		<div>
			<div>
				<span>{hint ?? ''}</span>
				{#each messages ? Array.isArray(messages) ? messages : [messages] :  [] as message}
					<span style="margin-right:8px;">{message}</span>
				{/each}
				{#each errorMessages.slice(0, errorCount) as message}<span>{message}</span>{/each}
			</div>
			{#if counter}<span>{(value as string)?.length??0} / {counter}</span>{/if}
		</div>
	{/snippet}
</Input>
