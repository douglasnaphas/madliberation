const generateOpaqueCookie = require("./generateOpaqueCookie");
const defaultRandomCapGenerator = require("./randomCapGenerator");
let res;
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
    middleware({}, res);
    expect(res.locals.opaqueCookie).toEqual(expectedCode);
  });
  test("successfully generated cookie should be saved 2", () => {
    const expectedCode = "DOUGEFGHIJKLMBBBQRSTUVWXYZDOUG";
    const randomCapGenerator = function* () {
      yield expectedCode;
    };
    const middleware = generateOpaqueCookie({ randomCapGenerator });
    middleware({}, res);
    expect(res.locals.opaqueCookie).toEqual(expectedCode);
  });
  test("cookie should be the right size", () => {
    const middleware = generateOpaqueCookie({
      randomCapGenerator: defaultRandomCapGenerator,
    });
    middleware({}, res);
    const EXPECTED_OPAQUE_COOKIE_SIZE = 30;
    expect(res.locals.opaqueCookie.length).toEqual(EXPECTED_OPAQUE_COOKIE_SIZE);
  });
  test("cookies should not collide, same generator", () => {
    const A_FEW_TIMES = 5;
    const cookies = new Set();
    const singleGenerator = require("./randomCapGenerator");
    const middleware = generateOpaqueCookie({
      randomCapGenerator: singleGenerator,
    });
    for (let i = 0; i < A_FEW_TIMES; i++) {
      middleware({}, res);
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
      middleware({}, res);
      cookies.add(res.locals.opaqueCookie);
    }
    expect(cookies.size).toEqual(A_FEW_TIMES);
  });
});
