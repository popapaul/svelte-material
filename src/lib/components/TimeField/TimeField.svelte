<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import TextField from '../TextField/TextField.svelte';
	import { isDate } from '../../internal/Date/date';
	import TimePicker from '../TimePicker/TimePicker.svelte';
	import Menu from '../Menu/Menu.svelte';

	
	interface Props {
		class?: string;
		hourOnly?: boolean;
		value: Date;
		locale?: string;
		readonly?: boolean;
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let {
		class: klass = '',
		hourOnly = false,
		value = $bindable(),
		locale = 'ro',
		readonly = false,
		children,
		...rest
	}: Props = $props();

	if (!isDate(value)) value = new Date();

	const dispatch = createEventDispatcher();
	let elm = $state();
	let active = $state(false);

	function open() {
		active = true;
	}

	function handleHour({ detail }: CustomEvent<Date>) {
		value = detail;
		dispatch('change', value);
		if (hourOnly) close();
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
</script>

<Menu closeOnClick={false} {...rest} bind:active placement="bottom-start">
	{#snippet activator()}
		<TextField
			value={value && new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(value)}
			{...rest}
			class={klass}
			on:keydown={onkeydown}
			on:click={onfocus}
			on:change
			on:clear={() => (value = null)}
			on:blur
			bind:inputElement={elm}
			readonly
		>
			{@render children?.()}
			<!-- <slot slot="append" name="append" />
			<slot slot="prependOuter" name="prependOuter" />
			<slot slot="appendOuter" name="appendOuter" />
			<slot slot="prepend" name="prepend" /> -->
		</TextField>
	{/snippet}
	<TimePicker {hourOnly} on:hour={handleHour} {...rest} bind:value />
</Menu>
