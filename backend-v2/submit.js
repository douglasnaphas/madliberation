const {
  DynamoDBDocumentClient,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} = require("@aws-sdk/client-apigatewaymanagementapi");
const schema = require("./schema");

exports.handler = async function (event) {
  console.log("event", JSON.stringify(event));
  for (let r = 0; r < event.Records.length; r++) {
    const record = event.Records[r];
    const sederCode = record.dynamodb.NewImage[schema.PARTITION_KEY].S;
    const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
    const ddbClient = new DynamoDBClient({ region });
    const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
    const apiGwClient = new ApiGatewayManagementApiClient({ region });

    // get all the read connections
    const queryForReadConnectionsCommand = new QueryCommand({
      TableName: schema.TABLE_NAME,
      IndexName: "GSI1",
      KeyConditionExpression: `GSI1PK = :pk`,
      ExpressionAttributeValues: {
        ":pk": `${schema.SEDER_CODE}${schema.SEPARATOR}${sederCode}`,
      },
    });
    const queryForReadConnectionsResponse = await ddbDocClient.send(
      queryForReadConnectionsCommand
    );
    if (!queryForReadConnectionsResponse) {
      console.log("failed to query for read connections");
      console.log(queryForReadConnectionsResponse);
    }
    if (!queryForReadConnectionsResponse.Items) {
      console.log("No Items");
    }

    // for each one, let them know to re-fetch the script
    if (
      queryForReadConnectionsResponse &&
      Array.isArray(queryForReadConnectionsResponse.Items)
    ) {
      const readConnections = queryForReadConnectionsResponse.Items;
      const endpoint = `wss://${process.env.READ_ENDPOINT}`;
      const apiGatewayManagementApiClient = new ApiGatewayManagementApiClient({
        region,
        endpoint,
      });

      for (let c = 0; c < readConnections.length; c++) {
        const { ConnectionId } = readConnections[c];
        console.log(`notifying ${ConnectionId}`);
        const postToConnectionRequest = {
          Data: Buffer.from("answer submitted"),
          ConnectionId,
        };
        const postToConnectionCommand = new PostToConnectionCommand(
          postToConnectionRequest
        );
        try {
          const postToConnectionResponse =
            await apiGatewayManagementApiClient.send(postToConnectionCommand);
          console.log(postToConnectionResponse);
        } catch (postToConnectionError) {
          console.log("postToConnectionError", postToConnectionError);
        }
      }
    }
  }
};
