/**
 * Check the Authorization header or cookies for JWTs, advance with next and
 * populate req's madLnUser property if tokens are valid, send a 401 Unauthorized
 * response if no valid tokens are provided
 * @param {Object} options Set the cognitoJwtChecker property of options to
 * use a custom implementation of CognitoJwtChecker
 * @param {Request} req Checked for either:
 * (1) an Authorization header of type Bearer and credentials equal to a
 * Cognito access token, and a query param of idtoken=ID_TOKEN_JWT; or
 * (2) cookies named idtoken and accesstoken;
 * req.userid, req.nickname, and req.email set based on the ID token on
 * successful token validation
 * @param {Response} res 401 Unauthorized with the WWW-Authenticate header
 * set to Bearer if unauthorized
 * @param {Function} next Called if the request is authorized
 */
module.exports = function(options) {
  const CognitoJwtChecker =
    options.CognitoJwtChecker || require('./CognitoJwtChecker');
  return function(req, res, next) {
    // if there are JWTs in the Authorization header, save them in variables
    const authorization = req.get('Authorization');
    const authorizationArray =
      authorization && authorization.split && authorization.split(' ');
    let accessToken = authorizationArray && authorizationArray[1];
    let idToken = req.query.idtoken;

    // else if there are JWTs in coookies, save them in variables
    if (!accessToken && !idToken) {
      accessToken = req.cookies && req.cookies.accesstoken;
      idToken = req.cookies && req.cookies.idtoken;
    }

    // if either JWT is missing, send 401
    if (!accessToken || !idToken) {
      res.status(401).send();
    }

    // check saved JWTs and 401 if invalid, next() otherwise
    const cognitoJwtChecker = new CognitoJwtChecker();
    cognitoJwtChecker
      .checkCognitoJwts(accessToken, idToken)
      .then(u => {
        if (u.userid && u.nickname && u.email) {
          req.userid = u.userid;
          req.nickname = u.nickname;
          req.email = u.email;
          next();
        } else {
          res.status(401).send();
        }
      })
      .catch(e => {
        // TODO: I know of now way to test this path. Maybe put an expected
        // assertion in the reject value...
        // maybe make sure that whatever the promise rejects with is always
        // a function and is always called in the catch block, so that a test
        // can pass in a function with an expect()
        res.status(401).send();
      });
  };
};
