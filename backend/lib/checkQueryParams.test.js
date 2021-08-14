/* globals expect */
const checkQueryParams = require('./checkQueryParams');
const responses = require('../responses');
describe('lib/checkQueryParams', () => {
  const runTest = ({requiredParams, req, expectedStatus, expectedData,
    expectNext}) => {
    const middleware = checkQueryParams(requiredParams);
    let statusToSend = 200;
    let sentStatus;
    let sentData;
    let nextCalled = false;
    const next = () => {nextCalled = true};
    const res = {
      status: s => {
        statusToSend = s;
        return {
          send: d => {sentStatus = statusToSend; sentData = d}
        };
      },
      send: d => {sentStatus = statusToSend; sentData = d}
    };
    middleware(req, res, next);
    if(expectNext) {
      expect(nextCalled).toBeTruthy();
    }
    if(expectedStatus) {
      expect(sentStatus).toEqual(expectedStatus);
    }
    if(expectedData) {
      expect(sentData).toEqual(expectedData);
    }
  };
  test('no required params', () => {
    const req = {query: {}};
    const requiredParams = [];
    runTest({req: req, requiredParams: requiredParams, expectNext: true});
  });
  test('one required param, provided', () => {
    const req = {query: {a: 'ay', b: 'bee'}};
    const requiredParams = ['a'];
    runTest({req: req, requiredParams: requiredParams, expectNext: true});
  });
  test('one required param, missing', () => {
    const req = {query: {b: 'bee'}};
    const requiredParams = ['a'];
    runTest({req: req, requiredParams: requiredParams, expectedStatus: 400,
      expectedData: responses.BAD_REQUEST});
  });
  test('two required params, provided', () => {
    const req = {query: {a: 'ay', b: 'bee'}};
    const requiredParams = ['a', 'b'];
    runTest({req: req, requiredParams: requiredParams, expectNext: true});
  });
  test('three required params, one missing', () => {
    const req = {query: {a: 'ay', b: 'bee'}};
    const requiredParams = ['a', 'b', 'c'];
    runTest({req: req, requiredParams: requiredParams, expectedStatus: 400,
      expectedData: responses.BAD_REQUEST});
  });
  test('misuse of function, expect 500', () => {
    const req = {query: {a: 'ay', b: 'bee'}};
    const requiredParams = 'a';
    runTest({req: req, requiredParams: requiredParams, expectedStatus: 500,
      expectedData: responses.SERVER_ERROR});
  });
});