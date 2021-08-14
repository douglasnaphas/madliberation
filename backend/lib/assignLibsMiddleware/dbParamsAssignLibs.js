/**
 * pre:
 *   1) req.body.roomCode is set
 *   2) res.locals.participants is an array of objects like:
 *        {lib_id: 'participant#abcdef0123456789',
 *         libs: [
 *           {id: 1, prompt: 'this is a lib'}
 *         ]}
 *   3) res.locals.scriptVersion is set
 * post: res.locals.assignLibsDbParams is set to an array of objects, the first
 * of which will set the script version and set the first 9 participant lib
 * sets. Objects after the first in the array will set further participant lib
 * sets, in groups of 10.
 */
function dbParams() {
  const schema = require('../../schema');
  const responses = require('../../responses');
  const Logger = require('../../lib/Logger');
  const middleware = (req, res, next) => {
    if(!req.body.roomCode ||
       !res.locals.scriptVersion ||
       !res.locals.participants ||
       !Array.isArray(res.locals.participants) ||
       res.locals.participants.length < 1)
    {
      Logger.log({status: 500, event: 'assignLibsMiddleware/dbParamsAssignLibs',
        roomCode: req.body.roomCode, ob: [res.locals.scriptVersion,
        Array.isArray(res.locals.participants)]
      });
      return res.status(500).send(responses.SERVER_ERROR);
    }
    res.locals.assignLibsDbParams = [
      {
        TransactItems: [
          {
            Update: {
              TableName: schema.TABLE_NAME,
              Key: {},
              UpdateExpression: 'SET #V = :v',
              ExpressionAttributeNames: {'#V': schema.SCRIPT_VERSION},
              ExpressionAttributeValues: {':v': res.locals.scriptVersion},
              ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
            }
          }
        ]
      }
    ];
    res.locals.assignLibsDbParams[0].TransactItems[0].Update.Key
      [`${schema.PARTITION_KEY}`] = req.body.roomCode;
    res.locals.assignLibsDbParams[0].TransactItems[0].Update.Key
      [`${schema.SORT_KEY}`] = schema.SEDER_PREFIX;
    const paramsNeeded = 1 + Math.floor(res.locals.participants.length / 10);
    for(let i = 1; i < paramsNeeded; i++) {
      res.locals.assignLibsDbParams.push({TransactItems: []});
    }
    // update each participant Item
    const participantUpdates = res.locals.participants.forEach((participant,
      index) => {
      const updateItem = {
        Update: {
          TableName: schema.TABLE_NAME,
          Key: {},
          UpdateExpression: 'SET #A = :a',
          ExpressionAttributeNames: {'#A': schema.ASSIGNMENTS},
          ExpressionAttributeValues: { ':a':
            participant.libs
          },
          ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
        }
      };
      updateItem.Update.Key[`${schema.PARTITION_KEY}`] = req.body.roomCode;
      updateItem.Update.Key[`${schema.SORT_KEY}`] = participant.lib_id;
      const paramsIndex = Math.floor((index + 1) / 10);
      res.locals.assignLibsDbParams[paramsIndex].TransactItems.push(updateItem);
    });
    return next();
  };
  return middleware;
}

module.exports = dbParams;