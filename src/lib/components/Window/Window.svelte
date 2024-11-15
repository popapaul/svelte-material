<script module>
	export const WINDOW = {};
</script>

<script>
	import { run } from 'svelte/legacy';

	import { onMount, setContext } from 'svelte';
	import './Window.scss';
	
	/** @type {{class?: string, activeClass?: string, value?: number, vertical?: boolean, reverse?: boolean, continuous?: boolean, children?: import('svelte').Snippet}} */
	let {
		class: klass = '',
		activeClass = 'active',
		value = $bindable(0),
		vertical = false,
		reverse = false,
		continuous = true,
		children
	} = $props();

	let container = $state();
	const windowItems = [];
	let moving = false;

	setContext(WINDOW, (window) => {
		windowItems.push(window);
	});

	export function set(index) {
		const prevIndex = windowItems.findIndex((i) => i.classList.contains(activeClass));
		if (!moving && windowItems[index] && index !== prevIndex) {
			moving = true;

			let direction;
			let position;
			if (index > prevIndex) {
				direction = 'left';
				position = 'next';
			} else {
				direction = 'right';
				position = 'prev';
			}

			const prev = windowItems[prevIndex];
			prev.classList.add(direction);

			container.style.height = `${prev.scrollHeight}px`;

			const active = windowItems[index];
			active.classList.add(position);

			container.style.height = `${active.scrollHeight}px`;

			active.classList.add(direction);

			setTimeout(() => {
				prev.classList.remove('active', direction);

				active.classList.add('active');
				active.classList.remove(position, direction);

				container.style.height = null;
				moving = false;
				value = index;
			}, 300);
		}
	}

	run(() => {
		set(value);
	});

	export function next() {
		if (value === windowItems.length - 1) {
			if (continuous) set(0);
		} else {
			set(value + 1);
		}
	}

	export function previous() {
		if (value === 0) {
			if (continuous) set(windowItems.length - 1);
		} else {
			set(value - 1);
		}
	}

	onMount(() => {
		const activeItem = windowItems[value];
		if (activeItem) activeItem.classList.add(activeClass);
	});
</script>

<div
	bind:this={container}
	class="s-window {klass}"
	class:horizontal={!vertical}
	class:vertical
	class:reverse
>
	{@render children?.()}
</div>
