<script lang="ts">
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

	let klass = '';
	/** Classes to add to text field wrapper. */
	export { klass as class };
	/** Value of the textarea. */
	export let value: string = '';
	/** Color class of the textarea when active. */
	export let color = 'primary';
	/** Whether textarea is the `filled` material design variant. */
	export let filled = false;
	/** Whether textarea is outlined by elevation. */
	export let solo = false;
	/** Whether textarea is the `outlined` material design variant. */
	export let outlined = false;
	/** Whether textarea do not have elevation. */
	export let flat = false;
	/** Whether textarea has rounded corners. */
	export let rounded = false;
	/** Whether textarea has a clear button. */
	export let clearable = false;
	/** Whether textarea is read-only. */
	export let readonly = false;
	/** Number of initial textarea lines. Defaults to 5. */
	export let rows = 1;
	/** Whether textarea is allowed to grow with the text. */
	export let autogrow = false;
	/** Whether textarea is not allowed to grow with the text. */
	export let noResize = false;
	/** Whether textarea is disabled. */
	export let disabled = false;
	/** Placeholder content for textarea. */
	export let placeholder = null;
	/** Hint text. */
	export let hint = '';
	/** Display a counter set to a desired input length. */
	export let counter = false;
	/**
	 * A list of validator functions that take the textarea value and return an error
	 * message, or `true` otherwise.
	 */
	export let rules: ((value: string | number | string[]) => string | true)[] = [];
	/** Number of error messages to display. Defaults to one. */
	export let errorCount = 1;
	/** Error messages to display. */
	export let messages = [];
	/** Whether to delay validation until blur. */
	export let validateOnBlur = false;
	/** Whether textarea has error. */
	export let error = false;
	/** Whether textarea wrapper has `success` class. */
	export let success = false;
	/** Id of the textarea. Defaults to a random uid. */
	export let id = `s-input-${uid(5)}`;
	/** Styles to add to textarea wrapper. */
	export let style = null;
	/** Reference to textarea element in the DOM. */
	export let textarea: HTMLTextAreaElement = null;
	export let underline = true;

	let labelActive = !!placeholder || !!value;
	let errorMessages = [];

	function checkRules() {
		errorMessages = rules.map((r) => r(value)).filter((r) => typeof r === 'string');
		if (errorMessages.length) error = true;
		else {
			error = false;
		}
	}

	function onFocus() {
		labelActive = true;
	}

	function onBlur() {
		if (!value && !placeholder) labelActive = false;
		if (validateOnBlur) checkRules();
	}

	function clear() {
		value = '';
		if (!placeholder) labelActive = false;
	}

	function handleHeight() {
		if (autogrow && textarea) {
			textarea.style.height = 'auto';
			textarea.style.height = `${textarea.scrollHeight}px`;
		}
	}
	onMount(handleHeight);

	$: value && handleHeight();

	function onInput() {
		if (!validateOnBlur) checkRules();
	}
</script>

<Input class="s-text-field {klass}" {color} {readonly} {disabled} {error} {success} {style}>
	<!-- Slot for prepend outside the input. -->
	<slot slot="prepend-outer" name="prepend-outer" />
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
		<slot name="prepend" />

		<div class="s-text-field__input">
			<label for={id} class:active={labelActive}>
				<slot />
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
				on:focus={onFocus}
				on:blur={onBlur}
				on:input={onInput}
				on:focus
				on:blur
				on:input
				on:change
				{...$$restProps}
			></textarea>
		</div>

		{#if clearable && value !== ''}
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div on:click={clear} on:keydown={clear} style="cursor:pointer">
				<!-- Slot for the icon when `clearable` is true. -->
				<slot name="clear-icon">
					<Icon path={clearIcon} />
				</slot>
			</div>
		{/if}

		<!-- Slot for append inside the input. -->
		<slot name="append" />
	</div>

	<div slot="messages">
		<div>
			<span>{hint}</span>
			{#each messages ?? [] as message}<span>{message}</span>{/each}
			{#each errorMessages.slice(0, errorCount) as message}<span>{message}</span>{/each}
		</div>
		{#if counter}<span>{value.length} / {counter}</span>{/if}
	</div>

	<!-- Slot for append outside the input. -->
	<slot slot="append-outer" name="append-outer" />
</Input>
