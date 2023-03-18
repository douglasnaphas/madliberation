/* globals expect */
describe("joinSederMiddleware/setCookie", () => {
  const setCookie = require("./setCookie");
  const responses = require("../../responses");
  const runTest = ({ res, expectedCookie, expectNext, expect500 }) => {
    const middleware = setCookie();
    let statusToSend = 200;
    let sentStatus;
    let nextCalled = false;
    let sentData;
    const next = () => {
      nextCalled = true;
    };
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
    const cookies = [];
    if (!res.cookie) {
      res.cookie = (name, value, options) => {
        cookies.push({ name: name, value: value, options: options });
      };
    }
    const req = {};
    middleware(req, res, next);
    if (expectNext) {
      expect(nextCalled).toBeTruthy();
    }
    if (expectedCookie) {
      const matchingCookie = cookies.find((c) => {
        return c.name == expectedCookie.name && c.value == expectedCookie.value;
      });
      expect(matchingCookie.options).toEqual(expectedCookie.options);
    }
    if (expect500) {
      expect(sentStatus).toEqual(500);
      expect(sentData).toEqual(responses.SERVER_ERROR);
    }
  };
  test("happy path 1", () => {
    const cookieOptions =
      process.env.NODE_ENV === "development"
        ? { httpOnly: true, sameSite: "None" }
        : { httpOnly: true, secure: true, sameSite: "Strict" };
    const gameNameHash = "gameNameHash1";
    const sessionKey = "randomString1";
    const expectedCookie = {
      name: gameNameHash,
      value: sessionKey,
      options: cookieOptions,
    };
    const res = {
      locals: {
        gameNameHash: gameNameHash,
        gameNameSessionKey: sessionKey,
      },
    };
    runTest({ res: res, expectedCookie: expectedCookie, expectNext: true });
  });
  test("happy path 2", () => {
    const cookieOptions =
      process.env.NODE_ENV === "development"
        ? { httpOnly: true, sameSite: "None" }
        : { httpOnly: true, secure: true, sameSite: "Strict" };
    const gameNameHash = "gameNameHash2";
    const sessionKey = "randomString2";
    const expectedCookie = {
      name: gameNameHash,
      value: sessionKey,
      options: cookieOptions,
    };
    const res = {
      locals: {
        gameNameHash: gameNameHash,
        gameNameSessionKey: sessionKey,
      },
    };
    runTest({ res: res, expectedCookie: expectedCookie, expectNext: true });
  });
  test("missing game name hash", () => {
    const sessionKey = "randomString3";
    const res = {
      locals: {
        gameNameSessionKey: sessionKey,
      },
    };
    runTest({ res: res, expect500: true });
  });
  test("missing game name session key", () => {
    const res = {
      locals: {
        gameNameHash: "not mising",
      },
    };
    runTest({ res: res, expect500: true });
  });
});
