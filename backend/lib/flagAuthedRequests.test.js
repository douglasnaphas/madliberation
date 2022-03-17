/* globals expect, jest */
describe("lib/flagAuthedRequests", () => {
  const flagAuthedRequests = require("./flagAuthedRequests");
  const responses = require("../responses");
  test.each([
    {
      description: "GET, user, no email 1",
      req: {
        method: "GET",
        query: { user: "afjda0-943fakd8-fajsdk23-ffasdf3" },
      },
      expectNext: true,
      expectedLocals: { user: "afjda0-943fakd8-fajsdk23-ffasdf3" },
    },
    {
      description: "GET, user, no email 2",
      req: {
        method: "GET",
        query: { user: "fjsadkl-4324-fa3erewio" },
      },
      expectNext: true,
      expectedLocals: { user: "fjsadkl-4324-fa3erewio" },
    },
    {
      description: "GET, user, email 1",
      req: {
        method: "GET",
        query: {
          user: "fjsadkl-4324-fa3erewio",
          email: encodeURIComponent("me@you.com"),
        },
      },
      expectNext: true,
      expectedLocals: {
        user: "fjsadkl-4324-fa3erewio",
        preAuthEmail: "me@you.com",
      },
    },
    {
      description: "GET, no user, email 1",
      req: {
        method: "GET",
        query: {
          email: encodeURIComponent("thing@theother.com"),
        },
      },
      expectNext: true,
      expectedLocals: {
        preAuthEmail: "thing@theother.com",
      },
    },
    {
      description: "GET, no user, no email",
      req: {
        method: "GET",
        body: {},
      },
      expectNext: true,
      expectedLocals: {},
    },
    {
      description: "GET, no body",
      req: {
        method: "GET",
      },
      expectNext: true,
      expectedLocals: {},
    },
    {
      description: "POST, user, no email 1",
      req: {
        method: "POST",
        body: { user: "afjda0-943fakd8-fajsdk23-ffasdf3" },
      },
      expectNext: true,
      expectedLocals: { user: "afjda0-943fakd8-fajsdk23-ffasdf3" },
    },
    {
      description: "POST, user, no email 2",
      req: {
        method: "POST",
        body: { user: "fjsadkl-4324-fa3erewio" },
      },
      expectNext: true,
      expectedLocals: { user: "fjsadkl-4324-fa3erewio" },
    },
    {
      description: "POST, user, email 1",
      req: {
        method: "POST",
        body: {
          user: "fjsadkl-4324-fa3erewio",
          email: encodeURIComponent("me@you.com"),
        },
      },
      expectNext: true,
      expectedLocals: {
        user: "fjsadkl-4324-fa3erewio",
        preAuthEmail: "me@you.com",
      },
    },
    {
      description: "POST, no user, email 1",
      req: {
        method: "POST",
        body: {
          email: encodeURIComponent("me@you.com"),
        },
      },
      expectNext: true,
      expectedLocals: {
        preAuthEmail: "me@you.com",
      },
    },
    {
      description: "POST, no user, no email",
      req: {
        method: "POST",
        body: {},
      },
      expectNext: true,
      expectedLocals: {},
    },
    {
      description: "POST, no body",
      req: {
        method: "POST",
      },
      expectNext: true,
      expectedLocals: {},
    },
  ])("$description", ({ req, expectNext, expectedLocals }) => {
    const res = { locals: {}, send: jest.fn() };
    res.status = jest.fn(() => res);
    const next = jest.fn();
    const middleware = flagAuthedRequests();
    middleware(req, res, next);
    if (expectNext) {
      expect(next).toHaveBeenCalled();
    }
    expect(res.locals).toEqual(expectedLocals);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });
});
