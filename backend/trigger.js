const ApiGatewayManagementApi = require("aws-sdk/clients/apigatewaymanagementapi");
const DynamoDB = require("aws-sdk/clients/dynamodb");
const db = new DynamoDB.DocumentClient();
const api = new ApiGatewayManagementApi({
  endpoint: process.env.WS_ENDPOINT,
});

exports.handler = async function (event, context, callback) {
  let connections;
  console.log("event:");
  console.log(event);
  console.log("context:");
  console.log(context);

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
