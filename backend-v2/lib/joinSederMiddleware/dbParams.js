/**
 * Return middleware satisfying:
 * pre: req.body.roomCode, req.body.gameName, res.locals.gameNameHash, and
 * res.locals.gameNameSessionKey are set to Strings
 * post: res.locals.joinSederDbParams is set to an object that will work as
 * params to DynamoDB's transactWrite, to:
 *   1) fail if the roomCode does not correspond to an existing un-expired
 *   seder,
 *   2) fail if a participant with the requested Game Name is already at the
 *   seder, or
 *   3) write the requested Game Name into the seders table with the
 *   gameNameSessionKey otherwise
 * @param {Date} now A Date object that the max seder age will count back from
 * @param {Object} configs An object with a function msToJoinSeder that returns
 * the number milliseconds players have to join seders
 * @return Express middleware that sets res.locals.joinSederDbParams based on
 * req.body and res.locals and calls next, or sends 500 on error
 */
function dbParams(now, configs) {
  const schema = require('../../schema');
  const responses = require('../../responses');
  const minCreated = now.getTime() - configs.msToJoinSeder();
  const middleware = (req, res, next) => {
    if(!req || !req.body || !req.body.roomCode || !req.body.gameName || !res ||
      !res.locals || !res.locals.gameNameHash || !res.locals.gameNameSessionKey)
    {
      return res.status(500).send(responses.SERVER_ERROR);
    }
    res.locals.joinSederDbParams = {
      TransactItems: [
        {
          ConditionCheck: {
            ConditionExpression: 'attribute_exists(room_code) AND #C > :mc' +
              ' AND attribute_not_exists(closed)',
            Key: {},
            TableName: schema.TABLE_NAME,
            ReturnValuesOnConditionCheckFailure: 'ALL_OLD',
            ExpressionAttributeNames: {
              '#C': schema.CREATED
            },
            ExpressionAttributeValues: {
              ':mc': minCreated
            }
          }
        },
        {
          Put: {
            Item: {},
            ConditionExpression: 'attribute_not_exists(room_code) AND ' +
              'attribute_not_exists(lib_id)',
            TableName: schema.TABLE_NAME,
            ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
          }
        }
      ]
    };
    res.locals.joinSederDbParams.TransactItems[0].ConditionCheck.Key
      [`${schema.PARTITION_KEY}`] = req.body.roomCode;
    res.locals.joinSederDbParams.TransactItems[0].ConditionCheck.Key
      [`${schema.SORT_KEY}`] = schema.SEDER_PREFIX;
    res.locals.joinSederDbParams.TransactItems[1].Put.Item
      [`${schema.PARTITION_KEY}`] = req.body.roomCode;
    res.locals.joinSederDbParams.TransactItems[1].Put.Item
      [`${schema.SORT_KEY}`] = schema.PARTICIPANT_PREFIX + schema.SEPARATOR + 
      res.locals.gameNameHash;
    res.locals.joinSederDbParams.TransactItems[1].Put.Item
      [`${schema.SESSION_KEY}`] = res.locals.gameNameSessionKey;
    res.locals.joinSederDbParams.TransactItems[1].Put.Item
      [`${schema.GAME_NAME}`] = req.body.gameName;
    if(res.locals.userEmail) {
      res.locals.joinSederDbParams.TransactItems[1].Put.Item
        [`${schema.USER_EMAIL}`] = res.locals.userEmail;
    }
    return next();
  };
  return middleware;
}

module.exports = dbParams;