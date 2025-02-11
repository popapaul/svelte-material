<script lang="ts">
	import { format } from '../../internal/Style';
	import './Icon.scss';
	import type { HTMLAttributes } from 'svelte/elements';
	
	
	interface Props extends HTMLAttributes<HTMLElement> {
		/** classes added to the icon */
		class?: string;
		/** size of the icon */
		size?: string | number;
		/** degress by which to rotate the icon */
		rotate?: number;
		/** makes the icon spin */
		spin?: boolean;
		/** disables the icon */
		disabled?: boolean;
		/** svg path for the icon */
		path?: string;
		/** label for the icon */
		label?: string;
		/** styles added to the icon */
		style?: string;
	}

	let {
		class: klass = '',
		size = '24px',
		rotate = 0,
		spin = false,
		disabled = false,
		path ,
		label = null,
		style = null,
		...rest
	}: Props = $props();
</script>

<i	
	{...rest}
	aria-hidden="true"
	class="s-icon {klass}"
	class:spin
	aria-label={label}
	class:disabled
	style="--s-icon-size:{format(size)};--s-icon-rotate:{rotate}deg; {style}"
	aria-disabled={disabled}>{@html path}</i
>
