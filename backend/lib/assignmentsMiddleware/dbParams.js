/**
 * Return middleware satisfying:
 * pre:
 *   1) req.query.roomcode is a String
 *   2) req.query.gamename is a String
 * post: res.locals.assigmentsDbParams is set to an object that will work as
 * params to DynamoDB's DocumentClient.query(), to retrieve the participant's
 * assignments
 * @return Express middleware that sets res.locals.rosterDbParams based on
 * req.query.roomcode, or sends 500 on error
 */
function dbParams() {
  const responses = require('../../responses');
  const schema = require('../../schema');
  const DbSchema = require('../../DbSchema');
  const middleware = (req, res, next) => {
    if(!req.query.roomcode || !req.query.gamename) {
      return res.status(400).send(responses.BAD_REQUEST);
    }
    const roomCode = req.query.roomcode;
    const gameName = decodeURI(req.query.gamename);
    res.locals.assigmentsDbParams = {
      ExpressionAttributeNames: {
        '#R': schema.PARTITION_KEY,
        '#L': schema.SORT_KEY
      },
      ExpressionAttributeValues: {
        ':r': roomCode,
        ':l': DbSchema.sortKeyFromGameName(gameName)
      },
      KeyConditionExpression: '#R = :r AND #L = :l',
      ProjectionExpression: schema.ASSIGNMENTS,
      TableName: schema.TABLE_NAME
    };
    return next();
  };
  return middleware;
}
module.exports = dbParams;