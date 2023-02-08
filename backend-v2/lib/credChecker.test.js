const credChecker = require('./credChecker');

describe('credChecker, authorization middleware', () => {
  const idTokenInQuery =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9' +
    '.eyJhdF9oYXNoIjoiaTNQUVJrVHRQQ3Zyejl4eGo3dVZtQSIsInN1YiI6Ijk5NDA2N2NmLTk5ZDEtNDRkOS1iNTY2LTI0OWRiMjE2YzQzOSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tL3VzLWVhc3QtMV9Zbjg5eUtpem4iLCJjb2duaXRvOnVzZXJuYW1lIjoiOTk0MDY3Y2YtOTlkMS00NGQ5LWI1NjYtMjQ5ZGIyMTZjNDM5IiwiYXVkIjoiNmt0dDBtdHBrczAzcjhzZnRpY2MzaDFvNiIsImV2ZW50X2lkIjoiNGEwZDJhODQtYjE2NS0xMWU4LWE3NTktMGQ4ZmM4YzI5ZTBlIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1MzYxOTA5MjIsIm5pY2tuYW1lIjoiSGFzaCIsImV4cCI6MTU0Mjg5ODEwMSwiaWF0IjoxNTM2MTkwOTIyLCJlbWFpbCI6Imhhc2hAZXhhbXBsZS5jb20iLCJqdGkiOiIwMzEyNjI0MS1lNGE2LTQ1OTEtOThkYS05MzZjOGQ3NGRiMDUifQ' +
    '.ZVIobZ1aC-hwGOAUSAEqPmAmBD-hz-WJumyKUFb_TCU';
  const accessTokenInHeader =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9' +
    '.eyJzdWIiOiI5OTQwNjdjZi05OWQxLTQ0ZDktYjU2Ni0yNDlkYjIxNmM0MzkiLCJldmVudF9pZCI6IjRhMGQyYTg0LWIxNjUtMTFlOC1hNzU5LTBkOGZjOGMyOWUwZSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4gb3BlbmlkIHByb2ZpbGUgZW1haWwiLCJhdXRoX3RpbWUiOjE1MzYxOTA5MjIsImlzcyI6Imh0dHBzOi8vY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb20vdXMtZWFzdC0xX1luODl5S2l6biIsImV4cCI6MTU0Mjg5OTAwNSwiaWF0IjoxNTM2MTkwOTIyLCJ2ZXJzaW9uIjoyLCJqdGkiOiI3YTMxMTUwZS1lYmQ0LTQ3NmEtOTBkNi03ZjQ0NDM4Y2EzZjgiLCJjbGllbnRfaWQiOiJoYXNoOG50cGtzMDNyOHNmdGljYzNoMW82IiwidXNlcm5hbWUiOiI5OTQwNjdjZi05OWQxLTQ0ZDktYjU2Ni0yNDlkYjIxNmM0MzkifQ' +
    '.0wBmYZ20RC5Oi2I7a6lNh0VI6ahzJhTS6v36nu25Q6E';
  const userInHeaderAndQuery = {
    at_hash: 'i3PQRkTtPCvrz9xxj7uVmA',
    sub: '994067cf-99d1-44d9-b566-249db216c439',
    email_verified: true,
    iss: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_Yn89yKizn',
    'cognito:username': '994067cf-99d1-44d9-b566-249db216c439',
    aud: '6ktt0mtpks03r8sfticc3h1o6',
    event_id: '4a0d2a84-b165-11e8-a759-0d8fc8c29e0e',
    token_use: 'id',
    auth_time: 1536190922,
    nickname: 'Hash',
    exp: 1542898101,
    iat: 1536190922,
    email: 'hash@example.com',
    jti: '03126241-e4a6-4591-98da-936c8d74db05'
  };
  const idTokenInCookie =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9' +
    '.eyJhdF9oYXNoIjoiaTNQUVJrVHRQQ3Zyejl4eGo3dVZtQSIsInN1YiI6Ijk5NDA2N2NmLTk5ZDEtNDRkOS1iNTY2LTI0OWRiMjE2YzQzOSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tL3VzLWVhc3QtMV9Zbjg5eUtpem4iLCJjb2duaXRvOnVzZXJuYW1lIjoiOTk0MDY3Y2YtOTlkMS00NGQ5LWI1NjYtMjQ5ZGIyMTZjNDM5IiwiYXVkIjoiNmt0dDBtdHBrczAzcjhzZnRpY2MzaDFvNiIsImV2ZW50X2lkIjoiNGEwZDJhODQtYjE2NS0xMWU4LWE3NTktMGQ4ZmM4YzI5ZTBlIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1MzYxOTA5MjIsIm5pY2tuYW1lIjoiU2VhcmNoIiwiZXhwIjoxNTQyODk5NjEwLCJpYXQiOjE1MzYxOTA5MjIsImVtYWlsIjoic2VhcmNoQGV4YW1wbGUuY29tIiwianRpIjoiMDMxMjYyNDEtZTRhNi00NTkxLTk4ZGEtOTM2YzhkNzRkYjA1In0' +
    '.XvRG-2TUiAxG3Cq5q53nQ86XM4lriNSSGu5auC-PX98';
  const accessTokenInCookie =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9' +
    '.eyJzdWIiOiI5OTQwNjdjZi05OWQxLTQ0ZDktYjU2Ni0yNDlkYjIxNmM0MzkiLCJldmVudF9pZCI6IjRhMGQyYTg0LWIxNjUtMTFlOC1hNzU5LTBkOGZjOGMyOWUwZSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4gb3BlbmlkIHByb2ZpbGUgZW1haWwiLCJhdXRoX3RpbWUiOjE1MzYxOTA5MjIsImlzcyI6Imh0dHBzOi8vY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb20vdXMtZWFzdC0xX1luODl5S2l6biIsImV4cCI6MTU0MjkwMDA4OSwiaWF0IjoxNTM2MTkwOTIyLCJ2ZXJzaW9uIjoyLCJqdGkiOiI3YTMxMTUwZS1lYmQ0LTQ3NmEtOTBkNi03ZjQ0NDM4Y2EzZjgiLCJjbGllbnRfaWQiOiJzZWFyY2g4bnRwa3MwM3I4c2Z0aWNjM2gxbzYiLCJ1c2VybmFtZSI6Ijk5NDA2N2NmLTk5ZDEtNDRkOS1iNTY2LTI0OWRiMjE2YzQzOSJ9' +
    '.nkmT3eLnr8OyaCHHzY5QIDAzL7-opyNWvylPx9fHO8I';
  const userInCookies = {
    at_hash: 'i3PQRkTtPCvrz9xxj7uVmA',
    sub: '994067cf-99d1-44d9-b566-249db216c439',
    email_verified: true,
    iss: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_Yn89yKizn',
    'cognito:username': '994067cf-99d1-44d9-b566-249db216c439',
    aud: '6ktt0mtpks03r8sfticc3h1o6',
    event_id: '4a0d2a84-b165-11e8-a759-0d8fc8c29e0e',
    token_use: 'id',
    auth_time: 1536190922,
    nickname: 'Search',
    exp: 1542899610,
    iat: 1536190922,
    email: 'search@example.com',
    jti: '03126241-e4a6-4591-98da-936c8d74db05'
  };

  test('no JWTs, should get 401', async () => {
    const req = {
      get: () => {
        return undefined;
      },
      query: {},
      cookies: {}
    };
    let status401Set = false;
    let status401Sent = false;
    const res = {
      status: code => {
        if (code == 401) {
          status401Set = true;
          return res;
        } else {
          return undefined;
        }
      },
      send: () => {
        if (status401Set && !nextCalled) {
          status401Sent = true;
        }
      }
    };
    let nextCalled = false;
    const next = () => {
      if (!status401Sent) {
        nextCalled = true;
      }
    };
    class MockCognitoJwtChecker {
      checkCognitoJwts(accessJot, idJot) {
        return Promise.resolve({});
      }
    }
    expect.assertions(1);
    try {
      await credChecker({ CognitoJwtChecker: MockCognitoJwtChecker })(
        req,
        res,
        next
      );
    } catch (err) {
      throw new Error('error with MockCognitoJwtChecker: ' + e);
    }

    expect(status401Sent).toBeTruthy();
  });

  test('valid tokens in header and query, should advance, populate user', async () => {
    const req = {
      get: header => {
        return 'Bearer ' + accessTokenInHeader;
      },
      query: { idtoken: idTokenInQuery },
      cookies: {}
    };
    let status401Set = false;
    let status401Sent = false;
    const res = {
      status: code => {
        if (code == 401) {
          status401Set = true;
          return res;
        } else {
          return undefined;
        }
      },
      send: () => {
        if (status401Set && !nextCalled) {
          status401Sent = true;
        }
      }
    };
    let nextCalled = false;
    const next = () => {
      if (!status401Sent) {
        nextCalled = true;
      }
    };
    class MockCognitoJwtChecker {
      checkCognitoJwts(accessJot, idJot) {
        if (accessJot == accessTokenInHeader && idJot == idTokenInQuery) {
          return Promise.resolve({
            userid: userInHeaderAndQuery['cognito:username'],
            nickname: userInHeaderAndQuery.nickname,
            email: userInHeaderAndQuery.email
          });
        }
        return Promise.reject('invalid JWTs');
      }
    }
    expect.assertions(4);
    try {
      await credChecker({ CognitoJwtChecker: MockCognitoJwtChecker })(
        req,
        res,
        next
      );
    } catch (err) {
      throw new Error('error with MockCognitoJwtChecker: ' + e);
    }
    expect(nextCalled).toBeTruthy();
    expect(req.userid).toEqual(userInHeaderAndQuery['cognito:username']);
    expect(req.nickname).toEqual(userInHeaderAndQuery.nickname);
    expect(req.email).toEqual(userInHeaderAndQuery.email);
  });

  test('valid tokens in cookies, should advance, populate user', async () => {
    const req = {
      get: header => {
        return undefined;
      },
      query: {},
      cookies: { idtoken: idTokenInCookie, accesstoken: accessTokenInCookie }
    };
    let status401Set = false;
    let status401Sent = false;
    const res = {
      status: code => {
        if (code == 401) {
          status401Set = true;
          return res;
        } else {
          return undefined;
        }
      },
      send: () => {
        if (status401Set && !nextCalled) {
          status401Sent = true;
        }
      }
    };
    let nextCalled = false;
    const next = () => {
      if (!status401Sent) {
        nextCalled = true;
      }
    };
    class MockCognitoJwtChecker {
      checkCognitoJwts(accessJot, idJot) {
        if (accessJot == accessTokenInCookie && idJot == idTokenInCookie) {
          return Promise.resolve({
            userid: userInCookies['cognito:username'],
            nickname: userInCookies.nickname,
            email: userInCookies.email
          });
        }
        return Promise.reject('invalid JWTs');
      }
    }
    expect.assertions(4);
    try {
      await credChecker({ CognitoJwtChecker: MockCognitoJwtChecker })(
        req,
        res,
        next
      );
    } catch (err) {
      throw new Error('error with MockCognitoJwtChecker: ' + e);
    }
    expect(nextCalled).toBeTruthy();
    expect(req.userid).toEqual(userInCookies['cognito:username']);
    expect(req.nickname).toEqual(userInCookies.nickname);
    expect(req.email).toEqual(userInCookies.email);
  });
  test('valid tokens in header/query and cookies, header/query should win', () => {});
  test('no tokens in header/query, invalid in cookies, should get 401', async () => {
    const req = {
      get: header => {
        return undefined;
      },
      query: {},
      cookies: { idtoken: idTokenInCookie, accesstoken: accessTokenInCookie }
    };
    let status401Set = false;
    let status401Sent = false;
    const res = {
      status: code => {
        if (code == 401) {
          status401Set = true;
          return res;
        } else {
          return undefined;
        }
      },
      send: () => {
        if (status401Set && !nextCalled) {
          status401Sent = true;
        }
      }
    };
    let nextCalled = false;
    const next = () => {
      if (!status401Sent) {
        nextCalled = true;
      }
    };
    class MockCognitoJwtChecker {
      checkCognitoJwts(accessJot, idJot) {
        return Promise.resolve({});
      }
    }
    expect.assertions(2);
    const credCheckerFunction = credChecker({
      CognitoJwtChecker: MockCognitoJwtChecker
    });
    try {
      await credCheckerFunction(req, res, next);
    } catch (e) {
      throw new Error('error with MockCognitoJwtChecker: ' + e);
    }
    expect(nextCalled).toBeFalsy();
    expect(status401Sent).toBeTruthy();
  });
  test('valid tokens in header/query, invalid in cookies, should advance using valid tokens', () => {});
  test('invalid tokens in header/query, none in cookies, should get 401', () => {});
  test('invalid tokens in cookies, none in header/query, should get 401', () => {});
  test('invalid tokens everywhere, should get 401', () => {});
  test('wrong authorization type', () => {});
  test('malformed tokens', () => {});
});
