/* globals expect */
const dbParams = require('./dbParamsAssignLibs');
const configs = require('../../Configs');
const schema = require('../../schema');
const responses = require('../../responses');
describe('assignLibsMiddleware/dbParamsAssignLibs', () => {
  const runTest = ({req, res, expectedDbParams, expectNext,
    expect500}) => {
    const middleware = dbParams();
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
      expect(res.locals.assignLibsDbParams).toEqual(expectedDbParams);
    }
    if(expectNext) {
      expect(nextCalled).toBeTruthy();
    }
    if(expect500) {
      expect(sentStatus).toEqual(500);
      expect(sentData).toEqual(responses.SERVER_ERROR);
    }
  };
  test('assign libs to 1 participant', () => {
    const roomCode = 'AABBCC';
    const req = {
      body: {
        roomCode: roomCode
      }
    };
    const res = {
      locals: {
        scriptVersion: 'donotforgetthescriptversion',
        participants: [
          {
            lib_id: 'participant#abcdef0123456789',
            libs: [
              {id: 1, prompt: 'please lib'},
              {id: 2, prompt: 'no example, sentence, or default in this lib'},
              {id: 3, prompt: 'this has all props', sentence: 'You are a _',
               defaultAnswer: 'some default'},
              {id: 4, prompt: 'It will be', sentence: 'tiring as _',
               defaultAnswer: 'to enter all these participants'},
              {id: 5, prompt: 'and libs', sentence: 'but oh _',
               defaultAnswer: 'it must be done'}
            ]
          }
        ]
      }
    };
    const expectedDbParams = [
      {
        TransactItems: [
          {
            Update: {
              TableName: schema.TABLE_NAME,
              Key: {},
              UpdateExpression: 'SET #V = :v',
              ExpressionAttributeNames: {'#V': schema.SCRIPT_VERSION},
              ExpressionAttributeValues: {':v': res.locals.scriptVersion},
              ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
            }
          },
          {
            Update: {
              TableName: schema.TABLE_NAME,
              Key: {},
              UpdateExpression: 'SET #A = :a',
              ExpressionAttributeNames: {'#A': schema.ASSIGNMENTS},
              ExpressionAttributeValues: {':a':
                res.locals.participants[0].libs},
              ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
            }
          }
        ]
      }
    ];
    expectedDbParams[0].TransactItems[0].Update.Key[`${schema.PARTITION_KEY}`] =
      roomCode;
    expectedDbParams[0].TransactItems[0].Update.Key[`${schema.SORT_KEY}`] =
      schema.SEDER_PREFIX;
    expectedDbParams[0].TransactItems[1].Update.Key[`${schema.PARTITION_KEY}`] =
      roomCode;
    expectedDbParams[0].TransactItems[1].Update.Key[`${schema.SORT_KEY}`] =
      res.locals.participants[0].lib_id;
    runTest({
      req: req,
      res: res,
      expectedDbParams: expectedDbParams,
      expectNext: true
    });
  });
  test('assign libs to 1 other participant', () => {
    const roomCode = 'CARCAR';
    const req = {
      body: {
        roomCode: roomCode
      }
    };
    const res = {
      locals: {
        scriptVersion: 'v1abc',
        participants: [
          {
            lib_id: 'participant#fffeee0123456789',
            libs: [
              {id: 1, prompt: 'please lib'},
              {id: 2, prompt: 'no example, sentence, or default in this lib'},
              {id: 3, prompt: 'this has all props', sentence: 'You are a _',
               defaultAnswer: 'some default'},
              {id: 4, prompt: 'It will be', sentence: 'tiring as _',
               defaultAnswer: 'to enter all these participants'},
              {id: 5, prompt: 'and libs', sentence: 'but oh _',
               defaultAnswer: 'it must be done'}
            ]
          }
        ]
      }
    };
    const expectedDbParams = [
      {
        TransactItems: [
          {
            Update: {
              TableName: schema.TABLE_NAME,
              Key: {},
              UpdateExpression: 'SET #V = :v',
              ExpressionAttributeNames: {'#V': schema.SCRIPT_VERSION},
              ExpressionAttributeValues: {':v': res.locals.scriptVersion},
              ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
            }
          },
          {
            Update: {
              TableName: schema.TABLE_NAME,
              Key: {},
              UpdateExpression: 'SET #A = :a',
              ExpressionAttributeNames: {'#A': schema.ASSIGNMENTS},
              ExpressionAttributeValues: {':a':
                res.locals.participants[0].libs},
              ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
            }
          }
        ]
      }
    ];
    expectedDbParams[0].TransactItems[0].Update.Key[`${schema.PARTITION_KEY}`] =
      roomCode;
    expectedDbParams[0].TransactItems[0].Update.Key[`${schema.SORT_KEY}`] =
      schema.SEDER_PREFIX;
    expectedDbParams[0].TransactItems[1].Update.Key[`${schema.PARTITION_KEY}`] =
      roomCode;
    expectedDbParams[0].TransactItems[1].Update.Key[`${schema.SORT_KEY}`] =
      res.locals.participants[0].lib_id;
    runTest({
      req: req,
      res: res,
      expectedDbParams: expectedDbParams,
      expectNext: true
    });
  });
  test('assign libs to multiple participants', () => {});
  test('assign libs to more than 9 participants', () => {
    const roomCode = 'AABBCC';
    const req = {
      body: {
        roomCode: roomCode
      }
    };
    const res = {
      locals: {
        scriptVersion: 'donotforgetthescriptversion',
        participants: [
          {
            lib_id: 'participant#111111111',
            libs: [
              {id: 1, prompt: 'please lib'},
              {id: 2, prompt: 'no example, sentence, or default in this lib'}
            ]
          },
          {
            lib_id: 'participant#2222222222',
            libs: [
              {id: 3, prompt: 'this has all props', sentence: 'You are a _',
               defaultAnswer: 'some default'},
              {id: 4, prompt: 'It will be', sentence: 'tiring as _',
               defaultAnswer: 'to enter all these participants'}
            ]
          },
          {
            lib_id: 'participant#333333333',
            libs: [
              {id: 5, prompt: 'and libs', sentence: 'but oh _',
               defaultAnswer: 'it must be done'},
              {id: 6, prompt: 'six'}
            ]
          },
          {
            lib_id: 'participant#444444444',
            libs: [
              {id: 7, prompt: 'sev'},
              {id: 8, prompt: 'one, I mean eight'}
            ]
          },
          {
            lib_id: 'participant#55555',
            libs: [
              {id: 9, prompt: 'nine'},
              {id: 10, prompt: 'ten'}
            ]
          },
          {
            lib_id: 'participant#666666',
            libs: [
              {id: 11, prompt: 'elves'},
              {id: 12, prompt: 'twelves'}
            ]
          },
          {
            lib_id: 'participant#7777777',
            libs: [
              {id: 13, prompt: 'dirty thirteen'},
              {id: 14, prompt: 'fuerte fourteen'}
            ]
          },
          {
            lib_id: 'participant#8888888',
            libs: [
              {id: 15, prompt: 'nyfty fyftyn'},
              {id: 16, prompt: 'gil faizan'}
            ]
          },
          {
            lib_id: 'participant#9999999',
            libs: [
              {id: 17, prompt: 'seventeen'},
              {id: 18, prompt: 'vote'}
            ]
          },
          {
            lib_id: 'participant#1010101010',
            libs: [
              {id: 19, prompt: 'betes'},
              {id: 20, prompt: 'rachel'},
            ]
          },
          {
            lib_id: 'participant#11e11e11e',
            libs: [
              {id: 21, prompt: 'boats'}
            ]
          },
          {
            lib_id: 'participant#1212121212',
            libs: [
              {id: 22, prompt: 'ships'}
            ]
          }
        ]
      }
    };
    const expectedDbParams = [];
    expectedDbParams.push({
      TransactItems: [
        {
          Update: {
            TableName: schema.TABLE_NAME,
            Key: {},
            UpdateExpression: 'SET #V = :v',
            ExpressionAttributeNames: {'#V': schema.SCRIPT_VERSION},
            ExpressionAttributeValues: {':v': res.locals.scriptVersion},
            ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
          }
        }
      ]
    });
    expectedDbParams[0].TransactItems[0].Update.Key[`${schema.PARTITION_KEY}`]
      = roomCode;
    expectedDbParams[0].TransactItems[0].Update.Key[`${schema.SORT_KEY}`]
      = schema.SEDER_PREFIX;
    const paramsNeeded = 1 + Math.floor(res.locals.participants.length / 10);
      // 1 participant -> 1 params obj; 10 -> 2; 19 -> 2; 20 -> 3
      // 10 TransactItems are allowed per Dynamo transactWrite call
    for(let i = 1; i < paramsNeeded; i++) {
      expectedDbParams.push({TransactItems: []});
    }
    res.locals.participants.forEach((participant, index) => {
      const paramsIndex = Math.floor((index + 1) / 10);
      const updateItem = {
        Update: {
          TableName: schema.TABLE_NAME,
          Key: {},
          UpdateExpression: 'SET #A = :a',
          ExpressionAttributeNames: {'#A': schema.ASSIGNMENTS},
          ExpressionAttributeValues: {':a': participant.libs},
          ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
        }
      };
      updateItem.Update.Key[`${schema.PARTITION_KEY}`] = roomCode;
      updateItem.Update.Key[`${schema.SORT_KEY}`] = participant.lib_id;
      expectedDbParams[paramsIndex].TransactItems.push(updateItem);
    });
    runTest({
      req: req,
      res: res,
      expectedDbParams: expectedDbParams,
      expectNext: true
    });
  });
  test('assign libs to 20 participants', () => {
    const roomCode = 'AABBCC';
    const req = {
      body: {
        roomCode: roomCode
      }
    };
    const res = {
      locals: {
        scriptVersion: 'donotforgetthescriptversion',
        participants: [
          {
            lib_id: 'participant#111111111',
            libs: [
              {id: 1, prompt: 'please lib'},
              {id: 2, prompt: 'no example, sentence, or default in this lib'}
            ]
          },
          {
            lib_id: 'participant#2222222222',
            libs: [
              {id: 3, prompt: 'this has all props', sentence: 'You are a _',
               defaultAnswer: 'some default'},
              {id: 4, prompt: 'It will be', sentence: 'tiring as _',
               defaultAnswer: 'to enter all these participants'}
            ]
          },
          {
            lib_id: 'participant#333333333',
            libs: [
              {id: 5, prompt: 'and libs', sentence: 'but oh _',
               defaultAnswer: 'it must be done'},
              {id: 6, prompt: 'six'}
            ]
          },
          {
            lib_id: 'participant#444444444',
            libs: [
              {id: 7, prompt: 'sev'},
              {id: 8, prompt: 'one, I mean eight'}
            ]
          },
          {
            lib_id: 'participant#55555',
            libs: [
              {id: 9, prompt: 'nine'},
              {id: 10, prompt: 'ten'}
            ]
          },
          {
            lib_id: 'participant#666666',
            libs: [
              {id: 11, prompt: 'elves'},
              {id: 12, prompt: 'twelves'}
            ]
          },
          {
            lib_id: 'participant#7777777',
            libs: [
              {id: 13, prompt: 'dirty thirteen'},
              {id: 14, prompt: 'fuerte fourteen'}
            ]
          },
          {
            lib_id: 'participant#8888888',
            libs: [
              {id: 15, prompt: 'nyfty fyftyn'},
              {id: 16, prompt: 'gil faizan'}
            ]
          },
          {
            lib_id: 'participant#9999999',
            libs: [
              {id: 17, prompt: 'seventeen'},
              {id: 18, prompt: 'vote'}
            ]
          },
          {
            lib_id: 'participant#1010101010',
            libs: [
              {id: 19, prompt: 'betes'},
              {id: 20, prompt: 'rachel'},
            ]
          },
          {
            lib_id: 'participant#11e11e11e',
            libs: [
              {id: 21, prompt: 'boats'}
            ]
          },
          {
            lib_id: 'participant#1212121212',
            libs: [
              {id: 22, prompt: 'ships'}
            ]
          },
          {
            lib_id: 'participant#1313131313',
            libs: [
              {id: 23, prompt: 'shipsies'},
              {id: 24, prompt: 'running'}
            ]
          },
          {
            lib_id: 'participant#1414141414',
            libs: [
              {id: 25, prompt: 'fourteenth'},
              {id: 26, prompt: 'guy of 20'}
            ]
          },
          {
            lib_id: 'participant#1515151515',
            libs: [
              {id: 27, prompt: 'you know'},
              {id: 28, prompt: 'like 15'}
            ]
          },
          {
            lib_id: 'participant#1616161616',
            libs: [
              {id: 29, prompt: 'is fine'},
              {id: 30, prompt: 'any thing'}
            ]
          },
          {
            lib_id: 'participant#1717171717',
            libs: [
              {id: 31, prompt: 'package'},
              {id: 32, prompt: 'that'}
            ]
          },
          {
            lib_id: 'participant#1818181818',
            libs: [
              {id: 33, prompt: 'yum'},
              {id: 34, prompt: 'install'}
            ]
          },
          {
            lib_id: 'participant#1919191919',
            libs: [
              {id: 35, prompt: 'the 19th'},
              {id: 36, prompt: 'shall get the 36th'}
            ]
          },
          {
            lib_id: 'participant#2020202020',
            libs: [
              {id: 37, prompt: 'the 37th'},
              {id: 38, prompt: 'for the 20th'}
            ]
          }
        ]
      }
    };
    const expectedDbParams = [];
    expectedDbParams.push({
      TransactItems: [
        {
          Update: {
            TableName: schema.TABLE_NAME,
            Key: {},
            UpdateExpression: 'SET #V = :v',
            ExpressionAttributeNames: {'#V': schema.SCRIPT_VERSION},
            ExpressionAttributeValues: {':v': res.locals.scriptVersion},
            ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
          }
        }
      ]
    });
    expectedDbParams[0].TransactItems[0].Update.Key[`${schema.PARTITION_KEY}`]
      = roomCode;
    expectedDbParams[0].TransactItems[0].Update.Key[`${schema.SORT_KEY}`]
      = schema.SEDER_PREFIX;
    const paramsNeeded = 1 + Math.floor(res.locals.participants.length / 10);
      // 1 participant -> 1 params obj; 10 -> 2; 19 -> 2; 20 -> 3
      // 10 TransactItems are allowed per Dynamo transactWrite call
    for(let i = 1; i < paramsNeeded; i++) {
      expectedDbParams.push({TransactItems: []});
    }
    res.locals.participants.forEach((participant, index) => {
      const paramsIndex = Math.floor((index + 1) / 10);
      const updateItem = {
        Update: {
          TableName: schema.TABLE_NAME,
          Key: {},
          UpdateExpression: 'SET #A = :a',
          ExpressionAttributeNames: {'#A': schema.ASSIGNMENTS},
          ExpressionAttributeValues: {':a': participant.libs},
          ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
        }
      };
      updateItem.Update.Key[`${schema.PARTITION_KEY}`] = roomCode;
      updateItem.Update.Key[`${schema.SORT_KEY}`] = participant.lib_id;
      expectedDbParams[paramsIndex].TransactItems.push(updateItem);
    });
    runTest({
      req: req,
      res: res,
      expectedDbParams: expectedDbParams,
      expectNext: true
    });
  });
  test('some participants have an empty libs array, skip them', () => {});
  test('some participants have no libs property, skip them', () => {});
  test('some participants have a non-array libs property', () => {});
  test('missing all values in res.locals', () => {
    const roomCode = 'SHLDFL';
    const req = {
      body: {
        roomCode: roomCode
      }
    };
    const res = {
      locals: {
        nothing: 'missing values'
      }
    };
    runTest({
      req: req,
      res: res,
      expect500: true
    });
  });
  test('missing roomCode', () => {
    const req = {
      body: {}
    };
    const res = {
      locals: {
        scriptVersion: 'v1abc',
        participants: [
          {
            lib_id: 'participant#abcdef0123456789',
            libs: [
              {id: 1, prompt: 'please lib'},
              {id: 2, prompt: 'no example, sentence, or default in this lib'}
            ]
          }
        ]
      }
    };
    runTest({
      req: req,
      res: res,
      expect500: true
    });
  });
  test('missing participants in res.locals', () => {
    const roomCode = 'ROOMCO';
    const req = {
      body: {
        roomCode: 'ROOMCO'
      }
    };
    const res = {
      locals: {
        scriptVersion: 'youknowAVersion'
      }
    };
    runTest({
      req: req,
      res: res,
      expect500: true
    });
  });
  test('missing scriptVersion in res.locals', () => {
    const roomCode = 'ROOMCO';
    const req = {
      body: {
        roomCode: 'ROOMCO'
      }
    };
    const res = {
      locals: {
        participants: [
          {
            lib_id: 'participant#abcdef0123456789',
            libs: [
              {id: 1, prompt: 'please lib'},
              {id: 2, prompt: 'no example, sentence, or default in this lib'}
            ]
          }
        ]
      }
    };
    runTest({
      req: req,
      res: res,
      expect500: true
    });
  });
  test('res.locals.participants is not an array, 500', () => {});
  test('res.locals.participants is 0-length, 500', () => {});
});