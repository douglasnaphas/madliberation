/* globals expect, jest */
describe("getJwksConditionally", () => {
  beforeEach(() => {jest.resetModules();});
  const getJwksConditionally = require("./getJwksConditionally");
  test("mock a user module 1", () => {
    jest.mock('./getMadLnJwksFromAws', () => jest.fn(() => 'xy'));
    const getMadLnJwksFromAws = require("./getMadLnJwksFromAws");
    expect(getMadLnJwksFromAws()).toEqual('xy');
  });
  test("mock a user module 2", () => {
    jest.mock('./getMadLnJwksFromAws', () => jest.fn(() => 'zz'));
    const getMadLnJwksFromAws = require("./getMadLnJwksFromAws");
    expect(getMadLnJwksFromAws()).toEqual('zz');
  });
  test("non-auth request, should not get JWKs", () => {
    const req = {};
    const res = {locals: {}};
    const next = jest.fn();
    const mockGetMadLnJwksFromAws = jest.fn();
    jest.mock('./getMadLnJwksFromAws', () => mockGetMadLnJwksFromAws);
    const getMadLnJwksFromAws = require("./getMadLnJwksFromAws");
    getJwksConditionally(req, res, next);
    expect(mockGetMadLnJwksFromAws).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
  test("auth request, should get JWKs", () => {
    const req = {};
    const res = {locals: {user: "mvji-432-fdsa"}};
    const next = jest.fn();
    const mockKeyFetchingMiddleware = jest.fn();
    const mockGetMadLnJwksFromAws = jest.fn(() => mockKeyFetchingMiddleware);
    jest.mock('./getMadLnJwksFromAws', () => mockGetMadLnJwksFromAws);
    const getMadLnJwksFromAws = require("./getMadLnJwksFromAws");
    getJwksConditionally(req, res, next);
    expect(mockGetMadLnJwksFromAws).toHaveBeenCalled();
    expect(mockKeyFetchingMiddleware).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});