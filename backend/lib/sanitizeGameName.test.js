/* globals expect */
const sanitizeGameName = require('./sanitizeGameName');
describe('sanitizeGameName', () => {
  const runTest = async ({illegalCharacters, inputGameName,
    expectedSanitizedGameName, expectNext}) => {
      const middleware = sanitizeGameName({
        illegalCharacters: illegalCharacters
      });
      const req = {
        body: {
          gameName: inputGameName
        }
      };
      let nextCalled = false;
      const next = () => {
        nextCalled = true;
      };
      const result = await middleware(req, {}, next);
      if(expectedSanitizedGameName) {
        expect(req.body.gameName).toEqual(expectedSanitizedGameName);
      }
      expect(nextCalled).toEqual(expectNext);
    };
  test('no blacklisted characters, name should be unchanged', () => {
    const name = 'Nothing Could Be Bad';
    return runTest({illegalCharacters: [], inputGameName: name,
      expectedSanitizedGameName: name, expectNext: true});
  });
  test('game name with illegal characters', () => {
    const illegalCharacters = [';', '='];
    const inputGameName = 'cook=bad; attributes';
    const expectedSanitizedGameName = 'cookbad attributes';
    const expectNext = true;
    return runTest({illegalCharacters: illegalCharacters,
      inputGameName: inputGameName,
      expectedSanitizedGameName: expectedSanitizedGameName,
      expectNext: expectNext
    });
  });
  test('game name with no illegal characters, non-empty blacklist', () => {
    const illegalCharacters = ['a', 'b', 'c'];
    const inputGameName = 'Rom; mum=d;';
    const expectNext = true;
    return runTest({
      illegalCharacters: illegalCharacters,
      inputGameName: inputGameName,
      expectedSanitizedGameName: inputGameName,
      expectNext: expectNext
    });
  });
});