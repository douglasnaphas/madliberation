const ApiGatewayManagementApi = require("aws-sdk/clients/apigatewaymanagementapi");
const DynamoDB = require("aws-sdk/clients/dynamodb");
const db = new DynamoDB.DocumentClient();
const api = new ApiGatewayManagementApi({
  endpoint: process.env.WS_ENDPOINT,
});
const { WS_ENDPOINT } = process.env;

exports.handler = async function (event, context, callback) {
  console.log(
    "process.env.WS_ENDPOINT during initialization, then in handler:"
  );
  console.log(WS_ENDPOINT);
  console.log(process.env.WS_ENDPOINT);
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
