const crypto = require('crypto');
/**
 * Return a random integer between integer x and integer y, inclusive.
 */
function randomNumber(x, y) {
  if(!Number.isInteger(x) || !Number.isInteger(y)) return undefined;
  if(y < x) return undefined;
  const BYTES = 3;
  const BITS = BYTES * 8;
  const zeroPtSomething = // will never be 1.0 because 2**BITS>1^{BITS}
    parseInt(crypto.randomBytes(BYTES).toString('hex'), 16) / 2 ** BITS;
  const zeroToYMinusXInclusive = Math.floor(zeroPtSomething * (y - x + 1));
  return x + zeroToYMinusXInclusive;
}
module.exports = randomNumber;