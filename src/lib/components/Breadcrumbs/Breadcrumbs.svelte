<script lang="ts">
	import './Breadcrumbs.scss';
	interface Breadcrumb {
		disabled?: boolean;
		href?: string;
		text: string;
		class?: string;
		props?: object;
	}

	/** classes added to the component */
	
	
	
	
	interface Props {
		class?: string;
		/** makes the breadcrumb large */
		large?: boolean;
		/** array of objects for each breadcrumb */
		items?: Breadcrumb[];
		/** styles to add to the breadcrumb */
		style?: any;
		divider?: import('svelte').Snippet;
		children?: import('svelte').Snippet<[any]>;
	}

	let {
		class: klass = '',
		large = false,
		items = $bindable([]),
		style = null,
		divider,
		children
	}: Props = $props();

	const defaults: Breadcrumb = {
		disabled: false,
		href: '',
		text: '',
		class: '',
		props: {}
	};

	items = items.map((x) => ({ ...defaults, ...x }));
</script>

<ul class="s-breadcrumbs {klass}" class:large {style}>
	{#each items as item, i}
		{#if i !== 0}
			<li class="divider">
				<!-- The slot used for divider -->
				{#if divider}{@render divider()}{:else}/{/if}
			</li>
		{/if}
		<li>
			{#if children}{@render children({ item, })}{:else}
				<svelte:element
					this={item.href ? 'a' : 'span'}
					href={item.href}
					class="s-breadcrumb-item {item.class}"
					class:disabled={item.disabled}
					{...item.props}
				>
					{item.text}
				</svelte:element>
			{/if}
		</li>
	{/each}
</ul>
