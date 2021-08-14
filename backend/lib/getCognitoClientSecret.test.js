/* globals expect, jest */
const getCognitoClientSecret = require("./getCognitoClientSecret");
const responses = require("../responses");
const Configs = require("../Configs");

describe("getCognitoClientSecret", () => {
  const runTest = async (
    { theError, theData, expectNext, expect500, local, locals,
      expectLogicSkipped }
  ) => {
    const describeUserPoolClient = jest.fn((params, cb) => {
      cb(theError, theData);
    });
    const awsSdk = {
      CognitoIdentityServiceProvider: class {
        constructor() {
          return {
            describeUserPoolClient
          };
        }
      }
    };
    const middleware = getCognitoClientSecret(awsSdk, local);
    const req = {};
    const send = jest.fn();
    const res = {
      locals: locals || {},
      status: jest.fn(() => ({ send })),
      sendStatus: jest.fn()
    };
    const next = jest.fn();
    await middleware(req, res, next);
    if(!expectLogicSkipped) {
      expect(describeUserPoolClient).toHaveBeenCalled();
      expect(describeUserPoolClient).toHaveBeenCalledTimes(1);
      expect(describeUserPoolClient).toHaveBeenCalledWith(
        {
          ClientId: Configs.CognitoClientID(),
          UserPoolId: Configs.CognitoUserPoolID()
        },
        expect.anything()
      );
    }
    if (expectNext) {
      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(send).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.sendStatus).not.toHaveBeenCalled();
      if(expectLogicSkipped) {
        expect(res.locals.clientSecret).toBeUndefined();
      } else {
        expect(res.locals.clientSecret).toEqual(
          theData.UserPoolClient.ClientSecret
        );
      }
    }
    if (expect500) {
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(send).toHaveBeenCalled();
      expect(send).toHaveBeenCalledTimes(1);
      expect(send).toHaveBeenCalledWith(responses.SERVER_ERROR);
    }
  };
  test("local x specified, returned middleware should return next() and do" + 
    " nothing else if(!res.locals.x)", () => {
    return runTest({
      theError: null,
      theData: {
        UserPoolClient: { ClientSecret: "this-should-not-be-used=-ya-z-3" }
      },
      expectNext: true,
      expect500: false,
      local: "x",
      expectLogicSkipped: true
    });
  });
  test("local user specified, returned middleware should run as normal " +
    "if(res.locals.user)", () => {
    return runTest({
      theError: null,
      theData: {
        UserPoolClient: { ClientSecret: "this-should-not-be-used=-ya-z-3" }
      },
      expectNext: true,
      expect500: false,
      local: "user",
      locals: {user: "fnad9-34283jfad-fae3"}
    });
  });
  test("valid data 1", () => {
    return runTest({
      theError: null,
      theData: {
        UserPoolClient: { ClientSecret: "this-is-some-secret===xxx--yy-z-1" }
      },
      expectNext: true,
      expect500: false
    });
  });
  test("valid data 2", () => {
    return runTest({
      theError: undefined,
      theData: { UserPoolClient: { ClientSecret: "some-other-secret-3838" } },
      expectNext: true,
      expect500: false
    });
  });
  test("valid data", async () => {
    const theError = null;
    const theData = {
      UserPoolClient: {
        ClientSecret: "this-is-some-secret-xxx-yyz-113-332"
      }
    };
    const awsSdk = {
      CognitoIdentityServiceProvider: class {
        constructor() {
          return {
            describeUserPoolClient: (params, cb) => {
              cb(theError, theData);
            }
          };
        }
      }
    };
    const middleware = getCognitoClientSecret(awsSdk);
    const req = {};
    const send = jest.fn();
    const res = {
      locals: {},
      status: jest.fn(() => ({ send })),
      sendStatus: jest.fn()
    };
    const next = jest.fn();
    await middleware(req, res, next);
    expect(res.status).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
    expect(res.sendStatus).not.toHaveBeenCalled();
    expect(res.locals.clientSecret).toEqual(
      "this-is-some-secret-xxx-yyz-113-332"
    );
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });
  test("some error, some invalid data", async () => {
    const expectedError = "some error";
    const expectedData = "some data";
    const awsSdk = {
      CognitoIdentityServiceProvider: class {
        constructor() {
          return {
            describeUserPoolClient: (params, cb) => {
              cb(expectedError, expectedData);
            }
          };
        }
      }
    };
    const middleware = getCognitoClientSecret(awsSdk);
    const req = {};
    const send = jest.fn();
    const res = {
      locals: {},
      status: jest.fn(() => ({
        send
      }))
    };
    const next = jest.fn();
    await middleware(req, res, next);
    expect(res.status).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(send).toHaveBeenCalled();
    expect(send).toHaveBeenCalledWith(responses.SERVER_ERROR);
    expect(next).not.toHaveBeenCalled();
  });
  test("no error, no data", async () => {
    const expectedError = undefined;
    const expectedData = undefined;
    const awsSdk = {
      CognitoIdentityServiceProvider: class {
        constructor() {
          return {
            describeUserPoolClient: (params, cb) => {
              cb(expectedError, expectedData);
            }
          };
        }
      }
    };
    const middleware = getCognitoClientSecret(awsSdk);
    const req = {};
    const send = jest.fn();
    const res = {
      locals: {},
      status: jest.fn(() => ({
        send
      }))
    };
    const next = jest.fn();
    await middleware(req, res, next);
    expect(res.status).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(send).toHaveBeenCalled();
    expect(send).toHaveBeenCalledWith(responses.SERVER_ERROR);
    expect(next).not.toHaveBeenCalled();
  });
  test("another error case", () => {
    return runTest({
      theError: { another: "error" },
      theData: null,
      expectNext: false,
      expect500: true
    });
  });
  test("error and valid data", () => {
    return runTest({
      theError: { theStrange: "case of error and valid data" },
      theData: { UserPoolClient: { ClientSecret: "just-succeed-why-fail" } },
      expectNext: true,
      expect500: false
    });
  });
});
