/* globals expect */
describe('lib/runTransactWrites', () => {
  const runTransactWrite = require('./runTransactWrites');
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
  test('1 transactWrite, some error, some data', () => {
    const res = {
      locals: {
        paramsName1: [
          {
            expectedError: 'some error',
            expectedData: 'some data'
          }
        ]
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
      expectedError: [res.locals.paramsName1[0].expectedError],
      expectedData: [res.locals.paramsName1[0].expectedData]
    });
  });
  test('1 transactWrite, some other error, some other data', () => {
    const res = {
      locals: {
        paramsName2: [
          {
            expectedData: 'some other data',
            expectedError: 'some other error'
          }
        ]
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
      expectedError: [res.locals.paramsName2[0].expectedError],
      expectedData: [res.locals.paramsName2[0].expectedData]
    });
  });
  test('2 transactWrites', () => {
    const res = {
      locals: {
        paramsName1: [
          {
            expectedError: 'some error',
            expectedData: 'some data'
          },
          {
            expectedError: 'more errors',
            expectedData: 'more data'
          }
        ]
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
    const expectedError = [
      res.locals.paramsName1[0].expectedError,
      res.locals.paramsName1[1].expectedError
    ];
    const expectedData = [
      res.locals.paramsName1[0].expectedData,
      res.locals.paramsName1[1].expectedData
    ];
    return runTest({
      awsSdk: awsSdk,
      res: res,
      paramsName: 'paramsName1',
      expectNext: true,
      expectedError: expectedError,
      expectedData: expectedData
    });
  });
  test('15 transactWrites', () => {});
  test('missing dbParams', () => {
    const res = {locals: {}};
    return runTest({res: res, paramsName: 'paramsName3',
      expect500: true});
  });
});