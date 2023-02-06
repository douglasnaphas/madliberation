// get the JWKs and call JwtChecker
class CognitoJwtChecker {
  /**
   * @param {Function} getMadLnJwks A function that returns a promise that will
   * resolve to an array of JWKs for this app, or reject if none can be
   * obtained; the default is madLnJwkGetter
   * @param {JwtChecker} jwtChecker An object that implements JwtChecker's
   * checkJwt function.
   */
  constructor(getMadLnJwks, JwtChecker) {
    this.getMadLnJwks = getMadLnJwks || require('./getMadLnJwks');
    this.JwtChecker = JwtChecker || require('./JwtChecker');
  }

  /**
   * Check signatures and expiration dates on JWTs, using the JWKs available for
   * this app's user pool
   * @param {String} accessJwt Access token
   * @param {String} idJwt Id token
   * @return {Promise} A promise that:
   * (1) Resolves to an object whose userid property is the user's Cognito user
   * id, whose nickname property is the user's nickname, and whose email
   * property is the user's email address, if the provided tokens are valid;
   * (2) Resolves to an empty object if the tokens are invalid.
   * (3) Rejects on error.
   */
  async checkCognitoJwts(accessJwt, idJwt) {
    const jwtChecker = new this.JwtChecker();
    await jwtChecker
      .checkJwt(accessJwt, idJwt)
      .then(r => {
        idJwt.resolved = 'this was resolved';
      })
      .catch(e => {
        idJwt.resolved = 'this was rejected';
        console.log('rejected!');
      });
    // return Promise.reject('invalid JWTs');
    return 'done';
  }
}

module.exports = CognitoJwtChecker;
