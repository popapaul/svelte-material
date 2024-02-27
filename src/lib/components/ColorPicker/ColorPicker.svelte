<script lang="ts">
	import './ColorPicker.scss';
	import { createEventDispatcher } from 'svelte';
	import RangeSlider from '../RangeSlider/RangeSlider.svelte';
	import TextField from '../TextField/TextField.svelte';
	import { clickOutside } from '../../actions/ClickOutside';
	import Swatches from './Swatches.svelte';

	export let value: string = '#FF0000';

	export let colors: string[] = [];

	const dispatch = createEventDispatcher();
	let tracked;
	let h = 1;
	let s = 1;
	let v = 1;
	let a = 1;
	let r = 255;
	let g = 0;
	let b = 0;
	let top: string = '5px';
	let left: string = '5px';

	let hexValue;
	function setStartColor(value) {
		value ??= '#FF0000';
		let hex = value.replace('#', '');
		if (hex.length !== 6 && hex.length !== 3 && !hex.match(/([^A-F0-9])/gi)) {
			hex = 'FF0000';
		}
		let hexFiltered = '';
		if (hex.length === 3)
			hex.split('').forEach((c) => {
				hexFiltered += c + c;
			});
		else hexFiltered = hex;
		hexValue = hexFiltered;
		r = parseInt(hexFiltered.substring(0, 2), 16);
		g = parseInt(hexFiltered.substring(2, 4), 16);
		b = parseInt(hexFiltered.substring(4, 6), 16);
		rgbToHSV(r, g, b);
		hexValue = RGBAToHex();
		updateCsPicker();
	}

	function updateCsPicker() {
		let xPercentage = s * 100;
		let yPercentage = (1 - v) * 100;
		top = yPercentage + '%';
		left = xPercentage + '%';
	}

	function colorChangeCallback() {
		dispatch('change', {
			hex: hexValue,
			rgba: { r, g, b, a }
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
		xPercentage = ((mouseX - trackedPos.x) / 240) * 100;
		yPercentage = ((mouseY - trackedPos.y) / 160) * 100;
		xPercentage > 100 ? (xPercentage = 100) : xPercentage < 0 ? (xPercentage = 0) : null;
		yPercentage > 100 ? (yPercentage = 100) : yPercentage < 0 ? (yPercentage = 0) : null;
		yPercentage = yPercentage.toFixed(2);
		xPercentage = xPercentage.toFixed(2);
		top = yPercentage + '%';
		left = xPercentage + '%';
		s = xPercentage / 100;
		v = 1 - yPercentage / 100;
		colorChange();
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
		s = xPercentage / 100;
		v = 1 - yPercentage / 100;
		colorChange();
	}

	const handleHueChange = (value) => {
		h = value / 100;
		colorChange();
		rgbToHSV;
	};

	const handleRGBchange = () => {
		r = Math.max(Math.min(r, 255), 0);
		g = Math.max(Math.min(g, 255), 0);
		b = Math.max(Math.min(b, 255), 0);
		({ h, s, v } = rgbToHSV(r, g, b));
		colorChange();
	};

	function colorChange() {
		[r, g, b] = hsvToRgb(h, s, v);

		hexValue = RGBAToHex();
		value = hexValue;
		colorChangeCallback();
	}

	//Math algorithms
	function hsvToRgb(h, s, v) {
		var r, g, b;
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
		return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	}
	function RGBAToHex() {
		let rHex = r.toString(16);
		let gHex = g.toString(16);
		let bHex = b.toString(16);
		if (rHex.length == 1) rHex = '0' + rHex;
		if (gHex.length == 1) gHex = '0' + gHex;
		if (bHex.length == 1) bHex = '0' + bHex;
		return ('#' + rHex + gHex + bHex).toUpperCase();
	}
	function rgbToHSV(r, g, b) {
		let rperc, gperc, bperc, max, min, diff, pr, hnew, snew, vnew;
		rperc = r / 255;
		gperc = g / 255;
		bperc = b / 255;
		max = Math.max(rperc, gperc, bperc);
		min = Math.min(rperc, gperc, bperc);
		diff = max - min;
		vnew = max;
		vnew == 0 ? (snew = 0) : (snew = diff / max);
		for (let i = 0; i < 3; i++) {
			if ([rperc, gperc, bperc][i] === max) {
				pr = i;
				break;
			}
		}
		if (diff == 0) {
			hnew = 0;

			h = hnew;
			s = snew;
			v = vnew;

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

		h = hnew;
		s = snew;
		v = vnew;

		return { h: hnew, s: snew, v: vnew };
	}

	const changeHex = (color: string = null) => {
		value = color ? color : RGBAToHex();
		colorChangeCallback();
	};
	$: setStartColor(value);
</script>

<svelte:window
	on:touchmove|passive={handleMove}
	on:mousemove|passive={handleMove}
	on:touchend={() => (tracked = null)}
	on:mouseup={() => (tracked = null)}
/>

<div class="main-container">
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="colorsquare size" style="background-color:rgba({hsvToRgb(h, 1, 1).join(',')});">
		<div class="saturation-gradient">
			<div class="value-gradient">
				<div id="colorsquare-picker" style="top:{top};left:{left};" />
				<div
					id="colorsquare-event"
					use:clickOutside
					on:clickOutside={() => (tracked = null)}
					on:mousedown={handleDown}
					on:touchstart={handleDown}
				></div>
			</div>
		</div>
	</div>
	<div style="margin:0 10px;">
		<RangeSlider
			values={[h * 100]}
			on:change={(event) => handleHueChange(event.detail.value)}
			--range-slider="linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)"
		/>

		<!-- <RangeSlider 
          values={[a*100]}
          on:change={event=>handleAlphaChange(event.detail.value)}
          --range-slider="linear-gradient(to right, rgba(0, 0, 0, 0), rgb(0, 0, 0))"  /> -->
	</div>
	<div class="color-info-box">
		<div class="color-picked-bg">
			<div class="color-picked" style="background-color:rgb({r},{g},{b})"></div>
		</div>

		<TextField
			dense
			{value}
			on:input={(event) => changeHex(event.target.value)}
			style="width:100px;"
		/>

		<TextField dense bind:value={r} type="number" style="width:50px;" on:input={handleRGBchange}
			>red</TextField
		>

		<TextField dense bind:value={g} type="number" style="width:50px;" on:input={handleRGBchange}
			>green</TextField
		>

		<TextField dense bind:value={b} type="number" style="width:50px;" on:input={handleRGBchange}
			>blue</TextField
		>
	</div>
	<div>
		<Swatches bind:color={value} bind:colors on:select={({ detail }) => changeHex(detail)} />
	</div>
</div>
