/* globals expect */
describe('lib/runQuery', () => {
  const runQuery = require('./runQuery');
  const responses = require('../responses');
  const runTest = async ({
    awsSdk,
    res,
    paramsName,
    expectNext,
    expect500,
    expectedError,
    expectedData,
    errorName,
    dataName,
    local
  }) => {
      const middleware = runQuery(
        awsSdk,
        paramsName,
        errorName,
        dataName,
        local
      );
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
      if(errorName) {
        expect(res.locals[errorName]).toEqual(expectedError);
      }
      if(dataName) {
        expect(res.locals[dataName]).toEqual(expectedData);
      }
      if(local && !res.locals[local]) {
        expect(res.locals.dbError).toBeUndefined();
        expect(res.locals.dbData).toBeUndefined();
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
              query: (params, cb) => {
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
              query: (params, cb) => {
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
              query: (params, cb) => {
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
  test('some error, some data, custom output locations', () => {
    const res = {
      locals: {
        paramsName3: {}
      }
    };
    const expectedError = 'some error 3';
    const expectedData = 'some data 3';
    const awsSdk = {
      DynamoDB: {
        DocumentClient: class {
          constructor() {
            return {
              query: (params, cb) => {
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
      paramsName: 'paramsName3',
      expectNext: true,
      expectedError: expectedError,
      expectedData: expectedData,
      errorName: "customErrorVariableName",
      dataName: "customDataVariableName"
    })
  });
  test('some error, some data, but local is supplied and res.locals[local]' +
    ' is undefined, so no logic should happen', () => {
    const res = {
      locals: {
        paramsName4: {}
      }
    };
    const expectedError = 'some error 4';
    const expectedData = 'some data 4';
    const awsSdk = {
      DynamoDB: {
        DocumentClient: class {
          constructor() {
            return {
              query: (params, cb) => {
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
      paramsName: 'paramsName4',
      expectNext: true,
      expectedError: expectedError,
      expectedData: expectedData,
      local: 'thisLocalMissing'
    })
  });
});