/* globals expect */
describe('gameNameCookieCheckMidWare/getRoomCode', () => {
  const getRoomCode = require('./getRoomCode');
  const api = require('../../api');
  const responses = require('../../responses');
  const runTest = ({req, expectNext, expectedRoomCode, expectedStatus,
    expectedData}) => {
    let statusToSend = 200;
    let sentStatus;
    let nextCalled = false;
    let sentData;
    const next = () => {nextCalled = true};
    const res = {
      locals: {},
      status: (s) => {
        statusToSend = s;
        return {
          send: (d) => {sentStatus = statusToSend; sentData = d;}
        }
      },
      send: (d) => {sentStatus = statusToSend; sentData = d;}
    }
    const middleware = getRoomCode();
    middleware(req, res, next);
    if(expectNext) {
      expect(nextCalled).toBeTruthy();
    }
    if(expectedRoomCode) {
      expect(res.locals.roomCode).toEqual(expectedRoomCode);
    }
    if(expectedStatus) {
      expect(sentStatus).toEqual(expectedStatus);
    }
    if(expectedData) {
      expect(sentData).toEqual(expectedData);
    }
  };
  test('room code in body', () => {
    const expectedRoomCode = 'INBODY';
    const req = {
      body: {},
      query: {}
    };
    req.body[api.POST_BODY_PARAMS.ROOM_CODE] = expectedRoomCode;
    runTest({req: req, expectNext: true, expectedRoomCode: expectedRoomCode});
  });
  test('room code in query', () => {
    const expectedRoomCode = 'INQUER';
    const req = {
      body: {},
      query: {}
    };
    req.query[api.URL_QUERY_PARAMS.ROOM_CODE] = expectedRoomCode;
    runTest({req: req, expectNext: true, expectedRoomCode: expectedRoomCode});
  });
  test('same in query and body', () => {
    const expectedRoomCode = 'INQUER';
    const req = {
      body: {},
      query: {}
    };
    req.query[api.URL_QUERY_PARAMS.ROOM_CODE] = expectedRoomCode;
    req.body[api.POST_BODY_PARAMS.ROOM_CODE] = expectedRoomCode;
    runTest({req: req, expectNext: true, expectedRoomCode: expectedRoomCode});
  });
  test('different room code in query and post body, 403', () => {
    const req = {
      body: {},
      query: {}
    };
    req.query[api.URL_QUERY_PARAMS.ROOM_CODE] = 'OTHERC';
    req.body[api.POST_BODY_PARAMS.ROOM_CODE] = 'INPOST';
    runTest({req: req, expectedStatus: 403, expectedData: responses.FORBIDDEN});
  });
  test('no room code', () => {
    const req = {
      body: {},
      query: {}
    };
    runTest({req: req, expectedStatus: 403, expectedData: responses.FORBIDDEN});
  });
});