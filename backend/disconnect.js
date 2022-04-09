const DynamoDB = require("aws-sdk/clients/dynamodb");
const db = new DynamoDB.DocumentClient();
const schema = require("./schema");
const logger = require("./logger");

exports.handler = async function (event, context, callback) {
  logger.log("disconnect handler called");
  logger.log("event:");
  logger.log(event);
  logger.log("context:");
  logger.log(context);
  const now = new Date();
  var putParams = {
    TableName: process.env.TABLE_NAME,
    Item: {
      [schema.PARTITION_KEY]: event.requestContext.connectionId,
      [schema.SORT_KEY]: `${schema.DISCONNECT}` + `${schema.SEPARATOR}`,
      [schema.CONNECTION_ID]: event.requestContext.connectionId,
      [schema.DATE]: now.toISOString(),
      [schema.MS]: now.getTime(),
    },
  };

  try {
    await db.put(putParams).promise();
    return {
      statusCode: 200,
      body: "Disconnected",
    };
  } catch (e) {
    logger.log("disconnect error!", JSON.stringify(e));
    return {
      statusCode: 501,
      body: "Failed to disconnect",
    };
  }
};
