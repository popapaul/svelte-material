import { cubicOut } from 'svelte/easing';

interface SwipeOptions {
	delay?:number, 
	duration?:number, 
	easing?: any
}

export const swipe = (node,{ delay = 0, duration = 400, easing = cubicOut }:SwipeOptions) => {
	const style = getComputedStyle(node);
	const opacity = +style.opacity;
	const width = parseFloat(style.width);
	const paddingLeft = parseFloat(style.paddingTop);
	const paddingRight = parseFloat(style.paddingBottom);
	const marginLeft = parseFloat(style.marginTop);
	const marginRight = parseFloat(style.marginBottom);
	const borderLeftWidth = parseFloat(style.borderTopWidth);
	const borderRightWidth = parseFloat(style.borderBottomWidth);

	return {
		delay,
		duration,
		easing,
		css: t =>
			`overflow: hidden;` +
			`opacity: ${Math.min(t * 20, 1) * opacity};` +
			`width: ${t * width}px;` +
			`padding-left: ${t * paddingLeft}px;` +
			`padding-right: ${t * paddingRight}px;` +
			`margin-left: ${t * marginLeft}px;` +
			`margin-right: ${t * marginRight}px;` +
			`border-left-width: ${t * borderLeftWidth}px;` +
			`border-right-width: ${t * borderRightWidth}px;`
	};
}