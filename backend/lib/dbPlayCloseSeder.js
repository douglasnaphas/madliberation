async function db(req, res) {
  const awsSdk = require('aws-sdk');
  const Configs = require('../Configs');
  const schema = require('../schema');
  const dynamodb = new awsSdk.DynamoDB.DocumentClient();
  const roomCode = req.body.roomCode;
  let dbResponse;
  const params = {
    TransactItems: [
      {
        Update: {
          TableName: schema.TABLE_NAME,
          Key: {},
          UpdateExpression: 'SET #C = :t',
          ExpressionAttributeNames: {'#C': schema.CLOSED},
          ExpressionAttributeValues: {':t': true},
          ReturnValuesOnConditionCheckFailure: 'ALL_OLD',
          ConditionExpression: `attribute_exists(${schema.PARTITION_KEY})`
        }
      }
    ]
  };
  params.TransactItems[0].Update.Key[`${schema.PARTITION_KEY}`] = roomCode;
  params.TransactItems[0].Update.Key[`${schema.SORT_KEY}`] =
    schema.SEDER_PREFIX;
  dbResponse = await new Promise((resolve, reject) => {
    dynamodb.transactWrite(params, (err, data) => {
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