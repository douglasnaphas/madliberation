/* globals expect */
describe('joinSederMiddleware/handleQueryErrors', () => {
  const handleQueryErrors = require('./handleQueryErrors');
  const Configs = require('../../Configs');
  const runTest = ({res, expectNext, expect400, expect500,
    expectedSentData}) => {
    const middleware = handleQueryErrors();
    const req = {};
    let statusToSend = 200;
    let sentStatus;
    let nextCalled = false;
    let sentData;
    res.status = (s) => {
      statusToSend = s;
      return {
        send: (data) => { 
          sentStatus = statusToSend;
          sentData = data;
        }
      };
    };
    res.send = (data) => {
      sentStatus = statusToSend
      sentData = data;
    };
    const next = () => { nextCalled = true };
    middleware(req, res, next);
    if(expectNext) {
      expect(nextCalled).toBeTruthy();
    }
    if(expect400) {
      expect(sentStatus).toEqual(400);
    }
    if(expect500) {
      expect(sentStatus).toEqual(500);
    }
    if(expectedSentData) {
      expect(sentData).toEqual(expectedSentData);
    }
  };
  test('non-existent or expired room code', () => {
    const err = {
      code: "TransactionCanceledException",
      message: "Transaction cancelled, please refer cancellation reasons for " +
        "specific reasons [ConditionalCheckFailed, None]",
      requestId: "MEKVJH3BLLIL0KPTI1T5MBDV2JVV4KQNSO5AEMVJF66Q9ASUAAJG",
      retryDelay: 2.4935025354027585,
      retryable: false,
      statusCode: 400,
      time: "2019-02-17T12:43:55.719Z"
    };
    const res = {
      locals: {
        dbError: err,
        dbData: null
      }
    };
    runTest({
      res: res,
      expect400: true,
      expectedSentData: {err: 'Either that Room Code does not exist, or it' +
        ' has expired, or the person who started the seder confirmed that ' +
        'everyone had joined. Room Codes expire after ' +
        Configs.msToJoinSeder() / 1000 / 60 + ' minutes'}
    });
  });
  test('game name taken', () => {
    const err = {
      code: "TransactionCanceledException",
      message: "Transaction cancelled, please refer cancellation reasons for " +
        "specific reasons [None, ConditionalCheckFailed]",
      requestId: "MEKVJH3BLLIL0KPTI1T5MBDV2JVV4KQNSO5AEMVJF66Q9ASUAAJG",
      retryDelay: 2.4935025354027585,
      retryable: false,
      statusCode: 400,
      time: "2019-02-17T12:43:55.719Z"
    };
    const res = {
      locals: {
        dbError: err,
        dbData: null
      }
    };
    runTest({
      res: res,
      expect400: true,
      expectedSentData: {err: 'That Game Name is taken for this seder, please' +
        ' try another Game Name or find the person who took it and steal ' +
        'their phone'}
    });
  });
  test('DynamoDB error message not formatted how we expect', () => {
    const err = {
      code: "TransactionCanceledException",
      message: "Error message using braces not brackets {None, " + 
        "ConditionalCheckFailed}",
      requestId: "MEKVJH3BLLIL0KPTI1T5MBDV2JVV4KQNSO5AEMVJF66Q9ASUAAJG",
      retryDelay: 2.4935025354027585,
      retryable: false,
      statusCode: 400,
      time: "2019-02-17T12:43:55.719Z"
    };
    const res = {
      locals: {
        dbError: err,
        dbData: null
      }
    };
    runTest({
      res: res,
      expect500: true,
      expectedSentData: {err: 'We could not join you to this ' +
      'seder, please double-check your Room Code, make sure it is not more' +
      ' than ' + Configs.msToJoinSeder() / 1000 / 60 + ' minutes old, and ' +
      'try again, or try a different Game Name or with a different browser' +
      ' or device'}
    });
  });
  test('no db errors', () => {
    const res = {
      locals: {
        dbError: null,
        dbData: {}
      }
    };
    runTest({
      res: res,
      expectNext: true,
    });
  });
});