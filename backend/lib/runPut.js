/**
 * Return middleware satisfying:
 * pre: res.locals[paramsName] is set to an valid object for params to
 * aws-sdk.DynamoDB.DocumentClient.put
 * post: awsSdk.DynamoDB.DocumentClient.put is executed with the
 * supplied params, and res.locals.dbData and res.locals.dbError are populated
 * with the data and error from the execution
 * @param {Function} awsSdk An object providing aws-sdk's
 * DynamoDB.DocumentClient.put and DynamoDB.DocumentClient constructor
 * @param {String} paramsName The name of the res.locals property where the
 * params for this put are stored
 * @return {Function} Express middleware that executes put and calls next,
 * or sends 500 if res.locals[paramsName] is not defined
 */
function runPut(awsSdk, paramsName) {
  const middleware = async (req, res, next) => {
    const responses = require('../responses');
    if(!res.locals[paramsName]) {
      return res.status(500).send(responses.SERVER_ERROR);
    }
    const dynamodb = new awsSdk.DynamoDB.DocumentClient();
    const dbResponse = await new Promise((resolve, reject) => {
      dynamodb.put(res.locals[paramsName], (err, data) => {
        resolve({err: err, data: data});
      });
    });
    res.locals.dbError = dbResponse.err;
    res.locals.dbData = dbResponse.data;
    return next();
  };
  return middleware;
}
module.exports = runPut;