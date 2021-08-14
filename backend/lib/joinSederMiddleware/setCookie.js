/**
 * Return middleware satisfying:
 * pre: res.locals.gameNameHash and res.locals.gameNameSessionKey are set to
 * strings
 * post: A cookie is set with http-only, name: res.locals.gameNameHash, value:
 * res.locals.gameNameSessionKey
 * 
 * 500 on error.
 */
function setCookie() {
  const middleware = (req, res, next) => {
    const responses = require('../../responses');
    if(!res.locals.gameNameHash || !res.locals.gameNameSessionKey) {
      return res.status(500).send(responses.SERVER_ERROR);
    }
    const cookieOptions = process.env.NODE_ENV === 'development' ?
      {
        httpOnly: true,
        sameSite: "None"
      } : {
        httpOnly: true,
        secure: true,
        sameSite: "Strict"
      };
    res.cookie(res.locals.gameNameHash, res.locals.gameNameSessionKey,
      cookieOptions);
    next();
  };
  return middleware;
}

module.exports = setCookie;