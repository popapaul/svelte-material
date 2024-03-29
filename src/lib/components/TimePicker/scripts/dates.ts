/* Copyright (c) 2020-2022 Jacques Desodt */
/* Formats a time with leading zeros */
const formatTime = (time: number) => {
	return time < 10 ? '0' + time : '' + time;
};
/* Gets the hour of a date in AM mode */
const getAmHour = (date: Date) => {
	let hour = date.getHours();
	return hour > -1 && hour < 13 ? hour : hour - 12;
};
/* Gets the AM/PM period of a date */
const getAmPm = (date: Date) => {
	let hour = date.getHours();
	return hour > 0 && hour < 13 ? 'am' : 'pm';
};
/* Converts an hour as degrees. 0deg = 3h, 30deg = 4h, etc */
const hourToDegrees = (date: Date) => {
	/* Initializes */
	let hour = getAmHour(date);
	/* Computes. 0deg = 3h, 30deg = 4h, etc */
	let degrees = (hour - 3) * 30;
	degrees = degrees > 360 ? degrees - 360 : degrees;
	degrees = degrees < 0 ? degrees + 360 : degrees;
	return degrees;
};
/* Checks if a date is in AM part */
const isAm = (date: Date) => {
	let hours = date.getHours();
	return hours >= 0 && hours < 12;
};
/* Converts a minute as degrees. 0deg = 15m, 6deg = 16m, etc */
const minuteToDegrees = (date: Date) => {
	/* Initializes */
	let minute = date.getMinutes();
	/* Computes. 0deg = 15m, 6deg = 16m,... 30deg = 20m, etc */
	let degrees = (minute - 15) * 6;
	degrees = degrees > 360 ? degrees - 360 : degrees;
	degrees = degrees < 0 ? degrees + 360 : degrees;
	return degrees;
};
/* Toggles the AM/PM mode for a date */
const toggleAmPm = (date: Date, toAm: boolean) => {
	let hour = date.getHours();
	let isCurrentAm = isAm(date);
	if (isCurrentAm && !toAm) {
		date = new Date(date.setHours(hour + 12));
	}
	if (!isCurrentAm && toAm) {
		date = new Date(date.setHours(hour - 12));
	}
	return date;
};
export { getAmPm, formatTime, hourToDegrees, isAm, minuteToDegrees, toggleAmPm };
