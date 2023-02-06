const generateOpaqueCookie = require("./generateOpaqueCookie");
const defaultRandomCapGenerator = require("./randomCapGenerator");
const Configs = require("../Configs");
let res;
const FAKE_TIME = new Date(2022, 3 /* April, 0 is January */, 15, 19);
beforeAll(() => {
  jest.useFakeTimers("modern");
  jest.setSystemTime(FAKE_TIME);
});
afterAll(() => {
  jest.useRealTimers();
});
beforeEach(() => {
  res = { locals: {} };
});
describe("generateOpaqueCookie", () => {
  test("successfully generated cookie should be saved", () => {
    const expectedCode = "ABCDEFGHIJKLMNOPQRSTUVWXYZABCD";
    const randomCapGenerator = function* () {
      yield expectedCode;
    };
    const middleware = generateOpaqueCookie({ randomCapGenerator });
    middleware({}, res, () => {});
    expect(res.locals.opaqueCookie).toEqual(expectedCode);
  });
  test("successfully generated cookie should be saved 2", () => {
    const expectedCode = "DOUGEFGHIJKLMBBBQRSTUVWXYZDOUG";
    const randomCapGenerator = function* () {
      yield expectedCode;
    };
    const middleware = generateOpaqueCookie({ randomCapGenerator });
    middleware({}, res, () => {});
    expect(res.locals.opaqueCookie).toEqual(expectedCode);
  });
  test("next should be called on success", () => {
    const expectedCode = "DOUGEFGHIJKLMBBBQRSTUVWXYZDOUG";
    const randomCapGenerator = function* () {
      yield expectedCode;
    };
    const middleware = generateOpaqueCookie({ randomCapGenerator });
    const next = jest.fn();
    middleware({}, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });
  test("cookie should be the right size", () => {
    const middleware = generateOpaqueCookie({
      randomCapGenerator: defaultRandomCapGenerator,
    });
    middleware({}, res, () => {});
    const EXPECTED_OPAQUE_COOKIE_SIZE = 30;
    expect(res.locals.opaqueCookie.length).toEqual(EXPECTED_OPAQUE_COOKIE_SIZE);
  });
  test("res.locals.opaqueCookieIssuedDate should be the right date", () => {
    const middleware = generateOpaqueCookie({
      randomCapGenerator: defaultRandomCapGenerator,
    });
    middleware({}, res, () => {});
    expect(res.locals.opaqueCookieIssuedDate).toEqual(FAKE_TIME.toISOString());
  });
  test("res.locals.opaqueCookieIssuedMs should be the right ms", () => {
    const middleware = generateOpaqueCookie({
      randomCapGenerator: defaultRandomCapGenerator,
    });
    middleware({}, res, () => {});
    expect(res.locals.opaqueCookieIssuedMs).toEqual(FAKE_TIME.getTime());
  });
  test("res.locals.opaqueCookieExpirationDate should be the right date", () => {
    const middleware = generateOpaqueCookie({
      randomCapGenerator: defaultRandomCapGenerator,
    });
    middleware({}, res, () => {});
    expect(res.locals.opaqueCookieExpirationDate).toEqual(
      Configs.loginCookieExpirationDate(FAKE_TIME).toISOString()
    );
  });
  test("res.locals.opaqueCookieExpirationMs should be the right ms", () => {
    const middleware = generateOpaqueCookie({
      randomCapGenerator: defaultRandomCapGenerator,
    });
    middleware({}, res, () => {});
    expect(res.locals.opaqueCookieExpirationMs).toEqual(
      Configs.loginCookieExpirationDate(FAKE_TIME).getTime()
    );
  });

  test("cookies should not collide, same generator", () => {
    const A_FEW_TIMES = 5;
    const cookies = new Set();
    const singleGenerator = require("./randomCapGenerator");
    const middleware = generateOpaqueCookie({
      randomCapGenerator: singleGenerator,
    });
    for (let i = 0; i < A_FEW_TIMES; i++) {
      middleware({}, res, () => {});
      cookies.add(res.locals.opaqueCookie);
    }
    expect(cookies.size).toEqual(A_FEW_TIMES);
  });
  test("cookies should not collide, new generator each request", () => {
    const A_FEW_TIMES = 5;
    const cookies = new Set();

    for (let i = 0; i < A_FEW_TIMES; i++) {
      const generator = require("./randomCapGenerator");
      const middleware = generateOpaqueCookie({
        randomCapGenerator: generator,
      });
      middleware({}, res, () => {});
      cookies.add(res.locals.opaqueCookie);
    }
    expect(cookies.size).toEqual(A_FEW_TIMES);
  });
});
