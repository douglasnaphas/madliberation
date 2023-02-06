const checkQueryParams = require('../checkQueryParams');
const api = require('../../api');
const dbParams = require('./dbParams');
const awsSdk = require('aws-sdk');
const runQuery = require('../runQuery');
const handleQueryErrors = require('../handleQueryErrors');
const prepRes = require('./prepRes');

/**
 * pre:
 *   1) req.query.roomCode is set
 * post:
 *   1) res.locals.done is an array of strings, participants who have submitted
 *      their answers
 *   2) res.locals.notDone is an array of strings, particpants who have not
 */
const readRosterMiddleware = [
  // check for req.body.roomCode
  checkQueryParams([api.URL_QUERY_PARAMS.ROOM_CODE]),
  // set db params to get a list of participants and their answers
  dbParams(),
  // run query
  runQuery(awsSdk, 'readRosterDbParams'),
  // handle query errors
  handleQueryErrors(),
  // prepare response: two lists, submitted and un-submitted
  prepRes()
]

module.exports = readRosterMiddleware;