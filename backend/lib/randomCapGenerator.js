/**
 * Yield random sequences of capital English letters
 * @param {Object} options The options, including:
 *   * letters {Number} (Required) The number of letters to be in the sequences
 * @yield {String} Random sequences of letters
 */
function* randomCapGenerator(options) {
  const crypto = require('crypto');
  const alphabet = ['Q','J','B','P','T','F','A','E','M','C','S','I','K','O','D',
    'G','H','U','W','Y','Z','X','L','N','R','V'];
  const { letters } = options;
  let code;
  while(true) {
    code = '';
    for(let i = 0; i < letters; i++) {
      // get a random number and % it by 26
      code = code + alphabet[
        parseInt(crypto.randomBytes(3).toString('hex'), 16) % alphabet.length
        ];
    }
    yield code;
  }
}

module.exports = randomCapGenerator;