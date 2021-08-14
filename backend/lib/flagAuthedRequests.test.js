/* globals expect, jest */
describe('lib/flagAuthedRequests', () => {
  const flagAuthedRequests = require('./flagAuthedRequests');
  const responses = require('../responses');
  describe('GET requests', () => {
    test('no user param, expect next', () => {
      const req = {method: 'GET', query: {}};
      const send = jest.fn();
      const res = {locals: {}, status: jest.fn(() => ({send}))};
      const next = jest.fn();
      const middleware = flagAuthedRequests();
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(send).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.locals.user).toBeUndefined();
    });
    test('email provided 1', () => {
      const req = {
        method: 'GET',
        query: {user: 'afjda0-943fakd8-fajsdk23-ffasdf3'}
      };
      const send = jest.fn();
      const res = {locals: {}, status: jest.fn(() => ({send}))};
      const next = jest.fn();
      const middleware = flagAuthedRequests();
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(send).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.locals.user).toEqual(req.query.user);
    });
    test('email provided 2', () => {
      const req = {
        method: 'GET',
        query: {user: 'fjsadkl-4324-fa3erewio'}
      };
      const send = jest.fn();
      const res = {locals: {}, status: jest.fn(() => ({send}))};
      const next = jest.fn();
      const middleware = flagAuthedRequests();
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(send).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.locals.user).toEqual(req.query.user);
    });
    test('bad email provided, should be accepted here', () => {
      const req = {
        method: 'GET',
        query: {user: 'even odd subs are accepted, they just have to' +
        ' be strings'
      }};
      const send = jest.fn();
      const res = {locals: {}, status: jest.fn(() => ({send}))};
      const next = jest.fn();
      const middleware = flagAuthedRequests();
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(send).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.locals.user).toEqual(req.query.user);
    });
  });
  describe('POST requests', () => {
    test('no user param, expect next', () => {
      const req = {method: 'POST', body: {}};
      const send = jest.fn();
      const res = {locals: {}, status: jest.fn(() => ({send}))};
      const next = jest.fn();
      const middleware = flagAuthedRequests();
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(send).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.locals.user).toBeUndefined();
    });
    test('email provided 1', () => {
      const req = {
        method: 'POST',
        body: {user: 'afjda0-943fakd8-fajsdk23-ffasdf3'}
      };
      const send = jest.fn();
      const res = {locals: {}, status: jest.fn(() => ({send}))};
      const next = jest.fn();
      const middleware = flagAuthedRequests();
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(send).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.locals.user).toEqual(req.body.user);
    });
    test('email provided 2', () => {
      const req = {
        method: 'POST',
        body: {user: 'fjsadkl-4324-fa3erewio'}
      };
      const send = jest.fn();
      const res = {locals: {}, status: jest.fn(() => ({send}))};
      const next = jest.fn();
      const middleware = flagAuthedRequests();
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(send).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.locals.user).toEqual(req.body.user);
    });
    test('bad email provided, should be accepted here', () => {
      const req = {
        method: 'POST',
        body: {user: 'even odd subs are accepted, they just have to' +
        ' be strings'
      }};
      const send = jest.fn();
      const res = {locals: {}, status: jest.fn(() => ({send}))};
      const next = jest.fn();
      const middleware = flagAuthedRequests();
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(send).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.locals.user).toEqual(req.body.user);
    });
  });
});