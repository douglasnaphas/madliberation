/* globals expect, jest */
describe("pullTokensFromCookies", () => {
  const pullTokensFromCookies = require("./pullTokensFromCookies");
  test("non-auth request should always next() 1, no cookies", () => {
    const req = {cookies: {}};
    const res = {locals: {}};
    const next = jest.fn();
    const middleware = pullTokensFromCookies();
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });
  test("non-auth request should always next() 2, cookies present", () => {
    const req = {
      cookies: {
        access_token: 'disregarded because res.locals.user is unset',
        refresh_token: 'likewise, disregarded'
      }
    };
    const res = {locals: {}};
    const next = jest.fn();
    const middleware = pullTokensFromCookies();
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });
  test('auth request, no cookies, 401 Bearer realm="access_token"', () => {
    const req = {
      cookies: {}
    };
    const res = {
      locals: {
        user: "the@user.com",
      },
      sendStatus: jest.fn(),
      set: jest.fn()
    };
    const next = jest.fn();
    const middleware = pullTokensFromCookies();
    middleware(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.set).toHaveBeenCalledWith(
      "WWW-Authenticate",
      'Bearer realm="https://passover.lol", ' + 
        'error="missing_token", error_description="no access_token"'
    );
    expect(res.sendStatus).toHaveBeenCalledWith(401);
  });
  test("auth request, refresh_token, no access_token", () => {
    const req = {
      cookies: {"refresh_token": "some.refresh.token=="}
    };
    const res = {
      locals: {
        user: "the@user.com",
      },
      sendStatus: jest.fn(),
      set: jest.fn()
    };
    const next = jest.fn();
    const middleware = pullTokensFromCookies();
    middleware(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.set).toHaveBeenCalledWith(
      "WWW-Authenticate",
      'Bearer realm="https://passover.lol", ' + 
        'error="missing_token", error_description="no access_token"'
    );
    expect(res.sendStatus).toHaveBeenCalledWith(401);
  });
  test.each`
    access_token                       | refresh_token                     | user
    ${"580924fdas.dfaj.JKEID="}        | ${"fJIEKD824fdas.iJK23ID=="}      | ${"good_day@xjf.com"}
    ${"afsdfa580924fdas.Rdfaj.4fEID="} | ${"848f8248fdjakff.ds.iJK23ID=="} | ${"doug@doug.doug"}
    ${"X4325ff2deerew4fas.Rdf.xxIDx"}  | ${undefined} | ${"sufromm@gmail.com"}
    ${"X43243upfdjaeeras.Rdf.MMxfDx"}  | ${undefined} | ${"invalids could still happen here"}
  `("access_token: $access_token, refresh_token: $refresh_token, user: $user",
    ({access_token, refresh_token, user}) => {
    const req = {
      cookies: {access_token, refresh_token}
    };
    const res = {
      locals: {
        user,
      },
      sendStatus: jest.fn(),
      set: jest.fn()
    };
    const next = jest.fn();
    const middleware = pullTokensFromCookies();
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.set).not.toHaveBeenCalled();
    expect(res.sendStatus).not.toHaveBeenCalled();
    expect(res.locals.access_token).toEqual(access_token);
    expect(undefined).toEqual(undefined);
    expect(res.locals.refresh_token).toEqual(refresh_token);
  });
});