const validateQueryCode = require("./validateQueryCode");
describe("validateQueryCode", () => {
  const runTest = (code, expectedStatus, expectNext) => {
    const req = { query: { code } };

    const res = { status: jest.fn(), send: jest.fn(), sendStatus: jest.fn() };
    const next = jest.fn();
    const middleware = validateQueryCode;
    middleware(req, res, next);
    expect(
      res.send.mock.calls.length +
        res.sendStatus.mock.calls.length +
        next.mock.calls.length
    ).toEqual(1);
    if (expectedStatus) {
      expect(
        (res.status.mock.calls && res.status.mock.calls.length) ||
          (res.sendStatus.mock.calls && res.sendStatus.mock.calls.length)
      ).toBeTruthy();
      expect(
        res.send.mock.calls.length + res.sendStatus.mock.calls.length
      ).toEqual(1);
      expect(
        (res.status.mock.calls.length === 1 &&
          res.send.mock.calls.length === 1 &&
          res.status.mock.calls[0][0] === expectedStatus &&
          res.sendStatus.mock.calls.length === 0) ||
          (res.sendStatus.mock.calls.length === 1 &&
            res.sendStatus.mock.calls[0][0] === expectedStatus &&
            res.send.mock.calls.length === 0)
      ).toBeTruthy();
    }
    if (expectNext) {
      expect(next).toHaveBeenCalled();
    }
  };
  // code is not a string
  test.each`
    code
    ${true}
  `("non-string code=$1", ({ code }) => {
    runTest(code, 400, false);
  });
  // code has non-whitelisted characters -> 400
  test.each([["abcd-efg;a"], [";"], ["#"]])("invalid string code=%s", code => {
    runTest(code, 400, false);
  });
  // code is valid
  test.each([["abcd-efg-hij-klmnopqr-stu"], ["-ab832-afdjk-eiHafaH-2390-AA"]])(
    "valid code=%s",
    code => {
      runTest(code, false, true);
    }
  );
});
