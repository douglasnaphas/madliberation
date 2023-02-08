async function db(req, res) {
  // get all the participants at a seder
  
  const awsSdk = require('aws-sdk');
  const Configs = require('../Configs');
  const dynamodb = new awsSdk.DynamoDB.DocumentClient();
  let dbResponse;
  
  const schema = require('../schema');
  const params = {
    ExpressionAttributeNames: {
      '#R': 'room_code',
      '#L': 'lib_id'
    },
    ExpressionAttributeValues: {
      ':l': 'participant'
    },
    KeyConditionExpression: '#R = :r AND #L = :l',
    ProjectionExpression: 'session_key',
    TableName: schema.TABLE_NAME
  };
  dbResponse = await new Promise((resolve, reject) => {
    dynamodb.query(params, (err, data) => {
      if (err) {
        resolve({madliberation_error: err});
      } else {
        resolve(data);
      }
    });
  });
  res.send(dbResponse);

}

module.exports = db;