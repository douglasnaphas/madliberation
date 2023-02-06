/**
 * @param {String} str The string to hash
 * @param {Number} len The length of the return value, default 64
 * @return {String} The first len characters of the SHA256 hash of str
 */
function getHash(str, len) {
  len = len || 64;
  const crypto = require('crypto');
  const hash = crypto.createHash('sha256');
  hash.update(str);
  return hash.digest('hex').substring(0, len).toLowerCase();
}

module.exports = getHash;