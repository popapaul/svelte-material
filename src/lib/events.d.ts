declare namespace svelteHTML {
	interface HTMLAttributes<T> {
		'onclickOutside'?: (event: CustomEvent<void> & { target: EventTarget & T }) => void;
		'onintersect'?: (event: CustomEvent<IntersectionObserverEntry>) => void;
	}
}
