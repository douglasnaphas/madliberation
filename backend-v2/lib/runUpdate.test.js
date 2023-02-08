/* globals expect */
describe('lib/runUpdate', () => {
  const runUpdate = require('./runUpdate');
  const responses = require('../responses');
  const runTest = async ({awsSdk, res, paramsName, expectNext, expect500,
    expectedError, expectedData}) => {
      const middleware = runUpdate(awsSdk, paramsName);
      const req = {};
      let nextCalled = false;
      let statusToSend = 200;
      let sentStatus;
      let sentData;
      res.status = (s) => {
        statusToSend = s;
        return {
          send: (d) => { sentStatus = statusToSend; sentData = d; }
        }
      };
      res.send = (d) => { sentStatus = statusToSend; sentData = d; };
      const next = () => { nextCalled = true };
      await middleware(req, res, next);
      if(expectNext) {
        expect(nextCalled).toBeTruthy();
      }
      if(expect500) {
        expect(sentStatus).toEqual(500);
        expect(sentData).toEqual(responses.SERVER_ERROR);
      }
  };
  test('some error, some data', () => {
    const res = {
      locals: {
        paramsName1: {}
      }
    };
    const expectedError = 'some error';
    const expectedData = 'some data';
    const awsSdk = {
      DynamoDB: {
        DocumentClient: class {
          constructor() {
            return {
              update: (params, cb) => {
                cb(expectedError, expectedData);
              }
            }
          }
        }
      }
    };
    return runTest({
      awsSdk: awsSdk,
      res: res,
      paramsName: 'paramsName1',
      expectNext: true,
      expectedError: expectedError,
      expectedData: expectedData
    })
  });
  test('some other error, some other data', () => {
    const res = {
      locals: {
        paramsName2: {}
      }
    };
    const expectedError = 'some other error';
    const expectedData = 'some other data';
    const awsSdk = {
      DynamoDB: {
        DocumentClient: class {
          constructor() {
            return {
              update: (params, cb) => {
                cb(expectedError, expectedData);
              }
            }
          }
        }
      }
    };
    return runTest({
      awsSdk: awsSdk,
      res: res,
      paramsName: 'paramsName2',
      expectNext: true,
      expectedError: expectedError,
      expectedData: expectedData
    })
  });
  test('missing dbParams', () => {
    const res = {locals: {}};
    const awsSdk = {
      DynamoDB: {
        DocumentClient: class {
          constructor() {
            return {
              update: (params, cb) => {
                cb(null, null);
              }
            }
          }
        }
      }
    };
    return runTest({awsSdk: awsSdk, res: res, paramsName: 'paramsName3',
      expect500: true});
  });
});