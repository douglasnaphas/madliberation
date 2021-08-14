/* globals expect */
describe('assignLibsMiddleware/dbParamsGetParticipants', () => {
  const dbParams = require('./dbParamsGetParticipants');
  const responses = require('../../responses');
  const schema = require('../../schema');
  const runTest = ({req, expect500, expectNext, expectedDbParams}) => {
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
      expect(res.locals.getParticipantsDbParams).toEqual(expectedDbParams);
    }
  };
  test('should 500 on missing Room Code', () => {
    const req = {
      body: {
        gameName: 'but no room code'
      }
    };
    runTest({req: req, expect500: true});
  });
  test('happy path 1', () => {
    const req = {
      body: {
        roomCode: 'PROVID'
      }
    };
    const expectedDbParams = {
      ExpressionAttributeNames: {
        '#R': schema.PARTITION_KEY,
        '#L': schema.SORT_KEY
      },
      ExpressionAttributeValues: {
        ':r': req.body.roomCode,
        ':l': schema.PARTICIPANT_PREFIX
      },
      KeyConditionExpression: '#R = :r AND begins_with(#L, :l)',
      ProjectionExpression: schema.SORT_KEY,
      TableName: schema.TABLE_NAME
    };
    runTest({req: req, expectNext: true, expectedDbParams: expectedDbParams});
  });
  test('happy path 2', () => {
    const req = {
      body: {
        roomCode: 'ALSOPR'
      }
    };
    const expectedDbParams = {
      ExpressionAttributeNames: {
        '#R': schema.PARTITION_KEY,
        '#L': schema.SORT_KEY
      },
      ExpressionAttributeValues: {
        ':r': req.body.roomCode,
        ':l': schema.PARTICIPANT_PREFIX
      },
      KeyConditionExpression: '#R = :r AND begins_with(#L, :l)',
      ProjectionExpression: schema.SORT_KEY,
      TableName: schema.TABLE_NAME
    };
    runTest({req: req, expectNext: true, expectedDbParams: expectedDbParams});
  });
  
});