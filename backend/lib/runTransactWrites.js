/**
 * Return middleware satisfying:
 * pre: res.locals[paramsName] is set to an array of valid objects for params to
 * aws-sdk.DynamoDB.DocumentClient.transactWrite
 * post: awsSdk.DynamoDB.DocumentClient.transactWrite is executed with the
 * supplied params, and res.locals.dbData and res.locals.dbError are populated
 * as arrays with the data and error from each execution
 * @param {Function} awsSdk An object providing aws-sdk's
 * DynamoDB.DocumentClient.transactWrite and DynamoDB.DocumentClient constructor
 * @param {String} paramsName The name of the res.locals property where the
 * params for this query are stored
 * @return {Function} Express middleware that executes transactWrite and calls
 * next, or sends 500 if res.locals[paramsName] is not defined
 */
function runTransactWrites(awsSdk, paramsName) {
  const middleware = async (req, res, next) => {
    const responses = require('../responses');
    if(!res.locals[paramsName] || !Array.isArray(res.locals[paramsName])) {
      return res.status(500).send(responses.SERVER_ERROR);
    }
    const dynamodb = new awsSdk.DynamoDB.DocumentClient();
    let dbResponse;
    const dbErrors = [];
    const dbDatas = [];
    for(let i = 0; i < res.locals[paramsName].length; i++) {
      dbResponse = await new Promise((resolve, reject) => {
        dynamodb.transactWrite(res.locals[paramsName][i], (err, data) => {
          resolve({err: err, data: data});
        });
      });
      dbErrors.push(dbResponse.err);
      dbDatas.push(dbResponse.data);
    }
    
    res.locals.dbError = dbErrors;
    res.locals.dbData = dbDatas;
    return next();
  };
  return middleware;
}
module.exports = runTransactWrites;