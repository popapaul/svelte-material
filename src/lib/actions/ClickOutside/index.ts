import { ClickOutsideParameter } from "./public";

/**
 * Dispatch a `clickOutside` {@link https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent | CustomEvent } on click outside of node
 * @example
 * Typical usage to close a modal / overlay when backdrop is clicked on
 *
 * ```html
 * <script lang="ts">
 *  import { clickOutside } from '@svelte-put/clickOutside';
 *
 *  let containerNode: Element;
 *  let modal = false;
 *
 *  function onClickOutside(event: CustomEvent<MouseEvent>) {
 *    console.log('Forwarded event:', event);
 *    modal = false;
 *  }
 * </script>
 *
 * <section class="relative" bind:this={containerNode}>
 *  <button
 *    type="button"
 *    class="mt-10 bg-primary p-6 drop-shadow-lg hover:bg-orange-700"
 *    onclick={() => (modal = true)}
 *  >
 *      Click to open modal
 *    </button>
 *  {#if modal}
 *    <aside
 *      class="absolute top-0 left-0 right-0 bottom-0"
 *      use:clickOutside={{ limit: { parent: containerNode }}}
 *      onclickOutside={onClickOutside}
 *    >
 *      ...some modal content...
 *    </aside>
 *  {/if}
 * </section
 * ```
 *
 *
 * As with any svelte action, `clickOutside` should be use with element and not component.
 *
 * ```html
 * <-- correct usage-->
 *  <div use:clickOutside />
 *
 * <-- incorrect usage-->
 * <Component use:clickOutside/>
 * ```
 * @param {Element} node - node outside of which `click` event will trigger `clickOutside`
 * @param {import('./public').ClickOutsideParameter} param - instructions for `clickOutside` behavior
 * @returns {import('./public').ClickOutsideActionReturn}
 */
export function clickOutside(node: Element, param: ClickOutsideParameter = { enabled: true }) {
	let { enabled, eventType, include, nodeForEvent, options, capture } = resolveConfig(param);


	function handle(event: Event & {target: HTMLElement}) {
		if (!event.target || !node) return;

		if(node.contains((event.target as any)))
			return;
		
		if(include.some(element=>{
			return typeof element === "string" ? event.target.closest(element) : element.contains(event.target)
		}))
			return;
	
	
		node.dispatchEvent(new CustomEvent('clickOutside', { detail: event }));
	}

	if (param.enabled !== false) {
		setTimeout(() => nodeForEvent.addEventListener(eventType, handle, ), 1);
	}

	return {
		update(update) {
			nodeForEvent.removeEventListener(eventType, handle, capture);
			({ enabled, eventType, nodeForEvent, options, capture } = resolveConfig(update));
			if (enabled) nodeForEvent.addEventListener(eventType, handle, options);
		},
		destroy() {
			nodeForEvent.removeEventListener(eventType, handle, capture);
		},
	};
}


export function resolveConfig(param: ClickOutsideParameter = {}) {
	return {
		enabled: param.enabled ?? true,
		nodeForEvent: param.limit?.parent ?? document,
		include: (Array.isArray(param.include) ? param.include : [param.include]).filter(Boolean),
		eventType: param.event ?? 'click',
		options: param.options,
		capture: typeof param.options === 'object' ? param.options?.capture : param.options,
	};
}
