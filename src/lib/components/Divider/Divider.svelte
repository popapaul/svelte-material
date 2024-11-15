<script lang="ts">
	import './Divider.scss';
	/** classes added to the divider */
	
	
	
	
	interface Props {
		class?: string;
		/** inset moves divider 72px to the right */
		inset?: boolean;
		/** vertical makes divider to a vertical divider */
		vertical?: boolean;
		/** styles added to the divider */
		style?: string;
	}

	let {
		class: klass = '',
		inset = false,
		vertical = false,
		style = null
	}: Props = $props();
</script>

<hr
	class="s-divider {klass}"
	aria-orientation={vertical ? 'vertical' : 'horizontal'}
	class:inset
	class:vertical
	{style}
/>
