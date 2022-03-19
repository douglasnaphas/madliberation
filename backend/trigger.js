const ApiGatewayManagementApi = require("aws-sdk/clients/apigatewaymanagementapi");
const DynamoDB = require("aws-sdk/clients/dynamodb");

exports.handler = async function (event, context, callback) {
  const db = new DynamoDB.DocumentClient();
  let connections;
  console.log("event:");
  console.log(event);
  console.log("context:");
  console.log(context);

  try {
  } catch (e) {
    return { statusCode: 500, body: e.stack };
  }

  const api = new ApiGatewayManagementApi({
    endpoint: process.env.WS_ENDPOINT,
  });

  try {
  } catch (e) {
    return { statusCode: 500, body: e.stack };
  }

  return { statusCode: 200, body: "Event sent." };
};
