/**
 * Return middleware satisfying:
 * pre: res.locals[paramsName] is set to an valid object for params to
 * aws-sdk.DynamoDB.DocumentClient.query
 * post: awsSdk.DynamoDB.DocumentClient.query is executed with the
 * supplied params, and res.locals.dbData and res.locals.dbError are populated
 * with the data and error from the execution
 * @param {Function} awsSdk An object providing aws-sdk's
 * DynamoDB.DocumentClient.query and DynamoDB.DocumentClient constructor
 * @param {String} paramsName The name of the res.locals property where the
 * params for this query are stored
 * @param {String} errorName The name of a property of res.locals where the
 * error from the DynamoDB API call should be stored, in addition to
 * res.locals.dbError
 * @param {String} dataName The name of a property of res.locals where the
 * data from the DynamoDB API call should be stored, in addition to
 * res.locals.dbData
 * @param {String} local A res.locals property to condition the logic on; if
 * local is a non-zero length string and res.locals[local] is defined, next()
 * should be called immediately by the middleware, with no database API calls
 * executed
 * @return {Function} Express middleware that executes query and calls next,
 * or sends 500 if res.locals[paramsName] is not defined
 */
function runQuery(awsSdk, paramsName, errorName, dataName, local) {
  const middleware = async (req, res, next) => {
    if(local && !res.locals[local]) return next();
    const responses = require('../responses');
    if(!res.locals[paramsName]) {
      return res.status(500).send(responses.SERVER_ERROR);
    }
    const dynamodb = new awsSdk.DynamoDB.DocumentClient();
    const dbResponse = await new Promise((resolve, reject) => {
      dynamodb.query(res.locals[paramsName], (err, data) => {
        resolve({err: err, data: data});
      });
    });
    res.locals.dbError = dbResponse.err;
    res.locals.dbData = dbResponse.data;
    if(errorName) {
      res.locals[errorName] = dbResponse.err;
    }
    if(dataName) {
      res.locals[dataName] = dbResponse.data;
    }
    return next();
  };
  return middleware;
}
module.exports = runQuery;