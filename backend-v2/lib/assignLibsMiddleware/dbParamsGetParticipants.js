/**
 * Return middleware satisfying:
 * pre: req.body.roomRode is a String
 * post: res.locals.getParticipantsDbParams is set to an object that will work
 * as params to DynamoDB's DocumentClient.query(), to retrieve participants'
 * sort keys, which are 'participant#' followed by the hash of the Game Name
 * @return Express middleware that sets res.locals.getParticipantsDbParams based
 * on req.query.roomcode, or sends 500 on error
 */
function dbParams() {
  const responses = require('../../responses');
  const schema = require('../../schema');
  const logger = require("../../logger")
  const middleware = (req, res, next) => {
    if(!res.locals.roomCode) {
      logger.log("dbParamsGetParticipants: no roomCode")
      return res.status(500).send(responses.SERVER_ERROR);
    }
    res.locals.getParticipantsDbParams = {
      ExpressionAttributeNames: {
        '#R': schema.PARTITION_KEY,
        '#L': schema.SORT_KEY
      },
      ExpressionAttributeValues: {
        ':r': res.locals.roomCode,
        ':l': schema.PARTICIPANT_PREFIX
      },
      KeyConditionExpression: '#R = :r AND begins_with(#L, :l)',
      ProjectionExpression: schema.SORT_KEY,
      TableName: schema.TABLE_NAME
    };
    return next();
  };
  return middleware;
}
module.exports = dbParams;