const api = require('../../api');
const checkQueryParams = require('../checkQueryParams');
const querySederParams = require('./querySederParams');
const runQuery = require('../runQuery');
const awsSdk = require('aws-sdk');
const handleQueryErrors = require('../handleQueryErrors');
const saveSederInfo = require('./saveSederInfo');
const s3Params = require('./s3Params');
const runS3Get = require('../runS3Get');
const handleS3Errors = require('../handleS3Errors');
const parseScript = require('./parseScript');
const decorateLibs = require('./decorateLibs');
const Logger = require('../Logger');
const logSuccess = require('./logSuccess');

/**
 * pre:
 *   1) req.query.roomCode is set
 * post:
 *   1) res.locals.script is set to the script for this seder, populated with
 *      participants' answers
 */
const scriptMiddleware = [
  // make sure req.query.roomCode is set
  checkQueryParams([api.URL_QUERY_PARAMS.ROOM_CODE]),
  // set db params to get the path, version, and answers from every item with
  // this room code
  querySederParams(),
  // run query to get the path and version
  runQuery(awsSdk, 'querySederParams'),
  // handle query errors
  handleQueryErrors(),
  // save the path and version, and answers
  saveSederInfo(),
  // set params to get the script from S3
  s3Params(),
  // run S3 get
  runS3Get(awsSdk, 'scriptS3Params'),
  // handle S3 errors
  handleS3Errors(),
  // parse the script into an object in res.locals.script
  parseScript(),
  // add ids to libs;
  // remove examples, sentences, and defaultAnswers from libs;
  // add answers to libs
  decorateLibs(),
  // log success
  logSuccess(Logger)
];
module.exports = scriptMiddleware;