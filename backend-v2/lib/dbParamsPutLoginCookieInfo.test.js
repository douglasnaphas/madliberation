const dbParamsPutLoginCookieInfo = require("./dbParamsPutLoginCookieInfo");
const schema = require("../schema");

describe("dbParamsPutLoginCookieInfo", () => {
  test.each([
    {
      description: "set params to put cookie info 1",
      expectNext: true,
      locals: {
        email: "iamhere@here.cz",
        opaqueCookie: "ABCDEFGHIJABCDEFGHIJABCDEFGHIJ",
        opaqueCookieIssuedDate: "2022-04-06T23:00:00.000Z",
        opaqueCookieIssuedMs: 1649286000000,
        opaqueCookieExpirationDate: "2022-05-06T23:00:00.000Z",
        opaqueCookieExpirationMs: 1651878000000,
      },
      expectedLocals: {
        email: "iamhere@here.cz",
        opaqueCookie: "ABCDEFGHIJABCDEFGHIJABCDEFGHIJ",
        opaqueCookieIssuedDate: "2022-04-06T23:00:00.000Z",
        opaqueCookieIssuedMs: 1649286000000,
        opaqueCookieExpirationDate: "2022-05-06T23:00:00.000Z",
        opaqueCookieExpirationMs: 1651878000000,
        dbParamsPutLoginCookieInfo: {
          TableName: schema.TABLE_NAME,
          Item: {
            [schema.PARTITION_KEY]: `ABCDEFGHIJABCDEFGHIJABCDEFGHIJ`,
            [schema.SORT_KEY]: schema.OPAQUE_COOKIE,
            [schema.USER_EMAIL]: "iamhere@here.cz",
            [schema.OPAQUE_COOKIE_ISSUED_DATE]: "2022-04-06T23:00:00.000Z",
            [schema.OPAQUE_COOKIE_ISSUED_MILLISECONDS]: `1649286000000`,
            [schema.OPAQUE_COOKIE_EXPIRATION_DATE]: "2022-05-06T23:00:00.000Z",
            [schema.OPAQUE_COOKIE_EXPIRATION_MILLISECONDS]: `1651878000000`,
          },
        },
      },
    },
  ])(
    "$description",
    ({
      expectNext,
      locals,
      expectedStatus,
      expectedMessage,
      expectedLocals,
    }) => {
      let res = { locals };
      let tentativeStatus = 200;
      let sentStatus;
      let actualMessage;
      res.status = jest.fn((status) => {
        tentativeStatus = status;
        return res;
      });
      res.send = jest.fn((message) => {
        actualMessage = message;
        sentStatus = tentativeStatus;
        return res;
      });
      res.sendStatus = jest.fn((status) => {
        sentStatus = status;
        return res;
      });
      const middleware = dbParamsPutLoginCookieInfo();
      const next = jest.fn();
      middleware({}, res, next);
      if (expectNext) {
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
        expect(res.sendStatus).not.toHaveBeenCalled();
      }
      if (expectedStatus) {
        expect(sentStatus).toEqual(expectedStatus);
        expect(
          res.send.mock.calls.length + res.sendStatus.mock.calls.length
        ).toEqual(1);
      }
      if (expectedMessage) {
        expect(actualMessage).toEqual(expectedMessage);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.send).toHaveBeenCalledTimes(1);
        expect(res.sendStatus).not.toHaveBeenCalled();
      }
      if (expectedLocals) {
        expect(res.locals).toEqual(expectedLocals);
      }
    }
  );
});
