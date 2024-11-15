<script lang="ts">
	import { createBubbler, handlers } from 'svelte/legacy';

	const bubble = createBubbler();
	import { intersect, type IntersectOptions } from '../../actions/Intersect';
	let intersecting = $state(false);
	interface Props {
		options?: IntersectOptions;
		class?: string;
		children?: import('svelte').Snippet<[any]>;
		[key: string]: any
	}

	let { options = { once: true }, class: klass = '', children, ...rest }: Props = $props();
	/** Classes to add to wrapper. */
	
</script>

<div
	class={klass}
	{...rest}
	use:intersect={options}
	onintersect={handlers(bubble('intersect'), ({ detail: { isIntersecting } }) => (intersecting = isIntersecting))}
>
	{@render children?.({ intersecting, })}
</div>
