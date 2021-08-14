/*global expect*/

const roomCodeGenerator = require('./dupCodeGen.js');

describe('dupCodeGen', () => {
  test('the Room Code should be the requested number of letters (6)', () => {
    const options = { letters: 6 };
    const g = roomCodeGenerator(options);
    const str = g.next().value;
    expect(str).toMatch(/[A-Z]{6}/);
    
  });
  test('the Room Code should be the requested number of letters (7)', () => {
    const options = { letters: 7 };
    const g = roomCodeGenerator(options);
    const str = g.next().value;
    expect(str).toMatch(/[A-Z]{7}/);
  });
  test('5 6-letter room codes SHOULD all be the same', () => {
    const options = { letters: 6 };
    const g = roomCodeGenerator(options);
    const codes = [];
    for(let i = 0; i < 5; i++) {
      codes[i] = g.next().value;
    }
    for(let i = 0; i < codes.length - 1; i++) {
      expect(codes[i] == codes[i + 1]).toBeTruthy();
    }
  });
});