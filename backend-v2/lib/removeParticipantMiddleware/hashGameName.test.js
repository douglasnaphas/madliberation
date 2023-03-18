/* globals expect */
describe('joinSederMiddleware/hashGameName', () => {
  const hashGameName = require('./hashGameName');
  const responses = require('../../responses');
  const runTest = ({getHash, req, expectNext, expect500}) => {
    const middleware = hashGameName(getHash);
    let sentStatus;
    let statusToSend = 200;
    let nextCalled = false;
    let sentData;
    const res = {
      locals: {},
      status: (s) => {
        statusToSend = s;
        return {
          send: (d) => {
            sentStatus = statusToSend;
            sentData = d;
          }
        }
      },
      send: (d) => {
        sentStatus = statusToSend;
        sentData = d;
      }
    }
    const next = () => { nextCalled = true; };
    middleware(req, res, next);
    if(expectNext) {
      expect(nextCalled).toBeTruthy();
      expect(res.locals.gameNameHash).toEqual(getHash(req.body.gameName), 64);
    }
    if(expect500) {
      expect(sentStatus).toEqual(500);
      expect(sentData).toEqual(responses.SERVER_ERROR);
    }
  };
  test('happy path 1', () => {
    const req = {
      body: {
        gameName: 'my game name'
      }
    };
    const getHash = (str, len) => {
      if(str == req.body.gamename && len == 64) return 'good';
      return 'bad';
    };
    runTest({
      req: req,
      getHash: getHash,
      expectNext: true
    });
  });
  test('happy path 2', () => {
    const req = {
      body: {
        gameName: 'my other game name'
      }
    };
    const getHash = (str, len) => {
      if(str == req.body.gamename && len == 64) return 'good';
      return 'bad';
    };
    runTest({
      req: req,
      getHash: getHash,
      expectNext: true
    });
  });
  test('no getHash, should 500', () => {
    const req = {
      body: {
        gameName: 'fine game name'
      }
    };
    runTest({
      req: req,
      getHash: undefined,
      expect500: true
    });
  });
  test('missing req.body.gameName, should 500', () => {
    const req = {
      body: {
        noGameName: 'missing game name'
      }
    };
    const getHash = (str, len) => {
      if(str == req.body.gamename && len == 64) return 'good';
      return 'bad';
    };
    runTest({
      req: req,
      getHash: getHash,
      expect500: true
    });
  });
});
