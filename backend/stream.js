/**
 * Let participants know when new participants join the seder.
 */
const schema = require("./schema");
const ApiGatewayManagementApi = require("aws-sdk/clients/apigatewaymanagementapi");
const DynamoDB = require("aws-sdk/clients/dynamodb");
const db = new DynamoDB.DocumentClient();
const api = new ApiGatewayManagementApi({
  endpoint: process.env.WS_ENDPOINT,
});

const isJoin = (record) => {
  if (!record.dynamodb) {
    return false;
  }
  if (record.dynamodb.OldImage) {
    return false;
  }
  if (!record.dynamodb.NewImage) {
    return false;
  }
  if (!record.dynamodb.NewImage[schema.SORT_KEY]) {
    return false;
  }
  const re = new RegExp(`^${schema.PARTICIPANT_PREFIX}${schema.SEPARATOR}`);
  return re.test(record.dynamodb.NewImage[schema.SORT_KEY]);
};
const handleJoin = () => {
  console.log("join");
};

exports.handler = async function (event, context, callback) {
  let connections;
  console.log("event:");
  console.log(JSON.stringify(event));
  console.log("context:");
  console.log(JSON.stringify(context));

  for (let r = 0; r < event.Records.length; r++) {
    if (!event.Records[r].dynamodb.NewImage) {
      console.log("stream: no NewImage in record");
      console.log(JSON.stringify(event));
      continue;
    }
    const record = event.Records[r];
    if(isJoin(record)) {
      handleJoin();
    }
  }

  try {
  } catch (e) {
    return { statusCode: 500, body: e.stack };
  }

  try {
  } catch (e) {
    return { statusCode: 500, body: e.stack };
  }

  return { statusCode: 200, body: "Event sent." };
};
