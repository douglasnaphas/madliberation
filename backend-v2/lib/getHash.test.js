/* globals expect */
const getHash = require('./getHash');
describe('getHash', () => {
  test('should hash correctly, default length', () => {
    const expectedHash = ('61D034473102D7DAC305902770471FD50F4C5B26F6831A56D' + 
      'D90B5184B3C30FC').toLowerCase();
    expect(getHash('some string')).toEqual(expectedHash);
  });
  test('should hash correctly, custom length', () => {
    const expectedHash = ('EB201AF5AAF0').toLowerCase();
    expect(getHash('hash me', 12)).toEqual(expectedHash);
  });
});