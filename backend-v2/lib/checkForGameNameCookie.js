/**
 * Return middleware satisfying:
 * pre:
 *   - the Game Name is in res.locals.gameName
 *   - a cookie issued by Mad Liberation for the supplied Room Code and Game
 *     Name MAY BE in req.cookies
 * post:
 *   - if present, the cookie corresponding to the supplied Game Name is in
 *     res.locals.gameNameCookie, and next() is called
 *   - if the cookie is not present, res.locals.gameNameCookie is not set by
 *     this middleware, and next() is called
 *   - 500 is sent if there is no gameName in res.locals
 */
function checkForGameNameCookie() {
  const middleware = (req, res, next) => {
    const getHash = require('./getHash');
    const responses = require('../responses');
    if(!res.locals.gameName) {
      return res.status(500).send(responses.SERVER_ERROR);
    }
    res.locals.gameNameCookie = {};
    const gameNameHash = getHash(res.locals.gameName);
    const rightCookie =
      Object.entries(req.cookies).find(c => c[0] === gameNameHash);
    if(!rightCookie) {
      return next();
    }
    res.locals.gameNameCookie[rightCookie[0]] = rightCookie[1];
    return next();
  };
  return middleware;
}
module.exports = checkForGameNameCookie;