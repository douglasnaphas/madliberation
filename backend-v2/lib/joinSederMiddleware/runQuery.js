/**
 * Return middleware satisfying:
 * pre: res.locals.joinSederDbParams is set to an valid object for params to
 * aws-sdk.DynamoDB.DocumentClient.transactWrite
 * post: awsSdk.DynamoDB.DocumentClient.transactWrite is executed with the
 * supplied params, and res.locals.dbData and res.locals.dbError are populated
 * with the data and error from the execution
 * @param {Function} awsSdk An object providing aws-sdk's
 * DynamoDB.DocumentClient.transactWrite and DynamoDB.DocumentClient constructor
 * @return {Function} Express middleware that executes transactWrite
 */
function runQuery(awsSdk) {
  const middleware = async (req, res, next) => {
    const responses = require('../../responses');
    if(!res.locals.joinSederDbParams) {
      return res.status(500).send(responses.SERVER_ERROR);
    }
    const dynamodb = new awsSdk.DynamoDB.DocumentClient();
    const dbResponse = await new Promise((resolve, reject) => {
      dynamodb.transactWrite(res.locals.joinSederDbParams, (err, data) => {
        resolve({err: err, data: data});
      });
    });
    res.locals.dbError = dbResponse.err;
    res.locals.dbData = dbResponse.data;
    return next();
  };
  return middleware;
}
module.exports = runQuery;