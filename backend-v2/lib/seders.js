const responses = require("../responses");
const logger = require("../logger");
const dbParamsQuerySedersIndex = require("./dbParamsQuerySedersIndex");
const awsSdk = require("aws-sdk");
const runQuery = require("./runQuery");
const sedersResponse = require("./sedersResponse");

const seders = [                                 // saved in res.locals:
  // if no res.locals.userEmail, 400
  (req, res, next) => {
    if(!res.locals.userEmail) {
      logger.log(`seders: no userEmail`);
      return res.sendStatus(400);
    }
    return next();
  },
  // dbParams to query the seders index
  dbParamsQuerySedersIndex(
    "dbParamsQuerySedersIndex"
  ),                                             // dbParamsQuerySedersIndex
  // run query
  runQuery(
    awsSdk,
    "dbParamsQuerySedersIndex",
    "dbErrorSeders",
    "dbDataSeders"
  ),                                             // db{Error,Data}Seders
  // send HTTP response
  sedersResponse()
];
module.exports = seders;