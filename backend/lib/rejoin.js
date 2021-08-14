const awsSdk = require('aws-sdk');
const getRoomCode = require('./gameNameCookieCheckMidWare/getRoomCode');
const getGameName = require('./gameNameCookieCheckMidWare/getGameName');
const checkForGameNameCookie = require("./checkForGameNameCookie");
const dbParamsGetSessionKey = require("./dbParamsGetSessionKey");
const runQuery = require("./runQuery");
const schema = require("../schema");
const getHash = require("./getHash");
const hashGameName = require("./joinSederMiddleware/hashGameName");
const setCookie = require("./joinSederMiddleware/setCookie");
const responses = require("../responses");

const rejoin = [                            // populated in res.locals:
    // get Room Code from req.body or req.query
  getRoomCode(),                            // roomCode
  // get the Game Name from body or query
  getGameName(),                            // gameName
  // get any existing cookie
  checkForGameNameCookie(),                 // gameNameCookie (if cookie is set)
                                            // gameNameCookie has the shape of
                                            // {[hash of game name]:
                                            //  sessionKey}
  // get the session key from the DB
  // (use functions from gameNameCookieCheckMidWare)
  // set params
  dbParamsGetSessionKey(),                  // dbParamsGetSessionKey
  // run query
  runQuery(
    awsSdk,
    "dbParamsGetSessionKey"
  ),                                        // dbData, dbError
  // save session key from db results, 500 on error with no data
  (req, res, next) => {
    if(res.locals.dbData &&
       res.locals.dbData.Items &&
       Array.isArray(res.locals.dbData.Items) &&
       res.locals.dbData.Items.length > 0 &&
       res.locals.dbData.Items[0][schema.SESSION_KEY]
       ) {
      res.locals.gameNameSessionKey =
        res.locals.dbData.Items[0][schema.SESSION_KEY];
      return next();
    }
    throw {
      message: "rejoin: no session key",
      dbData: res.locals.dbData,
      dbError: res.locals.dbError,
      sessionKey: res.locals.gameNameSessionKey      
    };
  },                                        // gameNameSessionKey  
  // compute the hash
  hashGameName(getHash),                    // gameNameHash
  // if the cookie is already right, send OK
  (req, res, next) => {
    if(res.locals.gameNameCookie[res.locals.gameNameHash]
      === res.locals.gameNameSessionKey) {
      return res.send({status: "ok"});
    }
    return next();
  },
  // set the game name cookie
  setCookie(),
  // send
  (req, res, next) => {
    return res.send(
      responses.success({
        gameName: res.locals.gameName,
        roomCode: res.locals.roomCode
      })
    );
  }
];
module.exports = rejoin;