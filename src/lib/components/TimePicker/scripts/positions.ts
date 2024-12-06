interface Postion {
	x: number;
	y: number;
}
/* Copyright (c) 2020-2022 Jacques Desodt */
/* Converts and (x, y) position to degrees */
const convertToDegrees = (position: Postion) => {
	/* Computes the degrees */
	const rad = Math.atan2(position.y, position.x);
	let deg = rad * (180 / Math.PI);
	/* Computes the offset */
	deg = position.y < 0 ? 0 - deg : 360 - deg;
	return deg; // 0 to 360
};
/* Gets the new date computed with the hours position.
 (0, 0) = center, 0deg = 3h */
const getDateFromHoursPosition = (
	date: Date,
	position: Postion,
	width: number,
	is24h: boolean,
	isAm: boolean
) => {
	/* Retrieves the hour */
	let hour = getHourFromPosition(position, width, is24h);
	if (!is24h) {
		if (isAm && hour >= 12) {
			hour = hour - 12;
		}
		if (!isAm && hour < 12) {
			hour = hour + 12;
		}
	}
	date.setHours(hour);
	return new Date(date);
};
/* Gets the new date computed with the minutes position.
 (0, 0) = center, 0deg = 15m */
const getDateFromMinutesPosition = (
	date: Date,
	position: Postion,
	minutesIncrement: string | number
) => {
	/* Retrieves the minute */
	const minute = getMinuteFromPosition(position, minutesIncrement);
	date.setMinutes(minute);
	return date;
};
/* Gets the hour from the position */
const getHourFromPosition = (position: Postion, width: number, is24h: boolean) => {
	/* Computes the degrees */
	const degrees = convertToDegrees(position);
	/* Computes the hour */
	let hour = Math.round(degrees / 30) + 3;
	hour = hour > 12 ? hour - 12 : hour;
	/* Adds the AM/PM offset */
	if (is24h) {
		const absX = Math.abs(position.x);
		const absY = Math.abs(position.y);
		const hypotenuse = Math.sqrt(absX * absX + absY * absY);
		if (hypotenuse < (width * 30) / 100) {
			// 30% of width = 60% of radius
			hour = hour + 12;
			hour = hour > 23 ? 24 - hour : hour;
		}
	}
	return hour;
};
/* Gets the minute from the position */
const getMinuteFromPosition = (position: Postion, minutesIncrement: string | number) => {
	/* Checks the minute increment */
	let increment = parseInt(minutesIncrement + '', 10) || 1;
	increment = increment < 1 || increment > 60 ? 1 : increment;
	/* Computes the degrees */
	const degrees = convertToDegrees(position);
	/* Computes the minute */
	const minute = Math.round(degrees / 6) + 15;
	/* Rounded the minutes depending on the minute increment */
	let minuteRounded = Math.round(minute / increment) * increment;
	minuteRounded = minuteRounded >= 60 ? minuteRounded - 60 : minuteRounded;
	return minuteRounded;
};
/* Gets the position when an event is fired */
const getPosition = (event: PointerEvent & TouchEvent) => {
	// get mouse position or touch or changedTouches or return 0
	const xPos = event.clientX
		? event.clientX
		: event.touches && event.touches.length
			? event.touches[0].clientX
			: event.changedTouches && event.changedTouches.length
				? event.changedTouches[0].clientX
				: 0;
	const yPos = event.clientY
		? event.clientY
		: event.touches && event.touches.length
			? event.touches[0].clientY
			: event.changedTouches && event.changedTouches.length
				? event.changedTouches[0].clientY
				: 0;
	// Get canvas position on view
	const canvas = (event.target as HTMLElement).getBoundingClientRect();
	const x = xPos - canvas.width / 2 - canvas.left;
	const y = -(yPos - canvas.height / 2 - canvas.top);
	return {
		x,
		y
	};
};
export { getDateFromHoursPosition, getDateFromMinutesPosition, getPosition };
