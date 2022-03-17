const Configs = require("../Configs");
describe("validateOpaqueCookie", () => {
  const validateOpaqueCookie = require("./validateOpaqueCookie");
  test.each([
    {
      description: "local not set, return next and do nothing else",
      local: "preAuthEmail",
      expectNext: true,
      startingLocals: {},
      expectedLocals: {},
    },
    {
      description: "local set, valid cookie 1",
      local: "someOtherLocal",
      req: { cookies: { [`login`]: "POIUMUPOIUMUPOIUMUPOIUMUPOIUMU" } },
      expectNext: true,
      startingLocals: { someOtherLocal: "present" },
      expectedLocals: {
        someOtherLocal: "present",
        loginCookie: "POIUMUPOIUMUPOIUMUPOIUMUPOIUMU",
      },
    },
    {
      description: "local set, valid cookie 2",
      local: "someOtherLocal",
      req: {
        cookies: {
          [`${Configs.loginCookieName()}`]: "XXXXXXXXXXXXPOIUMUPOIUMUPOIUMU",
        },
      },
      expectNext: true,
      startingLocals: { someOtherLocal: "present" },
      expectedLocals: {
        someOtherLocal: "present",
        loginCookie: "XXXXXXXXXXXXPOIUMUPOIUMUPOIUMU",
      },
    },
    {
      description: "local set, invalid cookie 1",
      local: "someOtherLocal2",
      req: { cookies: { [`login`]: "; trying :some dynamo['injection'];" } },
      expectNext: false,
      expectedStatus: 400,
      startingLocals: { someOtherLocal2: "present!!" },
      expectedLocals: {
        someOtherLocal2: "present!!",
      },
    },
    {
      description: "local set, no login cookie",
      local: "someOtherLocal2",
      req: { cookies: {} },
      expectNext: false,
      expectedStatus: 400,
      startingLocals: { someOtherLocal2: "present!!" },
      expectedLocals: {
        someOtherLocal2: "present!!",
      },
    },
    {
      description: "local set, no cookies property",
      local: "someOtherLocal2",
      req: {},
      expectNext: false,
      expectedStatus: 400,
      startingLocals: { someOtherLocal2: "present!!" },
      expectedLocals: {
        someOtherLocal2: "present!!",
      },
    },
  ])(
    "$description",
    ({
      local,
      req,
      expectNext,
      expectedStatus,
      startingLocals,
      expectedLocals,
    }) => {
      const middleware = validateOpaqueCookie({ local });
      const res = { locals: startingLocals, send: jest.fn() };
      res.status = jest.fn(() => res);
      const next = jest.fn();
      middleware(req, res, next);
      if (expectNext) {
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
      }
      if (expectedStatus) {
        expect(res.status).toHaveBeenCalledWith(expectedStatus);
        expect(next).not.toHaveBeenCalled();
      }
      expect(res.locals).toEqual(expectedLocals);
    }
  );
});
