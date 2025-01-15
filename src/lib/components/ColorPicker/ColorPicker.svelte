
<script lang="ts">
	import './ColorPicker.scss';
	import RangeSlider from '../RangeSlider/RangeSlider.svelte';
	import TextField from '../TextField/TextField.svelte';
	import { clickOutside } from '../../actions/ClickOutside';
	import Swatches from './Swatches.svelte';
	import { untrack } from 'svelte';

	type RGBA = { r:number, g:number, b:number, a:number };
	type HSV = { h:number, s:number, v:number }; 
	interface Props {
		value?: string;
		colors?: string[];
		rgba?: RGBA;
		hsv?: HSV
		onchange?:	(value:{hex:string, rgba: RGBA, hsv: HSV })=>  void
	}

	let { value = $bindable(), colors = $bindable(), rgba = $bindable(), hsv = $bindable(), onchange }: Props = $props();
	initColors();

	const internal = $derived({
		//rgba
		get r() { return rgba.r },
		set r(val) { 
			rgba.r = Math.max(Math.min(val, 255), 0);
			value = rgbaToHex(rgba);
			hsv = rgbToHSV(rgba);
		},
		get g() { return rgba.g },
		set g(val) { 
			rgba.g = Math.max(Math.min(val, 255), 0);
			value = rgbaToHex(rgba);
			hsv = rgbToHSV(rgba);
		},
		get b() { return  rgba.b },
		set b(val) { 
			rgba.b = Math.max(Math.min(val, 255), 0);
			value = rgbaToHex(rgba);
			hsv = rgbToHSV(rgba);
		},
		get a() { return  rgba.a },
		set a(val) { 
			rgba.a = Math.max(Math.min(val, 255), 0);
			value = rgbaToHex(rgba);
			hsv = rgbToHSV(rgba);
		},

		//hex
		get hex() { return value },
		set hex(val){
			value = val;
			rgba = hexToRgba(value);
			hsv = rgbToHSV(rgba);
		},

		//hsv
		get h() { return  hsv.h },
		set h(val) { 
			hsv.h = val;
			rgba = {...rgba, ...hsvToRgb(hsv)};
			value = rgbaToHex(rgba);
		},
		get s() { return  hsv.s },
		set s(val) { 
			hsv.s = val;
			rgba = {...rgba, ...hsvToRgb(hsv)};
			value = rgbaToHex(rgba);
		},
		get v() { return  hsv.v },
		set v(val) { 
			hsv.v = val;
			rgba = {...rgba, ...hsvToRgb(hsv)};
			value = rgbaToHex(rgba);
		},
	});

	let tracked = $state<HTMLElement>();
	let top: string = $state('5px');
	let left: string = $state('5px');

		

	function initColors() {
		if(value)
		{
			rgba = hexToRgba(value);
			hsv = rgbToHSV(rgba);
		}
		else if(rgba)
		{
			value = rgbaToHex(rgba);
			hsv = rgbToHSV(rgba);
		}
		else if(hsv)
		{
			rgba = { ...hsvToRgb(hsv), a: 255 };
			value = rgbaToHex(rgba);
		}
		else{
			rgba = {r:0,g:0,b:0,a:255};
			hsv = rgbToHSV(rgba);
		}
	}

	$effect(()=>{
		const xPercentage = internal.s * 100;
		const yPercentage = (1 - internal.v) * 100;
		untrack(()=>{
			top = yPercentage + '%';
			left = xPercentage + '%';
		})
	});

	function colorChangeCallback() {
		onchange?.({
			hex: value,
			rgba: rgba,
			hsv
		});
	}

	function handleMove(event) {
		if (!tracked) return;
		let [mouseX, mouseY] =
			event.type == 'mousemove'
				? [event.clientX, event.clientY]
				: [event.touches[0].clientX, event.touches[0].clientY];
		let trackedPos = tracked.getBoundingClientRect();
	
		let xPercentage, yPercentage;
		xPercentage = ((mouseX - trackedPos.x) / trackedPos.width) * 100;
		yPercentage = ((mouseY - trackedPos.y) / trackedPos.height) * 100;
		xPercentage > 100 ? (xPercentage = 100) : xPercentage < 0 ? (xPercentage = 0) : null;
		yPercentage > 100 ? (yPercentage = 100) : yPercentage < 0 ? (yPercentage = 0) : null;
		yPercentage = yPercentage.toFixed(2);
		xPercentage = xPercentage.toFixed(2);
		top = yPercentage + '%';
		left = xPercentage + '%';
		internal.s = xPercentage / 100;
		internal.v = 1 - yPercentage / 100;
	}

	function handleDown(event) {
		tracked = event.currentTarget;

		let rect = event.target.getBoundingClientRect();
		const [offsetX, offsetY] =
			event.type == 'mousedown'
				? [event.offsetX, event.offsetY]
				: [event.targetTouches[0].clientX - rect.left, event.targetTouches[0].clientY - rect.top];

		let xPercentage = ((offsetX + 1) / rect.width) * 100;
		let yPercentage = ((offsetY + 1) / rect.height) * 100;

		top = yPercentage.toFixed(2) + '%';
		left = xPercentage.toFixed(2) + '%';
		internal.s = xPercentage / 100;
		internal.v = 1 - yPercentage / 100;
	}


	//Math algorithms
	function hsvToRgb({h, s, v}: HSV) {
		var r:number, g:number, b:number;
		var i = Math.floor(h * 6);
		var f = h * 6 - i;
		var p = v * (1 - s);
		var q = v * (1 - f * s);
		var t = v * (1 - (1 - f) * s);
		switch (i % 6) {
			case 0:
				(r = v), (g = t), (b = p);
				break;
			case 1:
				(r = q), (g = v), (b = p);
				break;
			case 2:
				(r = p), (g = v), (b = t);
				break;
			case 3:
				(r = p), (g = q), (b = v);
				break;
			case 4:
				(r = t), (g = p), (b = v);
				break;
			case 5:
				(r = v), (g = p), (b = q);
				break;
		}
		return { r:Math.round(r * 255), g:Math.round(g * 255), b:Math.round(b * 255) };
	}

	function rgbaToHex({r,g,b,a}: RGBA) {
			const rHex = r.toString(16).padStart(2,"0");
			const gHex = g.toString(16).padStart(2,"0");
			const bHex = b.toString(16).padStart(2,"0");
			const aHex = (a??255).toString(16).padStart(2,"0");
			return ('#' + rHex + gHex + bHex + aHex).toUpperCase();
	}
	function rgbToHSV({r,g,b}: RGBA) {
			let pr:number, hnew:number, snew:number;
			let rperc = r / 255;
			let gperc = g / 255;
			let bperc = b / 255;
			let max = Math.max(rperc, gperc, bperc);
			let min = Math.min(rperc, gperc, bperc);
			let diff = max - min;
			let vnew = max;
			vnew == 0 ? (snew = 0) : (snew = diff / max);


			for (let i = 0; i < 3; i++) {
				if ([rperc, gperc, bperc][i] === max) {
					pr = i;
					break;
				}
			}
			if (diff == 0) {
				hnew = 0;
				return { h: hnew, s: snew, v: vnew };
			} else {
				switch (pr) {
					case 0:
						hnew = (60 * (((gperc - bperc) / diff) % 6)) / 360;
						break;
					case 1:
						hnew = (60 * ((bperc - rperc) / diff + 2)) / 360;
						break;
					case 2:
						hnew = (60 * ((rperc - gperc) / diff + 4)) / 360;
						break;
				}
				if (hnew < 0) hnew += 6;
			}

			return { h: hnew, s: snew, v: vnew };
	}

	function hexToRgba(hex:string) {
		hex = hex.replace(/^#/, '');
		let r:number, g:number, b:number, a:number;
	
		r = parseInt(hex.slice(0, 2), 16);
		g = parseInt(hex.slice(2, 4), 16);
		b = parseInt(hex.slice(4, 6), 16);
		a = parseInt(hex.slice(6, 8), 16) / 255; // Convert alpha to a value between 0 and 1
	
		// Handle invalid hex format
		return { r, g, b, a };
	}
</script>

<svelte:window
	ontouchmove={handleMove}
	onmousemove={handleMove}
	ontouchend={() => (tracked = null)}
	onmouseup={() => (tracked = null)}
/>

<div class="main-container">
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="colorsquare" style="background-color:rgba({Object.values(hsvToRgb({ h:internal.h, s:1, v:1 })).join(',')});">
		<div class="saturation-gradient">
			<div class="value-gradient">
				<div id="colorsquare-picker" style="top:{top};left:{left};"></div>
				<div
					id="colorsquare-event"
					use:clickOutside
					onclickOutside={() => (tracked = null)}
					onmousedown={handleDown}
					ontouchstart={handleDown}
				></div>
			</div>
		</div>
	</div>
	<div style="margin:0 10px;">
		<RangeSlider
		
			values={[internal.h * 100]}
			onchange={(event) => internal.h = event.value / 100}
			--range-slider="linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)"
		/>

		<RangeSlider 
		  min={0}
		  max={255}
          values={[internal.a]}
          onchange={event=> internal.a = event.value}
          --range-slider="linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0))"  />
	</div>
	<div class="color-info-box">
		<TextField dense bind:value={internal.hex} onchange={colorChangeCallback} style="width:80px;">hex</TextField>

		<TextField dense bind:value={internal.r} onchange={colorChangeCallback} type="number" style="width:40px;">red</TextField>

		<TextField dense bind:value={internal.g} onchange={colorChangeCallback} type="number" style="width:40px;">green</TextField>

		<TextField dense bind:value={internal.b} onchange={colorChangeCallback} type="number" style="width:40px;">blue</TextField>
	</div>
	<Swatches bind:color={internal.hex} bind:colors onselect={colorChangeCallback} />
</div>
