/* globals expect */
describe('lib/runTransactWrite', () => {
  const runTransactWrite = require('./runTransactWrite');
  const responses = require('../responses');
  const runTest = async ({awsSdk, res, paramsName, expectNext, expect500,
    expectedError, expectedData}) => {
      const middleware = runTransactWrite(awsSdk, paramsName);
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
      if(expectedData) {
        expect(res.locals.dbData).toEqual(expectedData);
      }
      if(expectedError) {
        expect(res.locals.dbError).toEqual(expectedError);
      }
  };
  test('some error, some data', () => {
    const res = {
      locals: {
        paramsName1: {
          expectedError: 'some error',
          expectedData: 'some data'
        }
      }
    };
    const awsSdk = {
      DynamoDB: {
        DocumentClient: class {
          constructor() {
            return {
              transactWrite: (params, cb) => {
                cb(params.expectedError, params.expectedData);
              }
            };
          }
        }
      }
    };
    return runTest({
      awsSdk: awsSdk,
      res: res,
      paramsName: 'paramsName1',
      expectNext: true,
      expectedError: res.locals.paramsName1.expectedError,
      expectedData: res.locals.paramsName1.expectedData
    });
  });
  test('some other error, some other data', () => {
    const res = {
      locals: {
        paramsName2: {
          expectedData: 'some other data',
          expectedError: 'some other error'
        }
      }
    };
    const awsSdk = {
      DynamoDB: {
        DocumentClient: class {
          constructor() {
            return {
              transactWrite: (params, cb) => {
                cb(params.expectedError, params.expectedData);
              }
            };
          }
        }
      }
    };
    return runTest({
      awsSdk: awsSdk,
      res: res,
      paramsName: 'paramsName2',
      expectNext: true,
      expectedError: res.locals.paramsName2.expectedError,
      expectedData: res.locals.paramsName2.expectedData
    });
  });
  test('missing dbParams', () => {
    const res = {locals: {}};
    return runTest({res: res, paramsName: 'paramsName3',
      expect500: true});
  });
});