
<script lang="ts">
	import TextColor from '../../internal/TextColor';
	import './Input.scss';

	/** classes added to the input */

	interface Props {
		class?: string;
		/** color of the input */
		color?: any;
		/** makes the input dense */
		dense?: boolean;
		/** makes the input readonly */
		readonly?: boolean;
		/** disables the input */
		disabled?: boolean;
		error?: boolean;
		success?: boolean;
		style?: string;
		children?: import('svelte').Snippet;
		prependOuter?: import('svelte').Snippet;
		appendOuter?: import('svelte').Snippet;
		messages?: import('svelte').Snippet;
	}

	let {
		class: klass = '',
		color = null,
		dense = false,
		readonly = false,
		disabled = false,
		error = false,
		success = false,
		style = null,
		children,
		prependOuter,
		appendOuter,
		messages
	}: Props = $props();
</script>

<div
	class="s-input {klass}"
	class:dense
	class:error
	class:success
	class:readonly
	class:disabled
	{style}
	use:TextColor={error ? 'error' : color}
>
	{@render prependOuter?.()}
	<div class="s-input__control">
		<div class="s-input__slot">
			{@render children?.()}
		</div>
		<div class="s-input__details">
			<!-- {@render messages?.()} -->
		</div>
	</div>
	{@render appendOuter?.()}
</div>
