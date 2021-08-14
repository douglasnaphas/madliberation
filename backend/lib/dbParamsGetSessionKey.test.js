/* globals expect, jest */
describe('rosterMiddleware/dbParams', () => {
  const dbParamsGetSessionKey = require('./dbParamsGetSessionKey');
  const responses = require('../responses');
  const schema = require('../schema');
  const DbSchema = require('../DbSchema');
  const runTest = ({
    locals,
    expect500,
    expectNext,
    expectedDbParams,
    expect400
  }) => {
    let nextCalled = false;
    let sentData;
    let statusToSend = 200;
    let sentStatus;
    const req = {};
    const res = {
      locals: locals,
      status: (s) => {
        statusToSend = s;
        return {
          send: d => { sentData = d; sentStatus = statusToSend; }
        }
      },
      send: d => { sentData = d; sentStatus = statusToSend; }
    };
    const next = () => { nextCalled = true };
    const middleware = dbParamsGetSessionKey();
    middleware(req, res, next);
    if(expect500) {
      expect(sentStatus).toEqual(500);
      expect(sentData).toEqual(responses.SERVER_ERROR);
    }
    if(expect400) {
      expect(sentStatus).toEqual(400);
      expect(sentData).toEqual(responses.BAD_REQUEST);
    }
    if(expectNext) {
      expect(nextCalled).toBeTruthy();
    }
    if(expectedDbParams) {
      expect(res.locals.dbParamsGetSessionKey).toEqual(expectedDbParams);
    }
  };
  test('should 500 on missing Room Code', () => {
    const locals = {
      gameName: 'game name, but no room code',
      userEmail: 'missingroom@code.com'
    };
    runTest({locals: locals, expect500: true});
  });
  test('should 500 on missing Game Name', () => {
    const locals = {
      roomCode: 'THISIS',
      userEmail: 'nogamename@given.net'
    };
    runTest({locals: locals, expect500: true});
  });
  test('should 400 on missing userEmail', () => {
    const locals = {
      roomCode: 'THESIS',
      gameName: 'writer'
    };
    runTest({locals: locals, expect500: true});
  });
  test('happy path 1', () => {
    const locals = {
      roomCode: 'PROVID',
      gameName: 'Pro Vid',
      userEmail: 'alphabob@brovity.lil'
    };
    const expectedDbParams = {
      ExpressionAttributeNames: {
        '#R': schema.PARTITION_KEY,
        '#L': schema.SORT_KEY,
        '#UE': schema.USER_EMAIL
      },
      ExpressionAttributeValues: {
        ':r': locals.roomCode,
        ':l': DbSchema.sortKeyFromGameName(locals.gameName),
        ':ue': locals.userEmail
      },
      KeyConditionExpression: '#R = :r AND #L = :l',
      ProjectionExpression: schema.SESSION_KEY,
      TableName: schema.TABLE_NAME,
      FilterExpression: '#UE = :ue'
    };
    runTest({locals: locals, expectNext: true, expectedDbParams:
      expectedDbParams});
  });
  test('happy path 2', () => {
    const locals = {
      roomCode: 'ANTIVI',
      gameName: 'Anti Vid',
      userEmail: 'valid@valid.cz'
    };
    const expectedDbParams = {
      ExpressionAttributeNames: {
        '#R': schema.PARTITION_KEY,
        '#L': schema.SORT_KEY,
        '#UE': schema.USER_EMAIL
      },
      ExpressionAttributeValues: {
        ':r': locals.roomCode,
        ':l': DbSchema.sortKeyFromGameName(locals.gameName),
        ':ue': locals.userEmail
      },
      KeyConditionExpression: '#R = :r AND #L = :l',
      ProjectionExpression: schema.SESSION_KEY,
      TableName: schema.TABLE_NAME,
      FilterExpression: '#UE = :ue'
    };
    runTest({locals: locals, expectNext: true, expectedDbParams:
      expectedDbParams});
  });
});