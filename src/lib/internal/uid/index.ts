/* eslint-disable */
// Shamefully ripped from https://github.com/lukeed/uid
let IDX = 36;
let HEX = crypto.randomUUID();
while (IDX--) HEX += IDX.toString(36);

export default (len: number) => {
	let str = '';
	let num = len || 11;
	while (num--) str += HEX[(Math.random() * 36) | 0];
	return str;
};
