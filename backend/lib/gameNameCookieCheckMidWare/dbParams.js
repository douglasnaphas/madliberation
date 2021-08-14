/**
 * Return middleware satisfying:
 * pre: res.locals.roomCode and res.locals.gameName are set to Strings
 * post: res.locals.gameNameCookieDbParams is set to an object that will work as
 * params to DynamoDB's DocumentClient.query(), to retrieve the session key for
 * the selected participant
 * @return Express middleware that sets res.locals.gameNameCookieDbParams based
 * on res.locals.roomCode and res.locals.gameName, or sends 500 on error
 */
function dbParams() {
  const responses = require('../../responses');
  const schema = require('../../schema');
  const DbSchema = require('../../DbSchema');
  const middleware = (req, res, next) => {
    if(!res.locals.roomCode || !res.locals.gameName) {
      return res.status(500).send(responses.SERVER_ERROR);
    }
    res.locals.gameNameCookieDbParams = {
      ExpressionAttributeNames: {
        '#R': schema.PARTITION_KEY,
        '#L': schema.SORT_KEY
      },
      ExpressionAttributeValues: {
        ':r': res.locals.roomCode,
        ':l': DbSchema.sortKeyFromGameName(res.locals.gameName)
      },
      KeyConditionExpression: '#R = :r AND #L = :l',
      ProjectionExpression: schema.SESSION_KEY,
      TableName: schema.TABLE_NAME
    };
    return next();
  };
  return middleware;
}
module.exports = dbParams;