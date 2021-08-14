/**
 * Return middleware satisfying:
 * pre: req.query.roomcode is a String
 * post: res.locals.querySederParams is set to an object that will work as
 * params to DynamoDB's DocumentClient.query(), to retrieve the seder's path
 * and version
 * @return Express middleware that sets res.locals.querySederParams based on
 * req.query.roomcode, or sends 500 on error
 */
function querySederParams() {
  const responses = require('../../responses');
  const schema = require('../../schema');
  const middleware = (req, res, next) => {
    if(!req.query.roomcode) {
      return res.status(500).send(responses.SERVER_ERROR);
    }
    res.locals.querySederParams = {
      ExpressionAttributeNames: {
        '#R': schema.PARTITION_KEY,
        '#P': schema.PATH
      },
      ExpressionAttributeValues: {
        ':r': req.query.roomcode
      },
      KeyConditionExpression: '#R = :r',
      ProjectionExpression: `#P, ${schema.SCRIPT_VERSION}, ${schema.ANSWERS}`
        + `, ${schema.ASSIGNMENTS}`,
      TableName: schema.TABLE_NAME
    };
    return next();
  };
  return middleware;
}
module.exports = querySederParams;