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

const isJoin = (record) => {
  if (!record.dynamodb) {
    logger.log("no record.dynamodb");
    return false;
  }
  if (record.dynamodb.OldImage) {
    logger.log("record.dynamodb.OldImage");
    return false;
  }
  if (!record.dynamodb.NewImage) {
    logger.log("no record.dynamodb.NewImage");
    return false;
  }
  if (!record.dynamodb.NewImage[schema.SORT_KEY]) {
    logger.log(`no record.dynamodb.NewImage["${schema.SORT_KEY}"]`);
    return false;
  }
  if (!record.dynamodb.NewImage[schema.SORT_KEY].S) {
    logger.log(`no record.dynamodb.NewImage["${schema.SORT_KEY}"].S`);
    return false;
  }
  const re = new RegExp(`^${schema.PARTICIPANT_PREFIX}${schema.SEPARATOR}`);
  logger.log("re.test says:");
  logger.log(re.test(record.dynamodb.NewImage[schema.SORT_KEY].S));
  return re.test(record.dynamodb.NewImage[schema.SORT_KEY].S);
};
const handleJoin = async (record) => {
  logger.log("join");
  const dbQueryParams = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: `room_code = :rc and begins_with(lib_id, :prefix)`,
    ExpressionAttributeValues: {
      ":rc": record.dynamodb.NewImage[schema.PARTITION_KEY].S,
      ":prefix": `${schema.CONNECT}${schema.SEPARATOR}`,
    },
  };
  let queryData;
  try {
    queryData = await db.query(dbQueryParams).promise();
  } catch (e) {
    logger.log("error querying for connections");
    return { statusCode: 500, body: e.stack };
  }
  if (!queryData) {
    logger.log("no query data");
    return { statusCode: 500, body: "no query data" };
  }
  if (!Array.isArray(queryData.Items)) {
    logger.log("non-array Items, or missing Items");
    return { statusCode: 500, body: "no query data" };
  }
  const connectionIds = queryData.Items.map(
    (item) => item[schema.CONNECTION_ID]
  );
  for (let i = 0; i < connectionIds.length; i++) {
    const postToConnectionParams = {
      ConnectionId: connectionIds[i],
      Data: Buffer.from(record.dynamodb.NewImage.game_name.S),
    };
    try {
      await api.postToConnection(postToConnectionParams).promise();
    } catch (e) {
      logger.log("failed to postToConnection");
      logger.log(e);
      return { statusCode: 500, body: e.stack };
    }
  }
};

exports.handler = async function (event, context, callback) {
  let connections;
  logger.log("event:");
  logger.log(JSON.stringify(event));
  logger.log("context:");
  logger.log(JSON.stringify(context));

  logger.log("event.Records.length:");
  logger.log(event.Records.length);

  for (let r = 0; r < event.Records.length; r++) {
    logger.log("checking record...");
    if (!event.Records[r].dynamodb.NewImage) {
      logger.log("stream: no NewImage in record");
      logger.log(JSON.stringify(event));
      continue;
    }
    const record = event.Records[r];
    if (isJoin(record)) {
      await handleJoin(record);
      continue;
    }
  }

  try {
  } catch (e) {
    return { statusCode: 500, body: e.stack };
  }

  return { statusCode: 200, body: "Event sent." };
};
