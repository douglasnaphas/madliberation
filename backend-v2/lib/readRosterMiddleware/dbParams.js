/**
 * Return middleware satisfying:
 * pre: req.query.roomcode is a String
 * post: res.locals.readRosterDbParams is set to an object that will work as
 * params to DynamoDB's DocumentClient.query(), to retrieve participants' Game
 * Names and assignments arrays
 * @return Express middleware that sets res.locals.readRosterDbParams based on
 * req.query.roomcode, or sends 500 on error
 */
function dbParams() {
  const responses = require('../../responses');
  const schema = require('../../schema');
  const middleware = (req, res, next) => {
    if(!req.query.roomcode) {
      return res.status(500).send(responses.SERVER_ERROR);
    }
    res.locals.readRosterDbParams = {
      ExpressionAttributeNames: {
        '#R': schema.PARTITION_KEY,
        '#L': schema.SORT_KEY
      },
      ExpressionAttributeValues: {
        ':r': req.query.roomcode,
        ':l': schema.PARTICIPANT_PREFIX
      },
      KeyConditionExpression: '#R = :r AND begins_with(#L, :l)',
      ProjectionExpression: `${schema.GAME_NAME}, ${schema.ANSWERS}`,
      TableName: schema.TABLE_NAME
    };
    return next();
  };
  return middleware;
}
module.exports = dbParams;