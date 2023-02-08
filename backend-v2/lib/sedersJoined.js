const responses = require("../responses");
const logger = require("../logger");
const dbParamsQueryParticipantsIndex =
  require("./dbParamsQueryParticipantsIndex");
const awsSdk = require("aws-sdk");
const runQuery = require("./runQuery");
const sedersResponse = require("./sedersResponse");

const sedersJoined = [                        // saved in res.locals:
  // if no res.locals.userEmail, 400
  (req, res, next) => {
    if(!res.locals.userEmail) {
      logger.log(`seders: no userEmail`);
      return res.sendStatus(400);
    }
    return next();
  },
  // dbParams to query the seders index
  dbParamsQueryParticipantsIndex(
    "dbParamsQueryParticipantsIndex"
  ),                                          // dbParamsQueryParticpantsIndex
  // run query
  runQuery(
    awsSdk,
    "dbParamsQueryParticipantsIndex",
    "dbErrorSeders",
    "dbDataSeders"
  ),                                          // db{Error,Data}Seders
  // send HTTP response
  sedersResponse()
];
module.exports = sedersJoined;