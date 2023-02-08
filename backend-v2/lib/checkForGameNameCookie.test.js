/* globals expect */
describe('checkForGameNameCookie', () => {
  const checkForGameNameCookie = require('./checkForGameNameCookie');
  const getHash = require('./getHash');
  const responses = require('../responses');
  const runTest = ({req, locals, expectedCookie, expectNext, expectedStatus,
    expectedData}) => {
      const middleware = checkForGameNameCookie();
      let statusToSend = 200;
      let sentStatus;
      let nextCalled = false;
      let sentData;
      const next = () => {nextCalled = true;};
      const res = {
        locals: locals,
        status: s => {
          statusToSend = s;
          return {
            send: d => {sentData = d; sentStatus = statusToSend;}
          }
        },
        send: d => {sentData = d; sentStatus = statusToSend;}
      }
      middleware(req, res, next);
      if(expectedCookie) {
        expect(res.locals.gameNameCookie).toEqual(expectedCookie);
      }
      if(expectNext) {
        expect(nextCalled).toBeTruthy();
      }
      if(expectedStatus) {
        expect(sentStatus).toEqual(expectedStatus);
        expect(sentData).toEqual(expectedData);
      }
    };
  test('cookie found among 4 cookies', () => {
    const roomCode = 'FOUNDA';
    const gameName = 'Cookie Monster';
    const gameNameHash = getHash(gameName);
    const locals = {
      roomCode: roomCode,
      gameName: gameName
    }
    const req = {
      cookies: {
        'wrong1num1': 'THISISWRONG1',
        'wrong1num2': 'THISISALSOWRONG',
        'wrong1num3': 'WRONG'
      }
    };
    const expectedCookie = {};
    expectedCookie[gameNameHash] = 'RIGHTRIGHTRIGHT';
    req.cookies[gameNameHash] = expectedCookie[gameNameHash];
    runTest({req: req, locals: locals, expectedCookie: expectedCookie,
      expectNext: true});
  });
  test('cookie found among 1 cookie', () => {
    const roomCode = 'FOUNDA';
    const gameName = 'Lonely';
    const gameNameHash = getHash(gameName);
    const locals = {
      roomCode: roomCode,
      gameName: gameName
    }
    const req = {
      cookies: {}
    };
    const expectedCookie = {};
    expectedCookie[gameNameHash] = 'LONELYRIGHTRIGHTRIGHT';
    req.cookies[gameNameHash] = expectedCookie[gameNameHash];
    runTest({req: req, locals: locals, expectedCookie: expectedCookie,
      expectNext: true});
  });
  test('cookie key not found', () => {
    const roomCode = 'FOUNDA';
    const gameName = 'Cookie Monster';
    const gameNameHash = getHash(gameName);
    const locals = {
      roomCode: roomCode,
      gameName: gameName
    }
    const req = {
      cookies: {
        'wrong1num1': 'THISISWRONG1',
        'wrong1num2': 'THISISALSOWRONG',
        'wrong1num3': 'WRONG'
      }
    };
    const expectedCookie = {};
    expectedCookie[gameNameHash] = 'RIGHTRIGHTRIGHT';
    runTest({req: req, locals: locals, expectNext: true});
  });
  test('no cookies', () => {
    const roomCode = 'FOUNDA';
    const gameName = 'Cookie Monster';
    const gameNameHash = getHash(gameName);
    const locals = {
      roomCode: roomCode,
      gameName: gameName
    }
    const req = {
      cookies: {}
    };
    const expectedCookie = {};
    expectedCookie[gameNameHash] = 'RIGHTRIGHTRIGHT';
    runTest({req: req, locals: locals, expectNext: true});
  });
  test('missing Game Name', () => {
    const gameName = 'Cookie Monster';
    const gameNameHash = getHash(gameName);
    const locals = {
      nothing: 'no game name provided'
    }
    const req = {
      cookies: {
        'wrong1num1': 'THISISWRONG1',
        'wrong1num2': 'THISISALSOWRONG',
        'wrong1num3': 'WRONG'
      }
    };
    const expectedCookie = {};
    runTest({req: req, locals: locals, expectedStatus: 500, expectedData:
      responses.SERVER_ERROR});
  });
});