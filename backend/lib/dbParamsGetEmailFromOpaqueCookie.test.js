const dbParamsGetEmailFromOpaqueCookie = require("./dbParamsGetEmailFromOpaqueCookie");
const schema = require("../schema");

describe("dbParamsGetEmailFromOpaqueCookie", () => {
  test.each([
    {
      description: "if local is unset, return next and do not set Get params",
      local: "preAuthEmail",
      expectNext: true,
      locals: {},
      req: {},
      expectedLocals: {},
    },
    {
      description: "set params to get email from cookie 1",
      local: "preAuthEmail",
      expectNext: true,
      locals: {
        preAuthEmail: "iamhere@here.cz",
        loginCookie: "SOMECOOKIESOMECOOKIE",
      },
      expectedLocals: {
        preAuthEmail: "iamhere@here.cz",
        loginCookie: "SOMECOOKIESOMECOOKIE",
        dbParamsGetEmailFromOpaqueCookie: {
          TableName: schema.TABLE_NAME,
          Key: {
            [schema.PARTITION_KEY]: "SOMECOOKIESOMECOOKIE",
            [schema.SORT_KEY]: schema.OPAQUE_COOKIE,
          },
        },
      },
      req: {},
    },
    {
      description: "set params to get email from cookie 2",
      local: "preAuthEmail",
      expectNext: true,
      locals: {
        preAuthEmail: "youwerehere@here.cz",
        loginCookie: "DIFFERENTSOMECOOKIESOMECOOKIE",
      },
      expectedLocals: {
        preAuthEmail: "youwerehere@here.cz",
        loginCookie: "DIFFERENTSOMECOOKIESOMECOOKIE",
        dbParamsGetEmailFromOpaqueCookie: {
          TableName: schema.TABLE_NAME,
          Key: {
            [schema.PARTITION_KEY]: "DIFFERENTSOMECOOKIESOMECOOKIE",
            [schema.SORT_KEY]: schema.OPAQUE_COOKIE,
          },
        },
      },
      req: {},
    },
    {
      description: "res.locals.loginCookie not set, 500",
      local: "preAuthEmail",
      locals: { preAuthEmail: "youwerehere@here.cz" },
      expectedLocals: {
        preAuthEmail: "youwerehere@here.cz",
      },
      req: {},
      expectedStatus: 500,
    },
  ])(
    "$description",
    ({
      local,
      expectNext,
      locals,
      req,
      expectedStatus,
      expectedMessage,
      expectedLocals,
    }) => {
      const res = { locals };
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
      const middleware = dbParamsGetEmailFromOpaqueCookie(local);
      const next = jest.fn();
      middleware(req, res, next);
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
