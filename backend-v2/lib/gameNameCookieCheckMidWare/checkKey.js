const schema = require('../../schema');
const getHash = require('../getHash');
const responses = require('../../responses');

/**
 * Return middleware satisfying:
 * - if res.locals.gameNameCookie[hash of res.locals.gameName] ==
 *      res.locals.dbData.Items[0][schema.SESSION_KEY], then
 *   call next()
 * - if there is no Items[0], send 403
 * - if either locals property is not set, send 500
 * - if the values do not match, send 403
 * - send 500 on other error
 * 
 * The middleware requires:
 * - res.locals.gameName is set to the Game Name
 * - res.locals.gameNameCookie[lowercase SHA-256 hash of the Game Name] is set
 *   to the session key from the cookie
 * - res.locals.dbData.Items is an array
 */
function checkKey() {
  const Logger = require('../../lib/Logger');
  const middleware = (req, res, next) => {
    if(!res.locals.gameNameCookie || !res.locals.dbData ||
      !res.locals.dbData.Items || !Array.isArray(res.locals.dbData.Items) ||
      !res.locals.gameName) {
      Logger.log({status: 500, event: 'gameNameCookieCheckMidWare/checkKey',
        ob: [res.locals.gameNameCookie, res.locals.dbData], gameName:
        res.locals.gameName, roomCode: res.locals.roomCode
      });
      return res.status(500).send(responses.SERVER_ERROR);
    }
    if(res.locals.dbData.Items.length == 0) {
      Logger.log({status: 403, event: 'gameNameCookieCheckMidWare/checkKey',
        message: 'no Items', roomCode: res.locals.roomCode, gameName:
        res.locals.gameName
      });
      return res.status(403).send(responses.FORBIDDEN);
    }
    const gameNameHash = getHash(res.locals.gameName);
    if(!res.locals.gameNameCookie[gameNameHash]) {
      Logger.log({status: 500, event: 'gameNameCookieCheckMidWare/checkKey',
        ob: [res.locals.gameNameCookie, gameNameHash], gameName:
        res.locals.gameName, roomCode: res.locals.roomCode, message: 'hash'
      });
      return res.status(500).send(responses.SERVER_ERROR);
    }
    if(res.locals.gameNameCookie[gameNameHash] !=
       res.locals.dbData.Items[0][schema.SESSION_KEY]) {
      Logger.log({status: 403, event: 'gameNameCookieCheckMidWare/checkKey',
        message: 'cookie mismatch', roomCode: res.locals.roomCode, gameName:
        res.locals.gameName
      });
      return res.status(403).send(responses.FORBIDDEN);
    }
    return next();
  }
  return middleware;
}
module.exports = checkKey;