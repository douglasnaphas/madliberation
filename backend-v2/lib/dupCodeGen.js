function* roomCodeGenerator(options) {
  const crypto = require('crypto');
  const alphabet = ['Q','J','B','P','T','F','A','E','M','C','S','I','K','O','D',
    'G','H','U','W','Y','Z','X','L','N','R','V'];
  const { letters } = options;
  let code;
  while(true) {
    code = '';
    for(let i = 0; i < letters; i++) {
      code = code + alphabet[
        i % alphabet.length
        ];
    }
    yield code;
  }
}

module.exports = roomCodeGenerator;