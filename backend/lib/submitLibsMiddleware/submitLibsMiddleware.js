const api = require('../../api');
const checkBody = require('../checkBody');
const lintAnswers = require('./lintAnswers');
const dbParams = require('./dbParams');
const awsSdk = require('aws-sdk');
const runTransactWrite = require('../runTransactWrite');
const handleQueryErrors = require('../handleQueryErrors');

/**
 * pre:
 *   1) req.body.roomCode and req.body.gameName are strings
 *   2) req.body.answers is an array of {id: <NUMBER>, answer: <STRING>}
 * post:
 *   1) In the DB, this participant's answers column is set to req.body.answers
 */
const submitLibsMiddleware = [
  // check that all post params are present
  checkBody([api.POST_BODY_PARAMS.ROOM_CODE, api.POST_BODY_PARAMS.GAME_NAME,
    api.POST_BODY_PARAMS.ANSWERS]),
  // check that answers is an array of objects with id properties
  lintAnswers(),
  // set db params to record answers for this participant
  dbParams(),
  // execute query (transactWrite)
  runTransactWrite(awsSdk, 'submitLibsDbParams'),
  // handle query errors
  handleQueryErrors(),
  // done
  (req, res, next) => {next()}
];
module.exports = submitLibsMiddleware;