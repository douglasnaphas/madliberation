/* globals expect */
const pathCheck = require('./pathCheck');
describe('pathCheck, middleware to ensure there is a path in the body, and ' +
  'check it against a pattern', () => {
  const runTest = async (options, req, expect400, expectNext) => {
    const result = await new Promise((resolve, reject) => {
      const res = {
        status: (s) => {
          if(s == 400) {
            return {
              send: () => {resolve({sent400: true});}
            };
          }
        }
      };
      const next = () => {resolve({sent400: false, nextCalled: true})};
      const middleware = options ? pathCheck(options) : pathCheck();
      middleware(req, res, next);
    });
    if(expect400) {
      expect(result).toHaveProperty('sent400');
      expect(result.sent400).toBeTruthy();
    }
    if(expectNext) {
      expect(result).toHaveProperty('nextCalled');
      expect(result.nextCalled).toBeTruthy();
    }
  };
  test('no body -> 400', () => {
    return runTest(false, {nobody: 'nobody'}, true, false);
  });
  test('no path -> 400', () => {
    return runTest(false, {body: {nopath: 'no path'}}, true, false);
  });
  test('body has a path that matches the regex option -> next', async () => {
    const path = 'madliberation-scripts/001-Family_Script';
    return runTest(false, {body: {path: path}}, false, true);
  });
  test('body has a path that mismatches the regex option -> 400', async () => {
    const path = 'madliberation-scripts/001-Family_Script!';
    return runTest(false, {body: {path: path}}, true, false);
  });
});