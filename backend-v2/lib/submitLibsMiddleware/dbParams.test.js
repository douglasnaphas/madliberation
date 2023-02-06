/* globals expect */
const dbParams = require('./dbParams');
const configs = require('../../Configs');
const schema = require('../../schema');
const responses = require('../../responses');
const DbSchema = require('../../DbSchema');
describe('submitLibsMiddleware/dbParams', () => {
  const runTest = ({body, expectedDbParams, expectNext,
    expect500, expectedStatus, expectedData}) => {
    const middleware = dbParams();
    const req = {
      body: body
    };
    let nextCalled = false;
    let statusToSend = 200;
    let sentStatus;
    let sentData;
    const next = () => { nextCalled = true };
    const res = {locals:{}};
    res.status = (s) => {
      statusToSend = s;
      return {
        send: (d) => { sentStatus = statusToSend; sentData = d; }
      };
    };
    res.send = (d) => { sentStatus = statusToSend; sentData = d; };
    middleware(req, res, next);
    if(expectedDbParams) {
      expect(res.locals.submitLibsDbParams).toEqual(expectedDbParams);
    }
    if(expectNext) {
      expect(nextCalled).toBeTruthy();
    }
    if(expect500) {
      expect(sentStatus).toEqual(500);
      expect(sentData).toEqual(responses.SERVER_ERROR);
    }
    if(expectedStatus) {
      expect(sentStatus).toEqual(expectedStatus);
    }
    if(expectedData) {
      expect(sentData).toEqual(expectedData);
    }
  };
  test('happy path 1', () => {
    const body = {
      roomCode: 'AABBCC',
      gameName: 'me',
      answers: [
        {id: 4, answer: 'the fourth'},
        {id: 8, answer: 'the orth'},
        {id: 9, answer: 'the north'}
      ]
    };
    const expectedDbParams = {
      TransactItems: [
        {
          Update: {
            TableName: schema.TABLE_NAME,
            Key: {},
            UpdateExpression: 'SET #A = :a',
            ExpressionAttributeNames: {'#A': schema.ANSWERS},
            ExpressionAttributeValues: {':a': body.answers},
            ConditionExpression: 'attribute_exists(' + schema.ASSIGNMENTS + ')',
            ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
          }
        }
      ]
    };
    expectedDbParams.TransactItems[0].Update.Key[`${schema.PARTITION_KEY}`] =
      body.roomCode;
    expectedDbParams.TransactItems[0].Update.Key[`${schema.SORT_KEY}`] =
      DbSchema.sortKeyFromGameName(body.gameName);
    runTest({
      body: body,
      expectedDbParams: expectedDbParams,
      expectNext: true
    });
  });
  test('happy path 2', () => {
    const body = {
      roomCode: 'CARCAR',
      gameName: 'someone else',
      answers: [
        {id: 14, answer: 'the filth'},
        {id: 81, answer: 'the wealth'},
        {id: 19, answer: 'the hearth'}
      ]
    };
    const expectedDbParams = {
      TransactItems: [
        {
          Update: {
            TableName: schema.TABLE_NAME,
            Key: {},
            UpdateExpression: 'SET #A = :a',
            ExpressionAttributeNames: {'#A': schema.ANSWERS},
            ExpressionAttributeValues: {':a': body.answers},
            ConditionExpression: 'attribute_exists(' + schema.ASSIGNMENTS + ')',
            ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
          }
        }
      ]
    };
    expectedDbParams.TransactItems[0].Update.Key[`${schema.PARTITION_KEY}`] =
      body.roomCode;
    expectedDbParams.TransactItems[0].Update.Key[`${schema.SORT_KEY}`] =
      DbSchema.sortKeyFromGameName(body.gameName);
    runTest({
      body: body,
      expectedDbParams: expectedDbParams,
      expectNext: true
    });
  });
  test('missing roomCode in req.body', () => {
    const body = {
      noRoomCode: 'note there is no room code',
      gameName: 'my',
      answers: [
        {id: 6, answer: 'the missing'},
        {id: 44},
        {id: 3, answer: 'hissith'}
      ]
    };
    runTest({
      body: body,
      expectedStatus: 400,
      expectedData: responses.BAD_REQUEST
    });
  });
  test('missing answers in req.body', () => {
    const body = {
      roomCode: 'SOMECO',
      gameName: 'some name is present',
      noAnswers: 'answers not in this body'
    }
    runTest({
      body: body,
      expectedStatus: 400,
      expectedData: responses.BAD_REQUEST
    });
  });
  test('missing gameName', () => {
    const body = {
      roomCode: 'SOMECO',
      answers: ['we have answers', 'but no gameName']
    }
    runTest({
      body: body,
      expectedStatus: 400,
      expectedData: responses.BAD_REQUEST
    });
  });
});