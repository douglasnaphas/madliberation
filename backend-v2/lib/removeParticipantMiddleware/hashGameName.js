/**
 * Return middleware that populates res.locals.gameNameHash with the hash of
 * req.body.gameName, 64 bytes, lowercase, hex, SHA256, satifsying:
 * pre: req.body.gameName is a string
 * post: res.locals.gameNameHash is the hash of req.body.gameName
 * @param {Function} A function (str, len) -> str that produces a hash from
 * the string to hash and the desired output length
 * @return {Function} Express middleware that populates the hash and calls next,
 * sends 500 on error
 */
function hashGameName(getHash) {
  const middleware = (req, res, next) => {
    const responses = require('../../responses');
    if(!req || !req.body || !req.body.gameName || req.body.gameName.length < 1
      || !getHash) {
      return res.status(500).send(responses.SERVER_ERROR);
    }
    res.locals.gameNameHash = getHash(req.body.gameName, 64);
    return next();
  };
  return middleware;
}
module.exports = hashGameName;