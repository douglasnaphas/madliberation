async function db(req, res) {
  const awsSdk = require('aws-sdk');
  const Configs = require('../Configs');
  const schema = require('../schema');
  const dynamodb = new awsSdk.DynamoDB.DocumentClient();
  const roomCode = req.body.roomCode;
  const partLibId = req.body.partLibId;
  let dbResponse;
  res.send('done');

}

module.exports = db;