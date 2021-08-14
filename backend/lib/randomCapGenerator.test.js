/*global expect*/

const roomCodeGenerator = require('./randomCapGenerator.js');

describe('roomCodeGenerator', () => {
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
  test('5 6-letter room codes should not all be the same', () => {
    const options = { letters: 6 };
    const g = roomCodeGenerator(options);
    const codes = [];
    for(let i = 0; i < 5; i++) {
      codes[i] = g.next().value;
    }
    codes.sort();
    for(let i = 0; i < codes.length - 1; i++) {
      expect(codes[i] == codes[i + 1]).toBeFalsy();
    }
  });
  test('all letters should show up in a large sample', () => {
    const options = { letters: 1 };
    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
      'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y',
      'Z'];
    const g = roomCodeGenerator(options);
    const a = [];
    for(let i = 0; i < 5000; i++) {
      a.push(g.next().value);
    }
    alphabet.forEach(c => {
      expect(a.find(ltr => c == ltr)).toBeTruthy();
    });
  });
});