const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const logger = require("./logger");
const schema = require("./schema");

exports.handler = async function (event, context, callback) {
  logger.log("connect-read handler called");
  logger.log("event:");
  logger.log(JSON.stringify(event));
  logger.log("context:");
  logger.log(JSON.stringify(context));

  // validate
  if (
    !event ||
    !event.queryStringParameters ||
    !event.queryStringParameters.sederCode ||
    !event.queryStringParameters.rpw
  ) {
    logger.log("missing queryStringParameters");
    return { statusCode: 400, body: "Bad request" };
  }
  if (!event.requestContext || !event.requestContext.connectionId) {
    logger.log("no event.requestContext.connectionId");
    return { statusCode: 500, body: "error getting connection id" };
  }

  const sederCode = event.queryStringParameters.sederCode;
  const rpw = event.queryStringParameters.rpw;
  const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
  const ddbClient = new DynamoDBClient({ region });
  const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
  const getRPWCommand = new GetCommand({
    TableName: schema.TABLE_NAME,
    Key: {
      [schema.PARTITION_KEY]: sederCode,
      [schema.SORT_KEY]: schema.READ_PW_PREFIX,
    },
  });
  const getRPWResponse = await ddbDocClient.send(getRPWCommand);
  if (
    !getRPWResponse ||
    !getRPWResponse.Item ||
    !getRPWResponse.Item[schema.READ_PW]
  ) {
    logger.log("returning 422, no rpw for this seder code");
    logger.log(getRPWResponse);
    return { statusCode: 422, body: "Cannot process seder code" };
  }
  const correctRPW = getRPWResponse.Item[schema.READ_PW];
  if (rpw !== correctRPW) {
    logger.log("wrong rpw");
    return { statusCode: 400, body: "bad seder code or rpw" };
  }
  const putConnectionIdCommand = new PutCommand({
    TableName: schema.TABLE_NAME,
    Item: {
      [schema.PARTITION_KEY]: sederCode,
      [schema.SORT_KEY]: `read-connection-id#${event.requestContext.connectionId}`,
      GSI1PK: `read-connection-id#${event.requestContext.connectionId}`,
      GSI1SK: (new Date()).toISOString()
    },
  });
  const putConnectionIdResponse = await ddbDocClient.send(
    putConnectionIdCommand
  );

  if (!putConnectionIdResponse) {
    logger.log("failed to save read connection id", putConnectionIdResponse);
    return { statusCode: 500, body: "failed to save read connection id" };
  }
  logger.log(`saved read connection id ${event.requestContext.connectionId}`);
};
