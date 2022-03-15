const dbParamsGetEmailFromOpaqueCookie = require("./dbParamsGetEmailFromOpaqueCookie");
const schema = require("../schema")

describe("dbParamsGetEmailFromOpaqueCookie", () => {
  test("if local is unset, return next and do not set Get params", () => {
    const local = "preAuthEmail";
  });
  test("res.locals.dbParamsGetEmailFromOpaqueCookie should be set on success", () => {});
  test.each([
    {
      description: "if local is unset, return next and do not set Get params",
      local: "preAuthEmail",
      expectNext: true,
      locals: {},
      req: {},
    },
    {
      description: "set params to get email from cookie 1",
      local: "preAuthEmail",
      expectNext: true,
      locals: {preAuthEmail: "iamhere@here.cz", dbParamsGetEmailFromOpaqueCookie: {
        TableName: schema.TABLE_NAME,
        Key: {
          [schema.PARTITION_KEY]: '...'
        }
      }},
      req: {cookies: {login: "MVFADHMVFADHMVFADHMVFADHMVFADH"}},
    },
  ])(
    "$description",
    ({ local, expectNext, locals, req, expectedStatus, expectedMessage, expectedLocals }) => {
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
      if(expectedLocals) {
        expect(res.locals).toEqual(expectedLocals)
      }
    }
  );
});
