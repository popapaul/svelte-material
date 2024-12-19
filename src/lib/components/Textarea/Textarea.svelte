<script lang="ts">
	import { run, createBubbler, handlers } from 'svelte/legacy';

	const bubble = createBubbler();
	import Input from '../Input/Input.svelte';
	import Icon from '../Icon/Icon.svelte';
	import uid from '../../internal/uid';
	import clearIcon from '../../internal/Icons/close';
	import { onMount } from 'svelte';

	interface $$Events {
		input: KeyboardEvent & { target: EventTarget & HTMLInputElement };
		blur: Event & { target: EventTarget & HTMLInputElement };
		click: Event & { target: EventTarget & HTMLInputElement };
		change: Event & { target: EventTarget & HTMLInputElement };
		keydown: Event & { target: EventTarget & HTMLInputElement };
		focus: Event & { target: EventTarget & HTMLInputElement };
		clear: CustomEvent;
	}

	/** Classes to add to text field wrapper. */

	interface Props {
		class?: string;
		/** Value of the textarea. */
		value?: string;
		/** Color class of the textarea when active. */
		color?: string;
		/** Whether textarea is the `filled` material design variant. */
		filled?: boolean;
		/** Whether textarea is outlined by elevation. */
		solo?: boolean;
		/** Whether textarea is the `outlined` material design variant. */
		outlined?: boolean;
		/** Whether textarea do not have elevation. */
		flat?: boolean;
		/** Whether textarea has rounded corners. */
		rounded?: boolean;
		/** Whether textarea has a clear button. */
		clearable?: boolean;
		/** Whether textarea is read-only. */
		readonly?: boolean;
		/** Number of initial textarea lines. Defaults to 5. */
		rows?: number;
		/** Whether textarea is allowed to grow with the text. */
		autogrow?: boolean;
		/** Whether textarea is not allowed to grow with the text. */
		noResize?: boolean;
		/** Whether textarea is disabled. */
		disabled?: boolean;
		/** Placeholder content for textarea. */
		placeholder?: any;
		/** Hint text. */
		hint?: string;
		/** Display a counter set to a desired input length. */
		counter?: boolean;
		/**
	 * A list of validator functions that take the textarea value and return an error
	 * message, or `true` otherwise.
	 */
		rules?: ((value: string | number | string[]) => string | true)[];
		/** Number of error messages to display. Defaults to one. */
		errorCount?: number;
		/** Error messages to display. */
		messages?: any;
		/** Whether to delay validation until blur. */
		validateOnBlur?: boolean;
		/** Whether textarea has error. */
		error?: boolean;
		/** Whether textarea wrapper has `success` class. */
		success?: boolean;
		/** Id of the textarea. Defaults to a random uid. */
		id?: any;
		/** Styles to add to textarea wrapper. */
		style?: any;
		/** Reference to textarea element in the DOM. */
		textarea?: HTMLTextAreaElement;
		underline?: boolean;
		children?: import('svelte').Snippet;
		append?: import('svelte').Snippet;
		prepend?: import('svelte').Snippet;
		prependOuter?: import('svelte').Snippet;
		appendOuter?: import('svelte').Snippet;
	}

	let {
		class: klass = '',
		value = $bindable(),
		color = 'primary',
		filled = false,
		solo = false,
		outlined = false,
		flat = false,
		rounded = false,
		clearable = false,
		readonly = false,
		rows = 1,
		autogrow = false,
		noResize = false,
		disabled = false,
		placeholder = null,
		hint = '',
		counter = false,
		rules = [],
		errorCount = 1,
		messages = [],
		validateOnBlur = false,
		error = $bindable(false),
		success = false,
		id = `s-input-${uid(5)}`,
		style = null,
		textarea = $bindable(),
		underline = true,
		dense = false,
		children,
		prependOuter,
		appendOuter,
		prepend,
		append,
		...rest
	}: Props = $props();
	let focused = $state(false);
	let labelActive = $derived(placeholder || value || focused);
	let errorMessages = $state([]);

	function checkRules() {
		errorMessages = rules.map((r) => r(value)).filter((r) => typeof r === 'string');
		if (errorMessages.length) error = true;
		else {
			error = false;
		}
	}

	function onFocus() {
		focused = true;
	}

	function onBlur() {
		focused = false;
		if (validateOnBlur) checkRules();
	}

	function clear() {
		value = '';
	}

	function handleHeight() {
		if (autogrow && textarea) {
			textarea.style.height = 'auto';
			textarea.style.height = `${textarea.scrollHeight}px`;
		}
	}
	$effect(()=>{
		value;
		 handleHeight()
		})

	function onInput() {
		if (!validateOnBlur) checkRules();
	}
</script>

<Input class="s-text-field  {klass}" {prependOuter} {appendOuter} {color} {dense} {readonly} {disabled} {error} {success} {style}>
	<div
		class="s-text-field__wrapper"
		class:filled
		class:line={underline}
		class:solo
		class:outlined
		class:flat
		class:rounded
		class:autogrow
		class:no-resize={noResize || autogrow}
	>
		<!-- Slot for prepend inside the input. -->
		{#if prepend}
			<div class="s-prepend">
				{@render prepend()}
			</div>
		 {/if}

		<div class="s-text-field__input">
			<label for={id} class:active={labelActive}>
				{@render children?.()}
			</label>
			<textarea
				aria-invalid={error}
				bind:this={textarea}
				bind:value
				{rows}
				{placeholder}
				{id}
				{readonly}
				{disabled}
				onfocus={handlers(onFocus, bubble('focus'))}
				onblur={handlers(onBlur, bubble('blur'))}
				oninput={handlers(onInput, bubble('input'))}
				onchange={bubble('change')}
				{...rest}
			></textarea>
		</div>

		{#if clearable && value !== ''}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div onclick={clear} style="cursor:pointer">
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
				<span>{hint}</span>
				{#each messages ?? [] as message}<span>{message}</span>{/each}
				{#each errorMessages.slice(0, errorCount) as message}<span>{message}</span>{/each}
			</div>
			{#if counter}<span>{value.length} / {counter}</span>{/if}
		</div>
	{/snippet}
</Input>
