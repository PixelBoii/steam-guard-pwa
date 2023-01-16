import CryptoJS from 'crypto-js';
import { Buffer } from 'buffer';

const time = () => {
	return Math.floor(Date.now() / 1000);
};

const generateAuthCode = (secret) => {
	secret = Buffer.from(secret, 'base64');

	let timeVal = time();

	let buffer = Buffer.allocUnsafe(8);
	// The first 4 bytes are the high 4 bytes of a 64-bit integer. To make things easier on ourselves, let's just pretend
	// that it's a 32-bit int and write 0 for the high bytes. Since we're dividing by 30, this won't cause a problem
	// until the year 6053.
	buffer.writeUInt32BE(0, 0);
	buffer.writeUInt32BE(Math.floor(timeVal / 30), 4);

	// Convert this to how you would do it with cryptoJS:
	let hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA1, CryptoJS.lib.WordArray.create(secret));
	hmac.update(CryptoJS.lib.WordArray.create(buffer));
	hmac = Buffer.from(hmac.finalize().toString(), 'hex');

	let start = hmac[19] & 0x0F;
	hmac = hmac.slice(start, start + 4);

	let fullcode = hmac.readUInt32BE(0) & 0x7FFFFFFF;

	const chars = '23456789BCDFGHJKMNPQRTVWXY';

	let code = '';
	for (let i = 0; i < 5; i++) {
		code += chars.charAt(fullcode % chars.length);
		fullcode /= chars.length;
	}

	return code;
};

export default {
	generateAuthCode,
	time,
};
