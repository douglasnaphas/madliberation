/**
 * Save the session info for the request's Room Code, Game Name pair in the DB,
 * specifically the cookie value for this Game Name.
 * @param {Function} awsSdk An object with a DynamoDB.DocumentClient() function
 * that returns an object with an implementation of the AWS SDK DocumentClient's
 * update function.
 */
function createSession(awsSdk) {
  const schema = require('../schema');
  const middleware = async (req, res, next) => {
    if(!req.body ||
      !req.body.roomCode ||
      !req.body.gameName ||
      !req.cookies ||
      !req.cookies[req.body.gameName]) {
      return res.status(400).send();  
    }
    const dynamodb = new awsSdk.DynamoDB.DocumentClient();
    const roomCode = req.body.roomCode;
    const gameName = req.body.gameName;
    const sessionKey = req.cookies[gameName];
    const params = {
      ExpressionAttributeNames: {
        '#P': 'participant',
        '#S': 'session_key'
      },
      ExpressionAttributeValues: {
        ':p': gameName,
        ':s': sessionKey
      },
      Key: {
        'room_code': roomCode,
        'lib_id': 'participant'
      },
      TableName: schema.TABLE_NAME,
      UpdateExpression: 'SET #P = :p, #S = :s',
    };
    const dbResponse = await new Promise((resolve, reject) => {
      dynamodb.update(params, (err, data) => {
        if (err) {
          resolve({madliberation_error: err});
        } else {
          resolve(data);
        }
      });
    });
    
    if(dbResponse.madliberation_error) {
      res.status(500).send({error: 'server error'});
    }
    
    return next();
  };
  return middleware;
}

module.exports = createSession;