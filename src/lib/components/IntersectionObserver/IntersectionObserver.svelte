<script lang="ts">
	import { intersect, type IntersectOptions } from '../../actions/Intersect';
	let intersecting = $state(false);
	interface Props {
		options?: IntersectOptions;
		/** Classes to add to wrapper. */
		class?: string;
		children?: import('svelte').Snippet<[{intersecting:boolean}]>;
		onintersect?:(event:IntersectionObserverEntry)=>void;
	}

	let { options = { once: true }, children, onintersect, ...rest }: Props = $props();
	
	const handleIntersecting=({detail}:CustomEvent<IntersectionObserverEntry>)=>{
		intersecting = detail.isIntersecting;
		onintersect?.(detail);
	}
</script>

<div
	{...rest}
	use:intersect={options}
	onintersect={handleIntersecting}
>
	{@render children?.({ intersecting, })}
</div>
