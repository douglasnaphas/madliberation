/* globals expect, jest */
describe("conditionalMidware", () => {
  const conditionalMidware = require('./conditionalMidware');
  test("condition true", () => {
    const condition = true;
    const middlewareIn = jest.fn();
    const middlewareOut = conditionalMidware(condition, middlewareIn);
    const req = {};
    const res = {};
    const next = jest.fn();
    middlewareOut(req, res, next);
    expect(middlewareIn).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
  test("condition false", () => {
    const condition = false;
    const middlewareIn = jest.fn();
    const middlewareOut = conditionalMidware(condition, middlewareIn);
    const req = {};
    const res = {};
    const next = jest.fn();
    middlewareOut(req, res, next);
    expect(middlewareIn).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});