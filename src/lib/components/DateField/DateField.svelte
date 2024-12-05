<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import TextField from '../TextField/TextField.svelte';
	import DatePicker from '../DatePicker/DatePicker.svelte';
	import Menu from '../Menu/Menu.svelte';

	type $$Events = {
		change: CustomEvent<Date>;
		focus: CustomEvent<any>;
	};

	interface Props {
		value?: Date;
		locale?: string;
		readonly?: boolean;
		weekStart?: number;
		onRender?: (date: Date) => { disabled?: boolean; message?: string };
		noDateText?: string;
		children?: import('svelte').Snippet;
	}

	let {
		value = $bindable(),
		locale = 'ro',
		readonly = false,
		weekStart = 1,
		onRender = () => ({}),
		noDateText = 'No Date',
		children,
		...rest
	}: Props = $props();

	const dispatch = createEventDispatcher();
	let elm = $state();
	let active = $state(false);

	function open() {
		active = true;
	}

	function handleChange({ detail }: CustomEvent<Date>) {
		value = detail;
		close();
	}

	const close = () => {
		focusInputElm();
		active = false;
	};

	function onfocus(e) {
		e.preventDefault();
		e.stopPropagation();
		open();
		dispatch('focus', e);
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.keyCode === 13 || e.keyCode === 32) {
			e.stopPropagation();
			e.preventDefault();
			open();
		}
	}
	function focusInputElm() {
		if (readonly) return;
		let inputs = elm.querySelectorAll('input');
		inputs[0] && inputs[0].focus();
	}
</script>

<Menu closeOnClick={false} bind:active placement="bottom-start">
	{#snippet activator()}
		<TextField
			value={value instanceof Date && !isNaN(value.getTime())
				? new Intl.DateTimeFormat(locale, {
						month: 'short',
						day: 'numeric',
						year: 'numeric',
						weekday: 'long'
				  }).format(value)
				: ''}
			{...rest}
			on:keydown={onkeydown}
			on:clear={() => (value = null)}
			on:blur
			readonly
			bind:inputElement={elm}
		>
			{@render children?.()}
		</TextField>
	{/snippet}
	<DatePicker
		on:change
		on:change={handleChange}
		{weekStart}
		{onRender}
		{noDateText}
		{locale}
		bind:value
	/>
</Menu>
