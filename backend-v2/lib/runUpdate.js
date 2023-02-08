/**
 * Return middleware satisfying:
 * pre: res.locals[paramsName] is set to an valid object for params to
 * aws-sdk.DynamoDB.DocumentClient.update
 * post: awsSdk.DynamoDB.DocumentClient.update is executed with the
 * supplied params, and res.locals.dbData and res.locals.dbError are populated
 * with the data and error from the execution
 * @param {Function} awsSdk An object providing aws-sdk's
 * DynamoDB.DocumentClient.update and DynamoDB.DocumentClient constructor
 * @param {String} paramsName The name of the res.locals property where the
 * params for this query are stored
 * @return {Function} Express middleware that executes transactWrite and calls
 * next, or sends 500 if res.locals[paramsName] is not defined
 */
function runTransactWrite(awsSdk, paramsName) {
  const middleware = async (req, res, next) => {
    const responses = require('../responses');
    if(!res.locals[paramsName]) {
      return res.status(500).send(responses.SERVER_ERROR);
    }
    const dynamodb = new awsSdk.DynamoDB.DocumentClient();
    const dbResponse = await new Promise((resolve, reject) => {
      dynamodb.update(res.locals[paramsName], (err, data) => {
        resolve({err: err, data: data});
      });
    });
    res.locals.dbError = dbResponse.err;
    res.locals.dbData = dbResponse.data;
    return next();
  };
  return middleware;
}
module.exports = runTransactWrite;