<script lang="ts">
	import { MaterialApp, Select } from '$lib';
	import ColorField from '$lib/components/ColorField/ColorField.svelte';
	import DateField from '$lib/components/DateField/DateField.svelte';
	const items = [
		{ name: '1', value: 1 },
		{ name: '2', value: 2 },
		{ name: '3', value: 3 }
	];

	let value: string;
</script>

<h1>Welcome to your library project</h1>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<MaterialApp>
	<Select bind:value {items} />

	<DateField></DateField>
	<ColorField></ColorField>
</MaterialApp>
<!-- <style lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style> -->
