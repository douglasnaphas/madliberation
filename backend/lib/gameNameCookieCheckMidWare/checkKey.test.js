/* globals expect */
describe('checkKey', () => {
  const checkKey = require('./checkKey');
  const schema = require('../../schema');
  const responses = require('../../responses');
  const getHash = require('../getHash');
  const runTest = ({locals, expectNext, expectedStatus, expectedData}) => {
    const middleware = checkKey();
    let statusToSend = 200;
    let sentStatus;
    let sentData;
    let nextCalled = false;
    const next = () => {nextCalled = true};
    const req = {};
    const res = {
      locals: locals,
      status: s => {
        statusToSend = s;
        return {
          send: d => {sentData = d; sentStatus = statusToSend;}
        };
      },
      send: d => {sentData = d; sentStatus = statusToSend;}
    };
    middleware(req, res, next);
    if(expectNext) {
      expect(nextCalled).toBeTruthy();
    }
    if(expectedStatus) {
      expect(sentStatus).toEqual(expectedStatus);
    }
    if(expectedData) {
      expect(sentData).toEqual(expectedData);
    }
  };
  test('missing locals.gameNameCookie', () => {
    const locals = {dbData: {}, gameName: 'some name'};
    runTest({locals: locals, expectedStatus: 500, expectedData:
      responses.SERVER_ERROR});
  });
  test('missing locals.dbData', () => {
    const locals = {gameNameCookie: {}, gameName: 'a name'};
    runTest({locals: locals, expectedStatus: 500, expectedData:
      responses.SERVER_ERROR});
  });
  test('Items is 0-length in the db response', () => {
    const gameName = 'me, my name';
    const gameNameHash = getHash(gameName);
    const locals = {
      gameName: gameName,
      gameNameCookie: {},
      dbData: {
        Items: [] // this means no session key was found for this seder-name
      }
    };
    locals.gameNameCookie[gameNameHash] = 'the session key';
    runTest({locals: locals, expectedStatus: 403, expectedData:
      responses.FORBIDDEN});
  });
  test('res.locals.gameName is not set, expect 500', () => {
    const gameName = 'me, my name';
    const gameNameHash = getHash(gameName);
    const locals = {
      gameNameCookie: {},
      dbData: {
        Items: []
      }
    };
    locals.gameNameCookie[gameNameHash] = 'the session key';
    const item = {};
    item[schema.SESSION_KEY] = 'the session key';
    locals.dbData.Items.push(item);
    runTest({locals: locals, expectedStatus: 500, expectedData:
      responses.SERVER_ERROR});
  });
  test('keys match 1', () => {
    const gameName = 'me, my name';
    const gameNameHash = getHash(gameName);
    const locals = {
      gameName: gameName,
      gameNameCookie: {},
      dbData: {
        Items: []
      }
    };
    locals.gameNameCookie[gameNameHash] = 'the session key';
    const item = {};
    item[schema.SESSION_KEY] = 'the session key';
    locals.dbData.Items.push(item);
    runTest({locals: locals, expectNext: true});
  });
  test('keys match 2', () => {
    const gameName = 'me, my OTHER name';
    const gameNameHash = getHash(gameName);
    const locals = {
      gameName: gameName,
      gameNameCookie: {},
      dbData: {
        Items: []
      }
    };
    locals.gameNameCookie[gameNameHash] = 'the other session key';
    const item = {};
    item[schema.SESSION_KEY] = 'the other session key';
    locals.dbData.Items.push(item);
    runTest({locals: locals, expectNext: true});
  });
  test('key mismatch', () => {
    const gameName = 'me, my OTHER name';
    const gameNameHash = getHash(gameName);
    const locals = {
      gameName: gameName,
      gameNameCookie: {},
      dbData: {
        Items: []
      }
    };
    locals.gameNameCookie[gameNameHash] = 'the other session key';
    const item = {};
    item[schema.SESSION_KEY] = 'the wrong session key';
    locals.dbData.Items.push(item);
    runTest({locals: locals, expectedStatus: 403, expectedData:
      responses.FORBIDDEN});
  });
});