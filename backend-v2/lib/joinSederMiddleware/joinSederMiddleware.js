const Configs = require('../../Configs');
const randomCapGenerator = require('../randomCapGenerator');
const getHash = require('../getHash');
const awsSdk = require('aws-sdk');

const checkBody = require('../checkBody');
const computeGameNameSessionKey = require('./computeGameNameSessionKey');
const hashGameName = require('./hashGameName');
const dbParams = require('./dbParams');
const runQuery = require('./runQuery');
const handleQueryErrors = require('./handleQueryErrors');
const setCookie = require('./setCookie');
const succeed = require('./succeed');

const joinSederMiddleware = [
  // check for required body params
  checkBody(['roomCode', 'gameName']),
  // compute game name session key
  computeGameNameSessionKey(randomCapGenerator, Configs),
  // hash game name
  hashGameName(getHash),
  // create db query params
  dbParams(new Date(), Configs),
  // execute query, set res.locals.dbError, res.locals.dbData
  runQuery(awsSdk),
  // handle errors from the query
  handleQueryErrors(),
  // set cookie
  setCookie(),
  // success, send
  succeed()
];
module.exports = joinSederMiddleware;