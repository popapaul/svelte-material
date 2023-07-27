<script context="module" lang="ts">
	export const FORM_FIELDS = {};

    type Field = {
        id?: string; 
        validate: () => string[];
    }

    type Error = {
        id:string;
        errors:string[];
    }

	export interface FormContext {
		register: (x:Field) => Field;
	}
</script>

<script lang="ts">
	import { onDestroy, setContext } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	let klass = '';
	export { klass as class };
	export let style = null;

	interface $$Events {
		submit: CustomEvent;
		error: CustomEvent<Error[]>;
	
    }

	const dispatch = createEventDispatcher();
	const formFields: Set<Field> = new Set();

	setContext<FormContext>(FORM_FIELDS, {
		register: (field:Field) => {
			formFields.add(field);
			onDestroy(() => formFields.delete(field));
			return field;
		},
	});

	const onSubmit = () => {
		const errorFields = validate();

		if (errorFields.length) 
        {
            const field = errorFields[0];
            const input = document.querySelector("#" + field.id);
            input?.scrollIntoView?.({ behavior: 'smooth', block: 'center', inline: 'nearest' });
            return dispatch('error', errorFields);
        }

        dispatch('submit');
	};

	export function validate() {
		const errorFields = Array.from(formFields)
			.map(({id,validate}) => ({  errors: validate(), id }))
			.filter((x) => x.errors.length);
		if (errorFields.length) 
            return errorFields;
		return [];
	}
</script>

<form on:submit|preventDefault={onSubmit} class={klass} {style}>
	<slot />
</form>
