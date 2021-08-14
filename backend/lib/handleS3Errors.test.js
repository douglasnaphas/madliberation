/* globals expect */
describe('assignLibsMiddleware/handleS3Errors', () => {
  const handleS3Errors = require('./handleS3Errors');
  const responses = require('../responses');
  const runTest = ({res, expectNext, expect500}) => {
    const middleware = handleS3Errors();
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
  test('no s3 error, expect next', () => {
    const res = {
      locals: {
        s3Error: null,
        s3Data: {}
      }
    };
    runTest({res: res, expectNext: true});
  });
  test('truthy error, expect 500', () => {
    const res = {
      locals: {
        s3Error: {err: 'there was an error'},
        s3Data: {data: 'some data'}
      }
    };
    runTest({res: res, expect500: true});
  });
  test('missing locals, expect 500', () => {
    const res = {
      locals: {
        noS3NoError: 's3Error and s3Data are missing'
      }
    };
    runTest({res: res, expect500: true});
  });
});