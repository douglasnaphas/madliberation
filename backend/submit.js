/**
 * Let participants know when new participants join the seder.
 */
const schema = require("./schema");
const logger = require("./logger");
const ApiGatewayManagementApi = require("aws-sdk/clients/apigatewaymanagementapi");
const DynamoDB = require("aws-sdk/clients/dynamodb");
const db = new DynamoDB.DocumentClient();
const api = new ApiGatewayManagementApi({
  endpoint: process.env.WS_ENDPOINT,
});

const handleSubmit = async (record) => {
  const gameName = record.dynamodb.NewImage.game_name.S;
  if (!gameName) {
    logger.log("submit: no game name");
    return;
  }
  const dbQueryParams = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: `room_code = :rc and begins_with(lib_id, :prefix)`,
    ExpressionAttributeValues: {
      ":rc": record.dynamodb.NewImage[schema.PARTITION_KEY].S,
      ":prefix":
        `${schema.CONNECT}${schema.SEPARATOR}${schema.READ_ROSTER}` +
        `${schema.SEPARATOR}${gameName}${schema.SEPARATOR}`,
    },
  };
  logger.log("dbQueryParams:");
  logger.log(JSON.stringify(dbQueryParams));
  let queryData;
  try {
    queryData = await db.query(dbQueryParams).promise();
  } catch (e) {
    logger.log("error querying for connections");
    logger.log(e);
    logger.log(JSON.stringify(dbQueryParams));
    return;
  }
  if (!queryData) {
    logger.log("no query data");
    return;
  }
  logger.log("queryData:");
  logger.log(JSON.stringify(queryData));
  if (!Array.isArray(queryData.Items)) {
    logger.log("non-array Items, or missing Items");
    return;
  }
  const connectionIds = queryData.Items.map(
    (item) => item[schema.CONNECTION_ID]
  );
  logger.log("connectionIds:");
  logger.log(JSON.stringify(connectionIds));
  for (let i = 0; i < connectionIds.length; i++) {
    const postToConnectionParams = {
      ConnectionId: connectionIds[i],
      Data: Buffer.from("read_roster_update"),
    };
    logger.log("postToConnectionParams:");
    logger.log(JSON.stringify(postToConnectionParams));
    try {
      await api.postToConnection(postToConnectionParams).promise();
    } catch (e) {
      logger.log("failed to postToConnection");
      logger.log(e);
    }
  }
};

exports.handler = async function (event, context, callback) {
  logger.log("event:");
  logger.log(JSON.stringify(event));
  logger.log("context:");
  logger.log(JSON.stringify(context));

  logger.log("event.Records.length:");
  logger.log(event.Records.length);

  for (let r = 0; r < event.Records.length; r++) {
    logger.log("checking record...");
    const record = event.Records[r];
    await handleSubmit(record);
  }

  return { statusCode: 200, body: "Event sent." };
};
