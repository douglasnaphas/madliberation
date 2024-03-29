/**
 * Return middleware satisfying:
 * pre: req.query.roomcode is a String
 * post: res.locals.rosterDbParams is set to an object that will work as params
 * to DynamoDB's DocumentClient.query(), to retrieve participants' Game Names
 * @return Express middleware that sets res.locals.rosterDbParams based on
 * req.query.roomcode, or sends 500 on error
 */
function dbParams() {
  const responses = require("../../responses");
  const schema = require("../../schema");
  const logger = require("../../logger");
  const middleware = (req, res, next) => {
    if (!req.query.roomcode) {
      logger.log("dbParams: no roomcode in query");
      return res.status(500).send(responses.SERVER_ERROR);
    }
    res.locals.rosterDbParams = {
      ExpressionAttributeNames: {
        "#R": schema.PARTITION_KEY,
        "#L": schema.SORT_KEY,
      },
      ExpressionAttributeValues: {
        ":r": req.query.roomcode,
        ":l": schema.PARTICIPANT_PREFIX + schema.SEPARATOR,
      },
      KeyConditionExpression: "#R = :r AND begins_with(#L, :l)",
      ProjectionExpression:
        `${schema.SORT_KEY}, ` +
        `${schema.GAME_NAME}, ` +
        `${schema.EMAIL}, ` +
        `${schema.PARTICIPANT_PW}`,
      TableName: schema.TABLE_NAME,
    };
    return next();
  };
  return middleware;
}
module.exports = dbParams;
