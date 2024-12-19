<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import TextField from '../TextField/TextField.svelte';
	import DateTimePicker from '../DateTimePicker/DateTimePicker.svelte';
	import Menu from '../Menu/Menu.svelte';

	

	interface Props {
		class?: string;
		value: Date;
		locale?: string;
		hourOnly?: boolean;
		mode?: 'days' | 'month' | 'year' | 'hour' | 'minute';
		weekStart?: number;
		onRender?: (date: Date) => { disabled?: boolean; message?: string };
		noDateText?: string;
		readonly?: boolean;
		children?: import('svelte').Snippet;
	}

	let {
		class: klass = '',
		value = $bindable(),
		locale = 'ro',
		hourOnly = false,
		mode = 'days',
		weekStart = 1,
		onRender = () => ({}),
		noDateText = 'No Date',
		readonly = false,
		children,
		...rest
	}: Props = $props();

	const dispatch = createEventDispatcher();
	let elm;
	let active = $state(false);

	function open() {
		active = true;
	}

	function onselect({ detail }) {
		value = detail;
		dispatch('change', value);
	}

	const close = () => {
		focusInputElm();
		active = false;
	};

	function onfocus(e) {
		open();
		dispatch('focus', e);
	}

	function onkeydown(e) {
		if (/*e.keyCode === 13 || */ e.keyCode === 32) {
			e.stopPropagation();
			e.preventDefault();
			open();
		}
	}
	function focusInputElm() {
		if (readonly) return;
		//let inputs = elm.querySelectorAll('input');
		//inputs[0] && inputs[0].focus();
	}

	const format = (date: Date) => {
		if (!date) return '';
		return new Intl.DateTimeFormat(locale, {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			weekday: 'long',
			hour: '2-digit',
			minute: '2-digit'
		}).format(value);
	};
</script>

<Menu closeOnClick={false} bind:active placement="bottom-start" class={klass}>
	{#snippet activator()}
		<TextField
			value={format(value)}
			{...rest}
			on:keydown={onkeydown}
			on:click={onfocus}
			on:change
			on:clear={() => (value = null)}
			on:blur
			readonly
		>
			{@render children?.()}
		</TextField>
	{/snippet}
	<DateTimePicker
		{...rest}
		{mode}
		{hourOnly}
		{weekStart}
		{onRender}
		{noDateText}
		{locale}
		{value}
		on:change={onselect}
		on:close={close}
	/>
</Menu>
