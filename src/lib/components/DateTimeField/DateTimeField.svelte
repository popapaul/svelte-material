<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import TextField from '../TextField/TextField.svelte';
	import DateTimePicker from '../DateTimePicker/DateTimePicker.svelte';
	import Menu from '../Menu/Menu.svelte';

	let klass: string = '';
	export { klass as class };

	export let value: Date;
	export let locale: string = 'ro';
	export let hourOnly: boolean = false;
	export let mode: 'days' | 'month' | 'year' | 'hour' | 'minute' = 'days';
	export let weekStart: number = 1;
	export let onRender: (date: Date) => { disabled?: boolean; message?: string } = () => ({});
	export let noDateText: string = 'No Date';
	export let readonly = false;

	const dispatch = createEventDispatcher();
	let elm;
	let active = false;

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
		let inputs = elm.querySelectorAll('input');
		inputs[0] && inputs[0].focus();
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
	<TextField
		slot="activator"
		value={format(value)}
		{...$$restProps}
		on:keydown={onkeydown}
		on:click={onfocus}
		on:change
		on:clear={() => (value = null)}
		on:blur
		readonly
	>
		<slot />
		<slot slot="append" name="append" />
		<slot slot="prepend-outer" name="prepend-outer" />
		<slot slot="append-outer" name="append-outer" />
		<slot slot="prepend" name="prepend" />
	</TextField>
	<DateTimePicker
		{...$$restProps}
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
