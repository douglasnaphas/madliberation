/* globals expect */
describe('rosterMiddleware/checkParams', () => {
  const checkParams = require('./checkParams');
  const responses = require('../../responses');
  const api = require('../../api');
  const runTest = ({req, expectNext, expect400}) => {
    const middleware = checkParams();
    let statusToSend = 200;
    let sentStatus;
    let nextCalled = false;
    let sentData;
    const res = {
      status: (s) => {
        statusToSend = s;
        return {
          send: (data) => {
            sentStatus = statusToSend;
            sentData = data;
          }
        };
      },
      send: (data) => { sentStatus = statusToSend; sentData = data; }
    };
    const next = () => { nextCalled = true };
    middleware(req, res, next);
    if(expectNext) {
      expect(nextCalled).toBeTruthy();
    }
    if(expect400) {
      expect(sentStatus).toEqual(400);
      expect(sentData).toEqual(responses.BAD_REQUEST);
    }
  };
  test('should 400 without roomcode', () => {
    const req = {query: {}};
    req.query[api.ROSTER.PARAMS.GAME_NAME] = 'no room code';
    runTest({req: req, expect400: true});
  });
  test('should next with params supplied', () => {
    const req = {query: {}};
    req.query[api.ROSTER.PARAMS.ROOM_CODE] = 'VALIDE';
    runTest({req: req, expectNext: true});
  });
});