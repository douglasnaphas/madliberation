/* globals expect */
const dbParams = require('./dbParams');
const Configs = require('../../Configs');
const schema = require('../../schema');
const responses = require('../../responses');
describe('joinSederMiddleware/dbParams', () => {
  const defaultDate = new Date();
  const responses = require('../../responses');
  const runTest = ({now, configs, req, res, expectedDbParams, expectNext,
    expect500}) => {
    now = now || defaultDate;
    configs = configs || Configs;
    const middleware = dbParams(now, configs);
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
      expect(res.locals.joinSederDbParams).toEqual(expectedDbParams);
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
    const req = {
      body: {
        roomCode: 'AABBCC',
        gameName: 'me for the game'
      }
    };
    const res = {
      locals: {
        gameNameSessionKey: 'RANDOMSTRINGOFLETTERS',
        gameNameHash: 'def321'
      }
    };
    const minCreated = defaultDate.getTime() - Configs.msToJoinSeder();
    const expectedDbParams = {
      TransactItems: [
        {
          ConditionCheck: {
            ConditionExpression: 'attribute_exists(room_code) AND #C > :mc' + 
              ' AND attribute_not_exists(closed)',
            Key: {},
            TableName: schema.TABLE_NAME,
            ReturnValuesOnConditionCheckFailure: 'ALL_OLD',
            ExpressionAttributeNames: {
              '#C': schema.CREATED
            },
            ExpressionAttributeValues: {
              ':mc': minCreated
            }
          }
        },
        {
          Put: {
            Item: {},
            ConditionExpression: 'attribute_not_exists(room_code) AND ' +
              'attribute_not_exists(lib_id)',
            TableName: schema.TABLE_NAME,
            ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
          }
        }
      ]
    };
    expectedDbParams.TransactItems[0].ConditionCheck.Key
      [`${schema.PARTITION_KEY}`] = req.body.roomCode;
    expectedDbParams.TransactItems[0].ConditionCheck.Key
      [`${schema.SORT_KEY}`] = schema.SEDER_PREFIX;
    expectedDbParams.TransactItems[1].Put.Item
      [`${schema.PARTITION_KEY}`] = req.body.roomCode;
    expectedDbParams.TransactItems[1].Put.Item
      [`${schema.SORT_KEY}`] = schema.PARTICIPANT_PREFIX + schema.SEPARATOR + 
      res.locals.gameNameHash;
    expectedDbParams.TransactItems[1].Put.Item
      [`${schema.SESSION_KEY}`] = res.locals.gameNameSessionKey;
    expectedDbParams.TransactItems[1].Put.Item
      [`${schema.GAME_NAME}`] = req.body.gameName;
    runTest({
      now: defaultDate,
      configs: Configs,
      req: req,
      res: res,
      expectedDbParams: expectedDbParams,
      expectNext: true
    });
  });
  test('happy path 2', () => {
    const req = {
      body: {
        roomCode: 'XXBBCC',
        gameName: 'different name'
      }
    };
    const res = {
      locals: {
        gameNameSessionKey: 'DIFFERENTLETTERS',
        gameNameHash:'abc123'
      }
    };
    const minCreated = defaultDate.getTime() - Configs.msToJoinSeder();
    const expectedDbParams = {
      TransactItems: [
        {
          ConditionCheck: {
            ConditionExpression: 'attribute_exists(room_code) AND #C > :mc' +
              ' AND attribute_not_exists(closed)',
            Key: {},
            TableName: schema.TABLE_NAME,
            ReturnValuesOnConditionCheckFailure: 'ALL_OLD',
            ExpressionAttributeNames: {
              '#C': schema.CREATED
            },
            ExpressionAttributeValues: {
              ':mc': minCreated
            }
          }
        },
        {
          Put: {
            Item: {},
            ConditionExpression: 'attribute_not_exists(room_code) AND ' +
              'attribute_not_exists(lib_id)',
            TableName: schema.TABLE_NAME,
            ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
          }
        }
      ]
    };
    expectedDbParams.TransactItems[0].ConditionCheck.Key
      [`${schema.PARTITION_KEY}`] = req.body.roomCode;
    expectedDbParams.TransactItems[0].ConditionCheck.Key
      [`${schema.SORT_KEY}`] = schema.SEDER_PREFIX;
    expectedDbParams.TransactItems[1].Put.Item
      [`${schema.PARTITION_KEY}`] = req.body.roomCode;
    expectedDbParams.TransactItems[1].Put.Item
      [`${schema.SORT_KEY}`] = schema.PARTICIPANT_PREFIX + schema.SEPARATOR + 
      res.locals.gameNameHash;
    expectedDbParams.TransactItems[1].Put.Item
      [`${schema.SESSION_KEY}`] = res.locals.gameNameSessionKey;
    expectedDbParams.TransactItems[1].Put.Item
      [`${schema.GAME_NAME}`] = req.body.gameName;
    runTest({
      now: defaultDate,
      configs: Configs,
      req: req,
      res: res,
      expectedDbParams: expectedDbParams,
      expectNext: true
    });
  });
  test('happy path 3: userEmail present (authenticated user)', () => {
    const req = {
      body: {
        roomCode: 'USEREM',
        gameName: 'User With Email'
      }
    };
    const res = {
      locals: {
        gameNameSessionKey: 'ELSEWHERETHISWILLNEEDTOBEREISSUED',
        gameNameHash:'xyz456xyz987abc',
        userEmail: 'pyllandafee@squill.com'
      }
    };
    const minCreated = defaultDate.getTime() - Configs.msToJoinSeder();
    const expectedDbParams = {
      TransactItems: [
        {
          ConditionCheck: {
            ConditionExpression: 'attribute_exists(room_code) AND #C > :mc' +
              ' AND attribute_not_exists(closed)',
            Key: {},
            TableName: schema.TABLE_NAME,
            ReturnValuesOnConditionCheckFailure: 'ALL_OLD',
            ExpressionAttributeNames: {
              '#C': schema.CREATED
            },
            ExpressionAttributeValues: {
              ':mc': minCreated
            }
          }
        },
        {
          Put: {
            Item: {},
            ConditionExpression: 'attribute_not_exists(room_code) AND ' +
              'attribute_not_exists(lib_id)',
            TableName: schema.TABLE_NAME,
            ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
          }
        }
      ]
    };
    expectedDbParams.TransactItems[0].ConditionCheck.Key
      [`${schema.PARTITION_KEY}`] = req.body.roomCode;
    expectedDbParams.TransactItems[0].ConditionCheck.Key
      [`${schema.SORT_KEY}`] = schema.SEDER_PREFIX;
    expectedDbParams.TransactItems[1].Put.Item
      [`${schema.PARTITION_KEY}`] = req.body.roomCode;
    expectedDbParams.TransactItems[1].Put.Item
      [`${schema.SORT_KEY}`] = schema.PARTICIPANT_PREFIX + schema.SEPARATOR + 
      res.locals.gameNameHash;
    expectedDbParams.TransactItems[1].Put.Item
      [`${schema.SESSION_KEY}`] = res.locals.gameNameSessionKey;
    expectedDbParams.TransactItems[1].Put.Item
      [`${schema.GAME_NAME}`] = req.body.gameName;
    expectedDbParams.TransactItems[1].Put.Item
      [`${schema.USER_EMAIL}`] = res.locals.userEmail;
    runTest({
      now: defaultDate,
      configs: Configs,
      req: req,
      res: res,
      expectedDbParams: expectedDbParams,
      expectNext: true
    });
  });
  test('missing values in res.locals', () => {
    const req = {
      body: {
        roomCode: 'AABBCC',
        gameName: 'me for the game'
      }
    };
    const res = {
      locals: {
        nothing: 'missing values'
      }
    };
    const minCreated = defaultDate.getTime() - Configs.msToJoinSeder();
    runTest({
      now: defaultDate,
      configs: Configs,
      req: req,
      res: res,
      expect500: true
    });
  });
  test('missing values in req.body', () => {
    const req = {
      body: {}
    };
    const res = {
      locals: {
        gameNameSessionKey: 'DIFFERENTLETTERS',
        gameNameHash:'abc123'
      }
    };
    const minCreated = defaultDate.getTime() - Configs.msToJoinSeder();
    runTest({
      now: defaultDate,
      configs: Configs,
      req: req,
      res: res,
      expect500: true
    });
  });
});