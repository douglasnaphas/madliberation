import {
  Handler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

export const connectHandler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log("Connect Event:", event);
  console.log("Connect context:", context);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: `connected at ${new Date()}` }),
  };
};

export const defaultHandler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log("Default Event:", event);
  console.log("Default context:", context);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: `defaulted at ${new Date()}` }),
  };
};

export const disconnectHandler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log("Disconnect Event:", event);
  console.log("Disconnect context:", context);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: `disconnected at ${new Date()}` }),
  };
};

// import { Handler } from 'aws-lambda'

// import * as DynamoClient from 'clients/dynamo'
// import publishToConnections from 'actions/publishToConnections'

// const connectHandler: Handler = async (event) => {
//   console.log('Connect Event:', event)
//   try {
//     const ConnectionId = event.requestContext.connectionId
//     const RoomCode = event.queryStringParameters.RoomCode
//     const Name = event.queryStringParameters.Name

//     const Event = await DynamoClient.connect(RoomCode, ConnectionId, Name)
//     const Connections = publishToConnections(RoomCode, ConnectionId, Event)

//     return { statusCode: 200, body: JSON.stringify({ Connections }) }
//   } catch (e) {
//     console.error('error!', e)
//     return { statusCode: 500, body: 'Failed to connect:' + JSON.stringify(e) }
//   }
// }

// export default connectHandler
