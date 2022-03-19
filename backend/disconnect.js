const DynamoDB = require("aws-sdk/clients/dynamodb");
const schema = require("./schema");

exports.handler = async function (event, context, callback) {
  console.log("disconnect handler called");
  console.log("event:");
  console.log(event);
  console.log("context:");
  console.log(context);
  const db = new DynamoDB.DocumentClient();
  const now = new Date();
  var putParams = {
    TableName: process.env.TABLE_NAME,
    Item: {
      [schema.PARTITION_KEY]: `CHECK?PARAMS`, // need to see if event has params
      [schema.SORT_KEY]:
        `${schema.DISCONNECT}` +
        `${schema.SEPARATOR}` +
        `${event.requestContext.connectionId}`,
      [schema.CONNECTION_ID]: event.requestContext.connectionId,
      [schema.DATE]: now.toISOString(),
      [schema.MS]: now.getTime()
    },
  };

  try {
    // Insert incoming connection id in the WebSocket
    await db.put(putParams).promise();

    return {
      statusCode: 200,
      body: "Disconnected",
    };
  } catch (e) {
    console.error("disconnect error!", e);
    return {
      statusCode: 501,
      body: "Failed to disconnect: " + JSON.stringify(e),
    };
  }
};
