const awsSdk = require('aws-sdk');

const getRoomCode = require('./getRoomCode');
const getGameName = require('./getGameName');
const findCookie = require('./findCookie');
const dbParams = require('./dbParams');
const runQuery = require('../runQuery');
const handleQueryErrors = require('../handleQueryErrors');
const checkKey = require('./checkKey');

/**
 * pre:
 *   - Room Code is in req.body or req.query
 *   - Game Name is in req.body or req.query
 *   - a cookie with [hash of Game Name] -> (session key) is in req.cookies
 *   - the supplied Game Name is in the supplied seder
 * post:
 *   - 400 or 403 is sent if any pre-condition fails
 *   - res.locals.roomCode contains the Room Code
 *   - res.locals.gameName contains the Game Name
 */
const gameNameCookieCheckMidWare = [
  // get Room Code from req.body or req.query, save in res.locals.roomCode
  getRoomCode(),
  // get the Game Name or its hash from body or query, save in locals.gameName
  getGameName(),
  // find the right cookie (the one that matches the supplied game name), save
  // in res.locals.gameNameCookie
  findCookie(),
  // set db params to query for the db's session key (we know the primary key)
  dbParams(),
  // run query
  runQuery(awsSdk, 'gameNameCookieDbParams'),
  // handle query errors
  handleQueryErrors(),
  // send 403 if the session key is wrong
  checkKey(),
  // next
  (req, res, next) => {next()}
];
module.exports = gameNameCookieCheckMidWare;