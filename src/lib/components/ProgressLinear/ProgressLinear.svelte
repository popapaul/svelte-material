<script lang="ts">
	import BackgroundColor from '../../internal/BackgroundColor';
	import './ProgressLinear.scss';

	
	interface Props {
		class?: string;
		value?: number;
		active?: boolean;
		indeterminate?: boolean;
		height?: string;
		backgroundColor?: string;
		backgroundOpacity?: number;
		color?: any;
		buffer?: number;
		reversed?: boolean;
		stream?: boolean;
		rounded?: boolean;
		striped?: boolean;
		style?: string;
		children?: import('svelte').Snippet;
	}

	let {
		class: klass = '',
		value = 0,
		active = true,
		indeterminate = false,
		height = '4px',
		backgroundColor = 'primary',
		backgroundOpacity = 0.3,
		color = backgroundColor,
		buffer = 100,
		reversed = false,
		stream = true,
		rounded = false,
		striped = true,
		style = '',
		children
	}: Props = $props();
</script>

<div
	role="progressbar"
	aria-valuemin={0}
	aria-valuemax={100}
	aria-valuenow={value}
	class="s-progress-linear {klass}"
	class:inactive={!active}
	class:reversed
	class:rounded
	style="height:{height};{style}"
>
	<div
		use:BackgroundColor={backgroundColor}
		class="background"
		style="opacity:{backgroundOpacity};{reversed ? 'right' : 'left'}:{value}%;width:{buffer - value}%">
	</div>

	{#if indeterminate}
		<div use:BackgroundColor={color}>
			<div class="indeterminate long"></div>
			<div class="indeterminate short"></div>
		</div>
	{:else}
		<div use:BackgroundColor={color} class="determinate" class:striped style="width:{value}%" ></div>
	{/if}

	<div class="s-progress-linear__content">
		{@render children?.()}
	</div>

	{#if stream}
		<div class="stream {color}" style="width:{100 - buffer}%" ></div>
	{/if}
</div>
