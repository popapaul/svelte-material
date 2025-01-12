<script module lang="ts">
	export const FORM_FIELDS = {};

	type Field = {
		id?: string;
		validate: () => string[];
	};

	type Error = {
		id: string;
		errors: string[];
	};

	export interface FormContext {
		register: (x: Field) => Field;
	}
</script>

<script lang="ts">
	import { onDestroy, setContext } from 'svelte';

	interface Props {
		class?: string;
		style?: any;
		onsubmit?:()=>void;
		onerror?:(errors: Error[])=>void;
		children?: import('svelte').Snippet;
	}

	let { class: klass = '', style = null, onsubmit, onerror, children }: Props = $props();


	const formFields: Set<Field> = new Set();

	setContext<FormContext>(FORM_FIELDS, {
		register: (field: Field) => {
			formFields.add(field);
			onDestroy(() => formFields.delete(field));
			return field;
		}
	});

	const onSubmit = (event:SubmitEvent) => {
		event.preventDefault();
		const errorFields = validate();

		if (errorFields.length) {
			const field = errorFields[0];
			const input = document.querySelector('#' + field.id);
			input?.scrollIntoView?.({ behavior: 'smooth', block: 'center', inline: 'nearest' });
			onerror?.(errorFields);
			return;
		}
		onsubmit?.();
	};

	export function validate() {
		const errorFields = Array.from(formFields)
			.map(({ id, validate }) => ({ errors: validate(), id }))
			.filter((x) => x.errors.length);
		if (errorFields.length) return errorFields;
		return [];
	}
</script>

<form onsubmit={onSubmit} class={klass} {style}>
	{@render children?.()}
</form>
