/* globals expect */
const setGameNameCookie = require('./setGameNameCookie');
const Configs = require('../Configs');

describe('setGameNameCookie', () => {
  const runTest = ({gameName, randomStringGenerator, expectedCookie,
    expectedStatus, expectNext}) => {
    const middleware = setGameNameCookie({configs: Configs,
      randomStringGenerator: randomStringGenerator});
    const req = {
      body: {
        gameName: gameName
      }
    };
    let nextCalled = false;
    const next = () => {
      nextCalled = true;
    };
    const cookies = [];
    let statusToSend = 200;
    let sentStatus;
    const res = {
      cookie: (name, value, options) => {
        cookies.push({name: name, value: value, options: options});
      },
      status: (s) => {
        statusToSend = s;
        return {
          send: (data) => {
            sentStatus = statusToSend;
          }
        }
      },
      send: () => {sentStatus = statusToSend;}
    };
    middleware(req, res, next);
    if(expectedStatus) {
      expect(sentStatus).toEqual(expectedStatus);
    }
    if(expectNext) {
      expect(nextCalled).toBeTruthy();
    }
    if(expectedCookie) { // TODO: hash the Game Name for the cookie name
      const matchingCookie = cookies.find(c =>
        c.name == expectedCookie.name &&
        c.value == expectedCookie.value);
      expect(matchingCookie).toBeTruthy();
      expect(matchingCookie.options).toEqual(expectedCookie.options);
    }
  };
  test('...', () => {});
});