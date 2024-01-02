declare namespace svelteHTML {
	interface HTMLAttributes<T> {
		'on:clickOutside'?: (event: CustomEvent<void> & { target: EventTarget & T }) => void;
		'on:intersect'?: (event: CustomEvent<IntersectionObserverEntry>) => void;
	}
}
