/* globals expect */
describe('assignmentsMiddleware/dbParams', () => {
  const dbParams = require('./dbParams');
  const responses = require('../../responses');
  const schema = require('../../schema');
  const DbSchema = require('../../DbSchema');
  const runTest = ({req, expect500, expectNext, expectedDbParams, expect400
    }) => {
    let nextCalled = false;
    let sentData;
    let statusToSend = 200;
    let sentStatus;
    const res = {
      locals: {},
      status: (s) => {
        statusToSend = s;
        return {
          send: d => { sentData = d; sentStatus = statusToSend; }
        };
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
    if(expect400) {
      expect(sentStatus).toEqual(400);
      expect(sentData).toEqual(responses.BAD_REQUEST);
    }
    if(expectNext) {
      expect(nextCalled).toBeTruthy();
    }
    if(expectedDbParams) {
      expect(res.locals.assigmentsDbParams).toEqual(expectedDbParams);
    }
  };
  test('should 400 on missing Room Code', () => {
    const req = {
      query: {
        gamename: encodeURI('but no room code')
      }
    };
    runTest({req: req, expect400: true});
  });
  test('should 400 on missing Game Name', () => {
    const req = {
      query: {
        roomcode: 'NONAME'
      }
    };
    runTest({req: req, expect400: true});
  });
  test('happy path 1', () => {
    const roomCode = 'PROVID';
    const gameName = 'provi dad';
    const req = {
      query: {
        roomcode: roomCode,
        gamename: encodeURI(gameName)
      }
    };
    const expectedDbParams = {
      ExpressionAttributeNames: {
        '#R': schema.PARTITION_KEY,
        '#L': schema.SORT_KEY
      },
      ExpressionAttributeValues: {
        ':r': roomCode,
        ':l': DbSchema.sortKeyFromGameName(gameName)
      },
      KeyConditionExpression: '#R = :r AND #L = :l',
      ProjectionExpression: schema.ASSIGNMENTS,
      TableName: schema.TABLE_NAME
    };
    runTest({req: req, expectNext: true, expectedDbParams: expectedDbParams});
  });
  test('happy path 2', () => {
    const roomCode = 'ALSOPR';
    const gameName = 'all so PR';
    const req = {
      query: {
        roomcode: roomCode,
        gamename: encodeURI(gameName)
      }
    };
    const expectedDbParams = {
      ExpressionAttributeNames: {
        '#R': schema.PARTITION_KEY,
        '#L': schema.SORT_KEY
      },
      ExpressionAttributeValues: {
        ':r': roomCode,
        ':l': DbSchema.sortKeyFromGameName(gameName)
      },
      KeyConditionExpression: '#R = :r AND #L = :l',
      ProjectionExpression: schema.ASSIGNMENTS,
      TableName: schema.TABLE_NAME
    };
    runTest({req: req, expectNext: true, expectedDbParams: expectedDbParams});
  });
  
});