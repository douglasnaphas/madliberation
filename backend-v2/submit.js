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

    // get all the read and read roster connections
    const queryForConnectionsCommand = new QueryCommand({
      TableName: schema.TABLE_NAME,
      IndexName: "GSI1",
      KeyConditionExpression: `GSI1PK = :pk AND GSI1SK IN (:sk1, :sk2)`,
      ExpressionAttributeValues: {
        ":pk": `${schema.SEDER_CODE}${schema.SEPARATOR}${sederCode}`,
        ":sk1": schema.READ_PAGE_SOCKET_CONNECTION,
        ":sk2": schema.READ_ROSTER_SOCKET_CONNECTION,
      },
    });
    const queryForConnectionsResponse = await ddbDocClient.send(
      queryForConnectionsCommand
    );
    if (!queryForConnectionsResponse) {
      console.log("failed to query for read connections");
      console.log(queryForConnectionsResponse);
    }
    if (!queryForConnectionsResponse.Items) {
      console.log("No Items");
    }

    // for each one, let them know to re-fetch
    if (
      queryForConnectionsResponse &&
      Array.isArray(queryForConnectionsResponse.Items)
    ) {
      const readConnections = queryForConnectionsResponse.Items;
      const readEndpoint = `https://${process.env.READ_ENDPOINT}`;
      const readRosterEndpoint = `https://${process.env.READ_ROSTER_ENDPOINT}`;
      const readClient = new ApiGatewayManagementApiClient({
        region,
        endpoint: readEndpoint,
      });
      const readRosterClient = new ApiGatewayManagementApiClient({
        region,
        endpoint: readRosterEndpoint,
      });

      for (let c = 0; c < readConnections.length; c++) {
        const { ConnectionId } = readConnections[c];
        const { GSI1PK: socketType } = readConnections[c];
        console.log(`notifying ${ConnectionId}, type ${socketType}`);
        const postToConnectionRequest = {
          Data: Buffer.from("answer submitted"),
          ConnectionId,
        };
        const postToConnectionCommand = new PostToConnectionCommand(
          postToConnectionRequest
        );
        try {
          if (socketType === schema.READ_PAGE_SOCKET_CONNECTION) {
            const postToConnectionResponse = await readClient.send(
              postToConnectionCommand
            );
            console.log(postToConnectionResponse);
          }
          if (socketType === schema.READ_ROSTER_SOCKET_CONNECTION) {
            const postToConnectionResponse = await readRosterClient.send(
              postToConnectionCommand
            );
            console.log(postToConnectionResponse);
          }
        } catch (postToConnectionError) {
          console.log("postToConnectionError", postToConnectionError);
        }
      }
    }
  }
};
