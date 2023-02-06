/* globals expect */
const dbParams = require('./dbParams');
const configs = require('../../Configs');
const schema = require('../../schema');
const responses = require('../../responses');
describe('closeSederMiddleware/dbParams', () => {
  const runTest = ({res, expectedDbParams, expectNext,
    expect500}) => {
    const middleware = dbParams();
    const req = {};
    let nextCalled = false;
    let statusToSend = 200;
    let sentStatus;
    let sentData;
    const next = () => { nextCalled = true };
    res.status = (s) => {
      statusToSend = s;
      return {
        send: (d) => { sentStatus = statusToSend; sentData = d; }
      };
    };
    res.send = (d) => { sentStatus = statusToSend; sentData = d; };
    middleware(req, res, next);
    if(expectedDbParams) {
      expect(res.locals.closeSederDbParams).toEqual(expectedDbParams);
    }
    if(expectNext) {
      expect(nextCalled).toBeTruthy();
    }
    if(expect500) {
      expect(sentStatus).toEqual(500);
      expect(sentData).toEqual(responses.SERVER_ERROR);
    }
  };
  test('happy path 1', () => {
    const res = {
      locals: {
        roomCode: 'AABBCC'
      }
    };
    const expectedDbParams = {
      TransactItems: [
        {
          Update: {
            TableName: schema.TABLE_NAME,
            Key: {},
            UpdateExpression: 'SET #C = :t',
            ExpressionAttributeNames: {'#C': schema.CLOSED},
            ExpressionAttributeValues: {':t': true},
            ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
          }
        }
      ]
    };
    expectedDbParams.TransactItems[0].Update.Key[`${schema.PARTITION_KEY}`] =
      res.locals.roomCode;
    expectedDbParams.TransactItems[0].Update.Key[`${schema.SORT_KEY}`] =
      schema.SEDER_PREFIX;
    runTest({
      res: res,
      expectedDbParams: expectedDbParams,
      expectNext: true
    });
  });
  test('happy path 2', () => {
    const res = {
      locals: {
        roomCode: 'CARCAR'
      }
    };
    const expectedDbParams = {
      TransactItems: [
        {
          Update: {
            TableName: schema.TABLE_NAME,
            Key: {},
            UpdateExpression: 'SET #C = :t',
            ExpressionAttributeNames: {'#C': schema.CLOSED},
            ExpressionAttributeValues: {':t': true},
            ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
          }
        }
      ]
    };
    expectedDbParams.TransactItems[0].Update.Key[`${schema.PARTITION_KEY}`] =
      res.locals.roomCode;
    expectedDbParams.TransactItems[0].Update.Key[`${schema.SORT_KEY}`] =
      schema.SEDER_PREFIX;
    runTest({
      res: res,
      expectedDbParams: expectedDbParams,
      expectNext: true
    });
  });
  test('missing values in res.locals', () => {
    const res = {
      locals: {
        nothing: 'missing values'
      }
    };
    runTest({
      res: res,
      expect500: true
    });
  });
});