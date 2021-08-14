/* globals expect */
describe('rosterMiddleware/handleQueryErrors', () => {
  const handleQueryErrors = require('./handleQueryErrors');
  const responses = require('../responses');
  const runTest = ({res, expectNext, expect500}) => {
    const middleware = handleQueryErrors();
    const req = {};
    let statusToSend = 200;
    let sentStatus;
    let nextCalled = false;
    let sentData;
    res.status = (s) => {
      statusToSend = s;
      return {
        send: (data) => {sentStatus = statusToSend; sentData = data;}
      };
    };
    res.send = (data) => {sentStatus = statusToSend; sentData = data;};
    const next = () => {nextCalled = true};
    middleware(req, res, next);
    if(expectNext) {
      expect(nextCalled).toBeTruthy();
    }
    if(expect500) {
      expect(sentStatus).toEqual(500);
      expect(sentData).toEqual(responses.SERVER_ERROR);
    }
  };
  test('no db error, expect next', () => {
    const res = {
      locals: {
        dbError: null,
        dbData: {}
      }
    };
    runTest({res: res, expectNext: true});
  });
  test('truthy error, expect 500', () => {
    const res = {
      locals: {
        dbError: {err: 'there was an error'},
        dbData: {data: 'some data'}
      }
    };
    runTest({res: res, expect500: true});
  });
  test('missing locals, expect 500', () => {
    const res = {
      locals: {
        noDataNoError: 'dbError and dbData are missing'
      }
    };
    runTest({res: res, expect500: true});
  });
  test('array of errors, 500 if any are populated', () => {
    const res = {
      locals: {
        dbError: [null, null, {err: 'some error'}, null],
        dbData: [{data: '1'}, {data: '2'}, null, {data: '3'}]
      }
    };
    runTest({res: res, expect500: true});
  });
  test('array of errors, next if all are falsy', () => {
    const res = {
      locals: {
        dbError: [null, null, null, null],
        dbData: [{data: '1'}, {data: '2'}, {data: '4'}, {data: '3'}]
      }
    };
    runTest({res: res, expectNext: true});
  });
});