/**
 * Return middleware satisfying:
 * pre:
 *   - the Game Name is in res.locals.gameName
 *   - a cookie issued by Mad Liberation for the supplied Room Code and Game
 *     Name is in req.cookies
 * post:
 *   - the cookie corresponding to the supplied Game Name is in
 *     res.locals.gameNameCookie, and next() is called
 *   - 403 is sent if no such cookie is found
 *   - 500 is sent on other error
 */
function findCookie() {
  const middleware = (req, res, next) => {
    const getHash = require('../getHash');
    const responses = require('../../responses');
    if(!res.locals.gameName) {
      return res.status(500).send(responses.SERVER_ERROR);
    }
    res.locals.gameNameCookie = {};
    const gameNameHash = getHash(res.locals.gameName);
    const rightCookie =
      Object.entries(req.cookies).find(c => c[0] == gameNameHash);
    if(!rightCookie) {
      return res.status(403).send(responses.FORBIDDEN);
    }
    res.locals.gameNameCookie[rightCookie[0]] = rightCookie[1];
    return next();
  };
  return middleware;
}
module.exports = findCookie;