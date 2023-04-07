declare namespace svelte.JSX {
    interface HTMLAttributes<T> {
        onclickOutside?: (event: CustomEvent<void> & { target: EventTarget & T }) => any;
        onintersect?: (event: CustomEvent<IntersectionObserverEntry>) => any;
    }
}

