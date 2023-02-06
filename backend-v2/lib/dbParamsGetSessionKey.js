/**
 * Return middleware satisfying:
 * pre: res.locals{roomCode,gameName,userEmail} are set to Strings
 * post: res.locals.dbParamsGetSessionKey is set to an object that will work as
 * params to DynamoDB's DocumentClient.query(), to retrieve the session key for
 * the selected participant
 * @return Express middleware that sets res.locals.dbParamsGetSessionKey based
 * on res.locals.roomCode and res.locals.gameName, or sends 500 on error
 */
function dbParamsGetSessionKey() {
  const responses = require('../responses');
  const schema = require('../schema');
  const DbSchema = require('../DbSchema');
  const logger = require("../logger");
  const middleware = (req, res, next) => {
    if(!res.locals.roomCode ||
       !res.locals.gameName ||
       !res.locals.userEmail) {
      logger.log({
        message: 'dbParamsGetSessionKey: missing local(s)',
        roomCode: res.locals.roomCode,
        gameName: res.locals.gameName,
        userEmail: res.locals.userEmail
      })
      return res.status(500).send(responses.SERVER_ERROR);
    }
    res.locals.dbParamsGetSessionKey = {
      ExpressionAttributeNames: {
        '#R': schema.PARTITION_KEY,
        '#L': schema.SORT_KEY,
        '#UE': schema.USER_EMAIL
      },
      ExpressionAttributeValues: {
        ':r': res.locals.roomCode,
        ':l': DbSchema.sortKeyFromGameName(res.locals.gameName),
        ':ue': res.locals.userEmail
      },
      KeyConditionExpression: '#R = :r AND #L = :l',
      ProjectionExpression: schema.SESSION_KEY,
      TableName: schema.TABLE_NAME,
      FilterExpression: '#UE = :ue'
    };
    return next();
  };
  return middleware;
}
module.exports = dbParamsGetSessionKey;