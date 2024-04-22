const {
  DynamoDBDocumentClient,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const schema = require("./schema");

exports.handler = async function (event, context, callback) {
  console.log("disconnect-read-roster handler called");
  console.log("event:");
  console.log(JSON.stringify(event));
  console.log("context:");
  console.log(JSON.stringify(context));
  if (!event.requestContext || !event.requestContext.connectionId) {
    console.log("no event.requestContext.connectionId");
    return { statusCode: 500, body: "error getting connection id" };
  }
  const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
  const ddbClient = new DynamoDBClient({ region });
  const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
  const deleteReadRosterConnectionCommand = new DeleteCommand({
    TableName: schema.TABLE_NAME,
    Key: {
      [schema.PARTITION_KEY]: `${schema.READ_ROSTER_CONNECTION_ID}${schema.SEPARATOR}${event.requestContext.connectionId}`,
      [schema.SORT_KEY]: schema.READ_ROSTER_SOCKET_CONNECTION,
    },
  });
  try {
    await ddbDocClient.send(deleteReadRosterConnectionCommand);
    console.log(`deleted read roster connection ${event.requestContext.connectionId}`);
    return {
      statusCode: 200,
      body: "Disconnected",
    };
  } catch (deleteReadRosterConnectionError) {
    console.log("deleteReadRosterConnectionError", deleteReadRosterConnectionError);
    return { statusCode: 500, body: "failed to delete read roster connection" };
  }
};
