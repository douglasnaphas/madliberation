const CognitoJwtChecker = require('./CognitoJwtChecker');

describe('CognitoJwtChecker', () => {
  const goodJwks = [
    {
      alg: 'RS256',
      e: 'AQAB',
      kid: 'oRqdt2gtx8brE9pY7rdEJjvUjkS8oCzFxsLt74aJqyU=',
      kty: 'RSA',
      n:
        'piLNuvF_s8Pltqbvhl4jacldyWHKsPqpqwfRDmlmDfgyUPPkH2xI1mM2ez19xgk6EV2u1WgqDUrbLZOg3LoIwGqg7ZKCEL9hFxbPmfZo-YungyeU2MtjdjDYJmG1MNpBf2AmZxDplOmlGKzHzskMHn86GrNPNCJWhrzWa-G3QPtpOmK9AMMVf-nphHuvp7Pog0yirE8qf88C4ECkYUqDQpRIG6i4rruBa--lTRp8BYJ_G4Hn07VJi1nwXTcms8qmHHE0uVSx0e58YG3Qw9ijGf3WZ5SiczWfSrAYwfr9KdaHstOfLhSL5Jt7qpeO0K31G8si1oPLITLUX1oVcW6kZQ',
      use: 'sig'
    },
    {
      alg: 'RS256',
      e: 'AQAB',
      kid: 'uTryj5OLEcTmz+jRWybXfH55IBgKi9hrkyc5S6oEU3A=',
      kty: 'RSA',
      n:
        'lQ_bci9EYeWFNodR37DyZ9WU2fvBbqzhQMAEGtvNxT6or_Rp687REhxWLDcUAPPrTOjKV5ZF8yPv-fIg921GTgmGL8kzg0MxD9-SuxO1PvNopVPVrLH7GL-gFj3Qj4SeTQHQMFYYPrZIQGcuOsz1LpgMSjNOw1qohfIo39lK7EO_GAfOgMpEKgE1tNg2AGIvrMJkTTUSQfwXVY1XZu0OmoR4xi6gbhHcqDq8M57s09c77kqyo5NhpaoDYfuJu1oA2DsjWHKmN84PIc-44ec7Eo7miFsgk5rZVH41r8rj-t8j7RudVMBYdoYtFzr9l_eADnRsytLILUl5yxs1IC73qw',
      use: 'sig'
    }
  ];
  const getGoodJwks = function() {
    return Promise.resolve(goodJwks);
  };

  const goodIdTokenSignature =
    'U1b0GyCF1Zzs2GbFKYrKnSC4QvhDhaGkUs0KO9EbnurBS6ThBxnWV9rolJIuxwEiUmRwPflgxPbIChjMDKotptqblh8HT14WgyNQZwmPkz9_efLq-loT6BOIujhNYXm0m6IeZpxEIzlbpSS3pIcnsbjKEElwQb6rASzBuI1TgqxHoWHK58hodZ2XRDcKKZjqYCnYIIy4FTnoK9GRVTPSwHzGnGSW3yDWVAN9VpLkt0G38s8rkLVmw_WdZo95DkgIdp51AfTG33Ha7A7cjzv8vSMl66XgEq02bV70EysO_8uMlohVNhFvui0xOAJmPbZYgn9TzHvQO6n5wEz3rRSeRQ';
  const goodIdToken =
    'eyJraWQiOiJvUnFkdDJndHg4YnJFOXBZN3JkRUpqdlVqa1M4b0N6RnhzTHQ3NGFKcXlVPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiaTNQUVJrVHRQQ3Zyejl4eGo3dVZtQSIsInN1YiI6Ijk5NDA2N2NmLTk5ZDEtNDRkOS1iNTY2LTI0OWRiMjE2YzQzOSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9Zbjg5eUtpem4iLCJjb2duaXRvOnVzZXJuYW1lIjoiOTk0MDY3Y2YtOTlkMS00NGQ5LWI1NjYtMjQ5ZGIyMTZjNDM5IiwiYXVkIjoiNmt0dDBtdHBrczAzcjhzZnRpY2MzaDFvNiIsImV2ZW50X2lkIjoiNGEwZDJhODQtYjE2NS0xMWU4LWE3NTktMGQ4ZmM4YzI5ZTBlIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1MzYxOTA5MjIsIm5pY2tuYW1lIjoiRG91ZyBGZWQiLCJleHAiOjE1MzYxOTQ1MjIsImlhdCI6MTUzNjE5MDkyMiwiZW1haWwiOiJkb3VnbGFzbmFwaGFzQGdtYWlsLmNvbSJ9.' +
    goodIdTokenSignature;
  const decodedGoodIdToken = {
    header: {
      kid: 'oRqdt2gtx8brE9pY7rdEJjvUjkS8oCzFxsLt74aJqyU=',
      alg: 'RS256'
    },
    payload: {
      at_hash: 'i3PQRkTtPCvrz9xxj7uVmA',
      sub: '994067cf-99d1-44d9-b566-249db216c439',
      email_verified: true,
      iss: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_Yn89yKizn',
      'cognito:username': '994067cf-99d1-44d9-b566-249db216c439',
      aud: '6ktt0mtpks03r8sfticc3h1o6',
      event_id: '4a0d2a84-b165-11e8-a759-0d8fc8c29e0e',
      token_use: 'id',
      auth_time: 1536190922,
      nickname: 'Doug Fed',
      exp: 1536194522,
      iat: 1536190922,
      email: 'douglasnaphas@gmail.com'
    },
    signature: goodIdTokenSignature
  };
  const goodAccessToken =
    'eyJraWQiOiJ1VHJ5ajVPTEVjVG16K2pSV3liWGZINTVJQmdLaTlocmt5YzVTNm9FVTNBPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI5OTQwNjdjZi05OWQxLTQ0ZDktYjU2Ni0yNDlkYjIxNmM0MzkiLCJldmVudF9pZCI6ImQ4YzI5MjA2LWU0NzAtMTFlOC1iYzE4LWFmMmViNWVjMTkwNCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4gb3BlbmlkIHByb2ZpbGUgZW1haWwiLCJhdXRoX3RpbWUiOjE1NDE4MDMzOTYsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX1luODl5S2l6biIsImV4cCI6MTU0MTgwNjk5NiwiaWF0IjoxNTQxODAzMzk2LCJ2ZXJzaW9uIjoyLCJqdGkiOiJjZjBlMGI0MC1lNjhlLTQyOWItYjg2YS1mZThjOTQ1N2FjY2EiLCJjbGllbnRfaWQiOiI2a3R0MG10cGtzMDNyOHNmdGljYzNoMW82IiwidXNlcm5hbWUiOiI5OTQwNjdjZi05OWQxLTQ0ZDktYjU2Ni0yNDlkYjIxNmM0MzkifQ.dzEPEVnFIMcj0nwq2zHJ46gQ9Q-_9JjiGsD5bMPGcEVhqLYgZz74pyDJRZwtILWZXSzfwDMrP61FzZjsNbcxEq3Dl98KkCo6v8IR09kJbmOhBJJUVUoEUAU7Rx8Bt3fA2i1dx1HHwhTyghb637I054X3WKsazLuR2arTgiu5unF0uu-trdYaNR-_2KvIuWYUptKYnyjRJSn2sMYd8XsuLx7PbwoHdW3S3zqGcID056EB1s4N--zdqiP1PR8BPI8cVcPsTFH0CduYrY-x7WB8nYBmKRKKAUVtviC1OkGNzCXBucn8OMQ_WpzbnjBtsMBG0lE3QlKJbybs5CfjadFNMA';
  test.skip('checkJwt should be called', async () => {
    class MockJwtChecker {
      checkJwt(jot, jwks) {
        // return Promise.resolve({ mockCalled: true });
        return Promise.reject({ mockCalled: true });
      }
    }
    const cognitoJwtChecker = new CognitoJwtChecker(false, MockJwtChecker);
    let result = 'nothing';
    const accessJwt = { a1: 'ay 1' };
    const idJwt = { i1: 'eye 1' };

    try {
      result = await cognitoJwtChecker.checkCognitoJwts(accessJwt, idJwt);
    } catch (e) {
      console.log('rejected with: ' + e);
    }
    console.log('result: ' + result);
    console.log('idJwt.resolved: ' + idJwt.resolved);
  });
  test.skip('trying to call rejection path', async () => {
    class MockJwtChecker {
      checkJwt(jot, jwks) {
        // return Promise.resolve({ mockCalled: true });
        return Promise.reject(() => {
          console.log('within rejection');
          expect(true).toBeTruthy();
        });
      }
    }
    const cognitoJwtChecker = new CognitoJwtChecker(false, MockJwtChecker);
    let result = 'nothing';
    const accessJwt = { a1: 'ay 1' };
    const idJwt = { i1: 'eye 1' };

    expect.assertions(1);
    try {
      result = await cognitoJwtChecker.checkCognitoJwts(accessJwt, idJwt);
    } catch (e) {
      console.log('rejected with: ' + e);
    }
    console.log('result: ' + result);
    console.log('idJwt.resolved: ' + idJwt.resolved);
  });
  test.skip('trying to call rejection path 2', async () => {
    class MockJwtChecker {
      checkJwt(jot, jwks) {
        // return Promise.resolve({ mockCalled: true });
        return Promise.reject(() => {
          console.log('within rejection');
          // expect(true).toBeTruthy();
        });
      }
    }
    const cognitoJwtChecker = new CognitoJwtChecker(false, MockJwtChecker);
    let result = 'nothing';
    const accessJwt = { a1: 'ay 1' };
    const idJwt = { i1: 'eye 1' };

    expect.assertions(1);

    await cognitoJwtChecker.checkCognitoJwts(accessJwt, idJwt);
    console.log('idJwt.resolved: ' + idJwt.resolved);
    expect(true).toBeTruthy();
  });
  test('valid tokens, should resolve to user details', () => {
    // class MockJwtChecker {
    //   checkJwt(jot, jwks) {
    //     if((jot == goodAccessToken || jot == goodIdToken) && jwks == goodJwks) {
    //       return Promise.resolve()
    //     }
    //   }
    // }
  });
});
