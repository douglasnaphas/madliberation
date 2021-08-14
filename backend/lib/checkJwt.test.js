/* globals expect, jest */
describe('checkJwt', () => {
  const checkJwt = require("./checkJwt");
  test("checkJwt({local: 'x'}) means next() if(!res.locals.x)", () => {
    const req = {};
    const res = {locals: {}}; // res.locals.x is undefined
    const next = jest.fn();
    const local = "x";
    const middleware = checkJwt({local});
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });
  test("checkJwt({local: 'user'}) means next() if(!res.locals.user)", () => {
    const req = {};
    const res = {locals: {x: 'y'}}; // res.locals.x is undefined
    const next = jest.fn();
    const local = "user";
    const middleware = checkJwt({local});
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });
  test("checkJwt({local: 'user'}) means the middleware should proceed "+
    "if(res.locals.user)", () => {
    const req = {};
    const sendStatus = jest.fn();
    const res = {
      locals: {user: "no-jwt-cookies-like-access_token"},
      sendStatus
    };
    const next = jest.fn();
    const local = "user";
    const middleware = checkJwt({local, tokenType: "access"});
    middleware(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(sendStatus).toHaveBeenCalled();
    expect(sendStatus).toHaveBeenCalledWith(500);
  });
  test('no jwks in locals, should fail', () => {});
  test("should check unexpired access token", () => {
    // simplify with mock verifyJwt
    const req = {};
    const sendStatus = jest.fn();
    const send = jest.fn();
    const status = jest.fn(() => {send});
    const access_token = "43890jfasjkJIEfa.290fdjanIFDJ23AVDS.823jfalvmfHHH==";
    const jwks = [{kid: 'incorrect kid'}, {kid: 'correct kid'}];
    const res = {
      sendStatus,
      status,
      send,
      locals: {
        access_token,
        jwks
      }
    };
    const tokenType = "access";
    const decodedJot = {
      header: {
        kid: 'correct kid'
      },
      payload: {sub: "correct sub"},
      signature: {}
    };
    const jwkPem = {};
    const jwk2Pem = jest.fn((jwk) => {
      if(jwk.kid === 'correct kid') {
        return jwkPem;
      }
    });
    const jwt = {
      decode: jest.fn((jot, options) => {
        if(jot === access_token && options && options.complete) {
          return decodedJot;
        }
      }),
      verify: jest.fn((token, secretOrPublicKey, options) => {
        if(token !== access_token || secretOrPublicKey !== jwkPem ||
          !options || options.algorithm !== "RS256") {
            throw "mock verification failed";
          }
      })
    };
    const next = jest.fn();
    const verifyJwt = jest.fn(() => decodedJot.payload.sub);
    const middleware = checkJwt({
      jwk2Pem,
      jwt,
      tokenType: "access",
      verifyJwt
    });
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(sendStatus).not.toHaveBeenCalled();
    expect(status).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
    // res.locals.jwt_sub should be set to the sub from the decoded JWT
  });
  test("should refresh access token, new access token valid", async () => {
    const req = {};
    const sendStatus = jest.fn();
    const send = jest.fn();
    const status = jest.fn(() => {send});
    const access_token = "43890jfasjkJIEfa.290fdjanIFDJ23AVDS.823jfalvmfHHH==";
    const jwks = [{kid: 'incorrect kid'}, {kid: 'correct kid'}];
    const res = {
      sendStatus,
      status,
      send,
      locals: {
        access_token,
        jwks
      },
      cookie: jest.fn()
    };
    const tokenType = "access";
    const decodedJot = {
      header: {
        kid: 'correct kid'
      },
      payload: {sub: "the correct sub"},
      signature: {}
    };
    const jwkPem = {};
    const jwk2Pem = jest.fn((jwk) => {
      if(jwk.kid === 'correct kid') {
        return jwkPem;
      }
    });
    const refreshedTokens = {
      "id_token": "newid.token.sig2039fa",
      "access_token": "refreshedaccess.tokenwith.signature234321"
    };
    const decodedRefreshedAccessToken = {
      header: {
        kid: "refreshed kid"
      },
      payload: {sub: "refreshed sub"},
      signature: "refreshed signature"
    };
    const refreshAccessToken = jest.fn(async () => {
      return Promise.resolve(refreshedTokens);
    });
    const jwt = {};
    const verifyJwt = jest.fn(({jot}) => {
      if(jot === access_token) {
        throw "expired access token";
      }
      if(jot === refreshedTokens.access_token) {
        return decodedJot.payload.sub;
      }
    });
    const next = jest.fn();
    const middleware = checkJwt({
      jwk2Pem,
      jwt,
      tokenType: "access",
      refreshAccessToken,
      verifyJwt
    });
    await middleware(req, res, next);
    expect(next).toHaveBeenCalled();
    // res.locals.jwt_sub should be set to the sub from the refreshed token,
    // which should be different from the one from the first token
    
    // cookies should be udpated
    const expectedCookieOptions = {
      httpOnly: true, secure: true, sameSite: "strict"
    };
    expect(res.cookie).toHaveBeenCalled();
    expect(res.cookie).toHaveBeenCalledWith(
      "id_token", refreshedTokens.id_token, expectedCookieOptions
    );
    expect(res.cookie).toHaveBeenCalledWith(
      "access_token", refreshedTokens.access_token, expectedCookieOptions
    );
  });
  test("refresh access token, new access token invalid (rare case)", () => {});
  test("res.locals.jwt_sub should be populated on success", () => {
    
  });
  test("refreshed tokens should be saved and JWT cookies updated",
    () => {
      
  });
});