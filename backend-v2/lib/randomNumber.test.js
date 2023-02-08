/* globals expect */
describe('lib/randomNumber', () => {
  const randomNumber = require('./randomNumber');
  test('numbers should be between x and y and not all the same', () => {
    const a = [];
    const x = 1;
    const y = 100;
    for(let i = 0; i < 500; i++) {
      a.push(randomNumber(x, y));
      expect(a[i]).toBeGreaterThanOrEqual(x);
      expect(a[i]).toBeLessThanOrEqual(y);
    }
    a.sort();
    let valuesAllSame = true;
    for(let i = 0; i < a.length - 1 && valuesAllSame; i++) {
      valuesAllSame = a[i] == a[i + 1];
    }
    expect(valuesAllSame).toBeFalsy();
  });
  test('all numbers in a small range should show up in a large sample', () => {
    const a = [];
    const x = 30;
    const y = 32;
    for(let i = 0; i < 1000; i++) {
      a.push(randomNumber(x, y));
    }
    expect(a.find(n => n == 30)).toBeTruthy();
    expect(a.find(n => n == 31)).toBeTruthy();
    expect(a.find(n => n == 32)).toBeTruthy();
  });
});