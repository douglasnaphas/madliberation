class JwtChecker {
  constructor(jwk2Pem, jwt) {
    this.jwk2Pem = jwk2Pem || require('jwk-to-pem');
    this.jwt = jwt || require('jsonwebtoken');
  }
  /**
   * Check the expiration and signature of a JWT, using a key id'd by the kid
   * in the JWT's header corresponding to a JWK in an array of JWKs
   * @param {String} jot A JSON Web Token
   * @param {Array} jwks Array of objects consumable by jwk-to-pem
   * @return {Promise} A promise that resolves to the decoded token if jwt is
   * unexpired and has a valid signature that could be verified using a JWK
   * specified in the JWT and found in jwks, rejects otherwise
   */
  checkJwt(jot, jwks) {
    if (!jot) {
      return Promise.reject('bad jwt: ' + jot);
    }
    if (!jwks) {
      return Promise.reject('bad JWKs: ' + jwks);
    }
    if (!Array.isArray(jwks)) {
      return Promise.reject('bad JWKs, not an array: ' + jwks);
    }
    const decodedJot = this.jwt.decode(jot, { complete: true });
    if (!decodedJot) {
      return Promise.reject(
        'could not decode JWT, tried and got: ' + decodedJot
      );
    }
    if (!decodedJot.header) {
      return Promise.reject('decoded JWT has no header: ' + decodedJot);
    }
    if (!decodedJot.payload) {
      return Promise.reject('decoded JWT has no payload: ' + decodedJot);
    }
    if (!decodedJot.signature) {
      return Promise.reject('decoded JWT has no signature: ' + decodedJot);
    }
    let jwkFound = false;
    let jwk;
    let jwkPem;
    for (let i = 0; i < jwks.length; i++) {
      if (decodedJot.header.kid && decodedJot.header.kid == jwks[i].kid) {
        jwkFound = true;
        jwk = jwks[i];
        jwkPem = this.jwk2Pem(jwk);
        if (!jwkPem) {
          return Promise.reject('could not parse JWK');
        }
        break;
      }
    }
    if (!jwkFound) {
      return Promise.reject(
        'JWT signing key not found in JWKs, signing key' +
          ' is: ' +
          decodedJot.header.kid
      );
    }
    try {
      this.jwt.verify(jot, jwkPem, { algorithm: 'RS256' });
    } catch (err) {
      return Promise.reject(err.message || err);
    }

    return Promise.resolve(decodedJot);
  }
}

module.exports = JwtChecker;
