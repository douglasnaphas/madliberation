const s3Params = require('./s3Params');
const awsSdk = require('aws-sdk');
const runS3Get = require('../runS3Get');
const handleS3Errors = require('../handleS3Errors');
const scriptInfo = require('./scriptInfo');
const dbParamsGetParticipants = require('./dbParamsGetParticipants');
const runQuery = require('../runQuery');
const handleQueryErrors = require('../handleQueryErrors');
const participants = require('./participants');
const assignments = require('./assignments');
const dbParamsAssignLibs = require('./dbParamsAssignLibs');
const runTransactWrites = require('../runTransactWrites');

/**
 * pre:
 *   1) req.body[api.POST_BODY_PARAMS.PATH] is set
 *   2) req.body.roomCode is set
 * post:
 *   1) libs are assigned in the database
 *   2) the seder in the database is updated with the script version
 */
const assignLibsMiddleware = [
  // set s3 params
  s3Params(),
  // run s3 get
  runS3Get(awsSdk, 'assignLibsS3Params'),
  // handle s3 errors
  handleS3Errors(),
  // save script info
  scriptInfo(),
  // set db params to get all participant sort keys
  dbParamsGetParticipants(),
  // run query
  runQuery(awsSdk, 'getParticipantsDbParams'),
  // handle query errors
  handleQueryErrors(),
  // save participants
  participants(),
  // compute lib assignments
  assignments(),
  // reset dbData, dbError
  (req, res, next) => {res.locals.dbData = res.locals.dbError = undefined;
    return next();},
  // set db params to
  //   - note the version of the script
  //   - assign libs, using repeated-if-necessary transactWrite calls updating
  //     participant items
  dbParamsAssignLibs(),
  // run queries
  runTransactWrites(awsSdk, 'assignLibsDbParams'),
  // handle db errors
  handleQueryErrors()
];
module.exports = assignLibsMiddleware;