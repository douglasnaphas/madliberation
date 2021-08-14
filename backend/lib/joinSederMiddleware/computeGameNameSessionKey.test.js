/* globals expect */
describe('computeGameNameSessionKey', () => {
  const computeGameNameSessionKey = require('./computeGameNameSessionKey');
  const Configs = require('../../Configs');
  const responses = require('../../responses');
  const randomString = 'random string';
  const randomStringGenerator = function* () {
    yield randomString;
  };
  const otherRandomString = 'random string 2';
  const otherRandomStringGenerator = function* () {
    yield otherRandomString;
  };
  const faultyStringGenerator = function* () {};
  const runTest = ({stringGenerator, configs, res, expectedSessionKey,
    expect500, expectNext, expectedData}) => {
    configs = configs || Configs;
    const middleware = computeGameNameSessionKey(stringGenerator, configs);
    let statusToSend = 200;
    let sentStatus;
    let sentData;
    res = res || { 
      locals: {},
      status: (s) => {
        statusToSend = 500;
        return {
          send: (d) => { sentStatus = statusToSend; sentData = d; }
        };
      },
      send: (d) => { sentStatus = statusToSend; sentData = d; }
    };
    let nextCalled = false;
    const next = () => { nextCalled = true };
    middleware({}, res, next);
    if(expectNext) {
      expect(nextCalled).toBeTruthy();
      expect(res.locals.gameNameSessionKey).toEqual(expectedSessionKey);
    } else {
      expect(nextCalled).toBeFalsy();
    }
    if(expect500) {
      expect(sentStatus).toEqual(500);
    }
    if(expectedData) {
      expect(sentData).toEqual(expectedData);
    }
  };
  test('should set res.locals.sessionKey to random string', () => {
    runTest({
      stringGenerator: randomStringGenerator,
      expectedSessionKey: randomString,
      expectNext: true
    });
  });
  test('should set res.locals.sessionKey to other random string', () => {
    runTest({
      stringGenerator: otherRandomStringGenerator,
      expectedSessionKey: otherRandomString,
      expectNext: true
    });
  });
  test('faulty generator, should send 500', () => {
    runTest({
      stringGenerator: faultyStringGenerator,
      expect500: true,
      expectedData: responses.SERVER_ERROR
    });
  });
});