/* globals expect */
describe('gameNameCookieCheckMidWare/getRoomCode', () => {
  const getGameName = require('./getGameName');
  const api = require('../../api');
  const responses = require('../../responses');
  const runTest = ({req, expectNext, expectedGameName, expectedStatus,
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
    const middleware = getGameName();
    middleware(req, res, next);
    if(expectNext) {
      expect(nextCalled).toBeTruthy();
    }
    if(expectedGameName) {
      expect(res.locals.gameName).toEqual(expectedGameName);
    }
    if(expectedStatus) {
      expect(sentStatus).toEqual(expectedStatus);
    }
    if(expectedData) {
      expect(sentData).toEqual(expectedData);
    }
  };
  test('game name in body', () => {
    const expectedGameName = ' In-The-Bo,d,y ';
    const req = {
      body: {},
      query: {}
    };
    req.body[api.POST_BODY_PARAMS.GAME_NAME] = expectedGameName;
    runTest({req: req, expectNext: true, expectedGameName: expectedGameName});
  });
  test('game name in query', () => {
    const expectedGameName = 'From, the, Que-ry--';
    const gameName = encodeURI(expectedGameName);
    const req = {
      body: {},
      query: {}
    };
    req.query[api.URL_QUERY_PARAMS.GAME_NAME] = gameName;
    runTest({req: req, expectNext: true, expectedGameName: expectedGameName});
  });
  test('same in query and body', () => {
    const expectedGameName = 'From, the, Que-ry--';
    const gameName = encodeURI(expectedGameName);
    const req = {
      body: {},
      query: {}
    };
    req.query[api.URL_QUERY_PARAMS.GAME_NAME] = gameName;
    req.body[api.POST_BODY_PARAMS.GAME_NAME] = expectedGameName;
    runTest({req: req, expectNext: true, expectedGameName: expectedGameName});
  });
  test('different game name in query and post body, 403', () => {
    const req = {
      body: {},
      query: {}
    };
    req.query[api.URL_QUERY_PARAMS.GAME_NAME] = 'the wrong name';
    req.body[api.POST_BODY_PARAMS.GAME_NAME] = 'the real name';
    runTest({req: req, expectedStatus: 403, expectedData: responses.FORBIDDEN});
  });
  test('no game name', () => {
    const req = {
      body: {},
      query: {}
    };
    runTest({req: req, expectedStatus: 403, expectedData: responses.FORBIDDEN});
  });
});