/* globals expect */
describe('gameNameCookieCheckMidWare/dbParams', () => {
  const dbParams = require('./dbParams');
  const responses = require('../../responses');
  const schema = require('../../schema');
  const DbSchema = require('../../DbSchema');
  const runTest = ({locals, expect500, expectNext, expectedDbParams}) => {
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
    const middleware = dbParams();
    middleware(req, res, next);
    if(expect500) {
      expect(sentStatus).toEqual(500);
      expect(sentData).toEqual(responses.SERVER_ERROR);
    }
    if(expectNext) {
      expect(nextCalled).toBeTruthy();
    }
    if(expectedDbParams) {
      expect(res.locals.gameNameCookieDbParams).toEqual(expectedDbParams);
    }
  };
  test('should 500 on missing Room Code', () => {
    const locals = {
      gameName: 'game name, but no room code'
    };
    runTest({locals: locals, expect500: true});
  });
  test('should 500 on missing Game Name', () => {
    const locals = {
      roomCode: 'THISIS'
    };
    runTest({locals: locals, expect500: true});
  });
  test('happy path 1', () => {
    const locals = {
      roomCode: 'PROVID',
      gameName: 'Pro Vid'
    };
    const expectedDbParams = {
      ExpressionAttributeNames: {
        '#R': schema.PARTITION_KEY,
        '#L': schema.SORT_KEY
      },
      ExpressionAttributeValues: {
        ':r': locals.roomCode,
        ':l': DbSchema.sortKeyFromGameName(locals.gameName)
      },
      KeyConditionExpression: '#R = :r AND #L = :l',
      ProjectionExpression: schema.SESSION_KEY,
      TableName: schema.TABLE_NAME
    };
    runTest({locals: locals, expectNext: true, expectedDbParams:
      expectedDbParams});
  });
  test('happy path 2', () => {
    const locals = {
      roomCode: 'ANTIVI',
      gameName: 'Anti Vid'
    };
    const expectedDbParams = {
      ExpressionAttributeNames: {
        '#R': schema.PARTITION_KEY,
        '#L': schema.SORT_KEY
      },
      ExpressionAttributeValues: {
        ':r': locals.roomCode,
        ':l': DbSchema.sortKeyFromGameName(locals.gameName)
      },
      KeyConditionExpression: '#R = :r AND #L = :l',
      ProjectionExpression: schema.SESSION_KEY,
      TableName: schema.TABLE_NAME
    };
    runTest({locals: locals, expectNext: true, expectedDbParams:
      expectedDbParams});
  });
});