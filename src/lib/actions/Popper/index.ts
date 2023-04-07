import { createPopper, type NanoPopOptions, type NanoPop } from './popper';

export type {NanoPopPosition} from './popper';
export type PopperOptions =| Partial<NanoPopOptions> | undefined;

export type ReferenceAction = (node: HTMLElement) => {
	destroy?(): void;
};

export type ContentAction = (
	node: HTMLElement,
	popperOptions?: PopperOptions
) => {
	update(popperOptions: PopperOptions): void;
	destroy(): void;
};

export function createPopperActions(initOptions?: PopperOptions): [ReferenceAction, ContentAction, () => NanoPop | null] {
	let popperInstance: NanoPop | null = null;
	let referenceNode:  HTMLElement | undefined;
	let contentNode: HTMLElement | undefined;
	let options: PopperOptions | undefined = initOptions;

	const initPopper = () => {
		if (referenceNode !== undefined && contentNode !== undefined) {
			popperInstance = createPopper(referenceNode, contentNode, options);
			popperInstance.update();
		}
	};

	const deinitPopper = () => {
		if (popperInstance !== null) {
			popperInstance.destroy();
			popperInstance = null;
		}
	};

	const referenceAction: ReferenceAction = (node) => {
			referenceNode = node;
			initPopper();
			return {
				destroy() {
					deinitPopper();
				},
			};
	};


	const contentAction: ContentAction = (node, contentOptions?) => {
		contentNode = node;
		options = { ...initOptions, ...contentOptions };
		initPopper();
		return {
			update(newContentOptions: PopperOptions) {
				options = { ...initOptions, ...newContentOptions };
				popperInstance?.update(options);
			},
			destroy() {
				deinitPopper();
			},
		};
	};

	return [referenceAction, contentAction, () => popperInstance];
}