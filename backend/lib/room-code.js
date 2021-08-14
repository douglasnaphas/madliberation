/**
 * Return an Express-friendly function that returns a Room Code for a specified
 * script. The Room Code is six uppercase letters and has not been issued
 * before.
 * @param {Function} awsSdk An object with an implementation of the AWS SDK
 *   method DynamoDB.
 * @param {Function*} roomCodeGenerator A Generator that yields a series of
 *   room codes, default roomCodeGenerator.js.
 * @param configs An object with a roomCodeRetries method that returns an int.
 * @return {Function(Request, Response)} A function that can be used with an
 *   Express JS route like app.post('/endpoint', roomCode(awsSdk)).
 */
function roomCode(awsSdk, roomCodeGenerator, configs) {
  const schema = require('../schema');
  const logger = require("../logger");
  
  const f = async (req, res) => {
    if(! req ||
       ! req.body ||
       ! req.body.path) {
      res.status(400).send();
    }
    roomCodeGenerator = roomCodeGenerator || require('./randomCapGenerator');
    const roomCodeSequence = roomCodeGenerator({ letters: 6 });
    
    const dynamodb = new awsSdk.DynamoDB();
    let code;
    let params;
    let dbResponse;
    let success;
    success = false;
    const attempts = configs.roomCodeRetries();
    for(let i = 0; ! success && i < attempts; i++) {
      code = roomCodeSequence.next().value;
      const now = new Date();
      params = {
        TableName: schema.TABLE_NAME,
        Item: {
          'room_code': {
            S: code
          },
          'lib_id': {
            S: schema.SEDER_PREFIX
          },
          'timestamp': {
            S: now.toISOString()
          },
          'created': {
            N: now.getTime().toString()
          },
          'path': {
            S: req.body.path
          }
        },
        ConditionExpression: 'attribute_not_exists(room_code)'
      };
      if(res.locals.userEmail) {
        params.Item[schema.USER_EMAIL] = {
          S: res.locals.userEmail
        }
      }
      dbResponse = await new Promise((resolve, reject) => {
        dynamodb.putItem(params, (err, data) => {
          if (err) {
            logger.log(`room-code: error from putItem: ${err}`);
            resolve({ err: 'Mad Liberation server error' });
          }
          else {
            resolve({ roomCode: code });
          }
        });
      });
      if(dbResponse.err) {
        logger.log(`room-code: collision, code: ${code}`);
      } else if(dbResponse.roomCode) {
        success = true;
        return res.send({ roomCode: dbResponse.roomCode });
      }
    }
    logger.log(`room-code: failed to generate room code`);
    return res.status(500).send({error: 'could not generate room code'});
  }
  return f;
}
module.exports = roomCode;