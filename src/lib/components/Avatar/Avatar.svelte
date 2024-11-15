<script lang="ts">
	import './Avatar.scss';
	import { format } from '../../internal/Style';
	/** classes to add to avatar */
	
	
	
	
	interface Props {
		class?: string;
		/** height and width of the avatar. */
		size?: string | number;
		/** removes border radius */
		tile?: boolean;
		/** styles applied to the avatar */
		style?: string;
		children?: import('svelte').Snippet;
	}

	let {
		class: klass = '',
		size = 48,
		tile = false,
		style = '',
		children
	}: Props = $props();
</script>

<div class="s-avatar {klass}" class:tile style="--s-avatar-size:{format(size)};{style}">
	{@render children?.()}
</div>
