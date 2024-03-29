/* globals expect */
describe("lib/runGet", () => {
  const runGet = require("./runGet");
  const responses = require("../responses");
  const runTest = async ({
    awsSdk,
    res,
    paramsName,
    expectNext,
    expect500,
    expectedError,
    expectedData,
  }) => {
    const middleware = runGet(awsSdk, paramsName);
    const req = {};
    let nextCalled = false;
    let statusToSend = 200;
    let sentStatus;
    let sentData;
    res.status = (s) => {
      statusToSend = s;
      return {
        send: (d) => {
          sentStatus = statusToSend;
          sentData = d;
        },
      };
    };
    res.send = (d) => {
      sentStatus = statusToSend;
      sentData = d;
    };
    const next = () => {
      nextCalled = true;
    };
    await middleware(req, res, next);
    if (expectNext) {
      expect(nextCalled).toBeTruthy();
    }
    if (expect500) {
      expect(sentStatus).toEqual(500);
      expect(sentData).toEqual(responses.SERVER_ERROR);
    }
  };
  test("some error, some data", () => {
    const res = {
      locals: {
        paramsName1: {},
      },
    };
    const expectedError = "some error";
    const expectedData = "some data";
    const awsSdk = {
      DynamoDB: {
        DocumentClient: class {
          constructor() {
            return {
              get: (params, cb) => {
                cb(expectedError, expectedData);
              },
            };
          }
        },
      },
    };
    return runTest({
      awsSdk: awsSdk,
      res: res,
      paramsName: "paramsName1",
      expectNext: true,
      expectedError: expectedError,
      expectedData: expectedData,
    });
  });
  test("some other error, some other data", () => {
    const res = {
      locals: {
        paramsName2: {},
      },
    };
    const expectedError = "some other error";
    const expectedData = "some other data";
    const awsSdk = {
      DynamoDB: {
        DocumentClient: class {
          constructor() {
            return {
              get: (params, cb) => {
                cb(expectedError, expectedData);
              },
            };
          }
        },
      },
    };
    return runTest({
      awsSdk: awsSdk,
      res: res,
      paramsName: "paramsName2",
      expectNext: true,
      expectedError: expectedError,
      expectedData: expectedData,
    });
  });
  test("missing dbParams", () => {
    const res = { locals: {} };
    const awsSdk = {
      DynamoDB: {
        DocumentClient: class {
          constructor() {
            return {
              get: (params, cb) => {
                cb(null, null);
              },
            };
          }
        },
      },
    };
    return runTest({
      awsSdk: awsSdk,
      res: res,
      paramsName: "paramsName3",
      expect500: true,
    });
  });
  test.each([
    {
      description: "conditional: don't skip",
      local: "preAuthEmail",
      paramsName: "theParams",
      locals: {
        preAuthEmail: "something@provided.net",
        theParams: { some: "params" },
      },
      expectNext: true,
      expectDbCall: true,
    },
  ])("$description", async ({ local, paramsName, locals, expectNext }) => {
    const next = jest.fn();

    const res = { locals };
    const expectedData = "the data";
    const expectedError = "the error";
    const get = jest.fn((params, cb) => {
      cb(null, expectedData)
      // TODO: apply this testing approach elsewhere, wherever I have runXXX
      // DynamoDB helper functions.
    });
    const awsSdk = {
      DynamoDB: {
        DocumentClient: class {
          constructor() {
            return {
              get,
            };
          }
        },
      },
    };
    const middleware = runGet(awsSdk, paramsName, local);
    await middleware({}, res, next);
    expect(res.locals.dbData).toEqual(expectedData);
  });
});
