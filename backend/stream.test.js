const DynamoDB = require("aws-sdk/clients/dynamodb");
const ApiGatewayManagementApi = require("aws-sdk/clients/apigatewaymanagementapi");
const schema = require("./schema");

const originalEnv = process.env;
afterEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
  process.env = originalEnv;
});

describe("stream", () => {
  describe("join", () => {
    test("join should send message to leader", async () => {
      const event = {
        Records: [
          {
            eventID: "3039655ee86956cca1a75c6d9832380d",
            eventName: "INSERT",
            eventVersion: "1.1",
            eventSource: "aws:dynamodb",
            awsRegion: "us-east-1",
            dynamodb: {
              ApproximateCreationDateTime: 1648266963,
              Keys: {
                lib_id: {
                  S: "participant#a2fbc754b9ee1dc5a793eeb2c804c5e6cf962f680909050f28a69b6cdfdbab89",
                },
                room_code: {
                  S: "XRXCXA",
                },
              },
              NewImage: {
                game_name: {
                  S: "Le",
                },
                lib_id: {
                  S: "participant#a2fbc754b9ee1dc5a793eeb2c804c5e6cf962f680909050f28a69b6cdfdbab89",
                },
                room_code: {
                  S: "XRXCXA",
                },
                session_key: {
                  S: "ZYMZMJATVFGMHYOGCNUNPAWHWOOHHR",
                },
              },
              SequenceNumber: "37361200000000126165959494",
              SizeBytes: 246,
              StreamViewType: "NEW_AND_OLD_IMAGES",
            },
            eventSourceARN:
              "arn:aws:dynamodb:us-east-1:403958634573:table/DouglasnaphasMadliberation250-ws-roster-webapp-SedersTable7FFD9727-WW3J54QQ8OWQ/stream/2022-03-19T18:19:39.071",
          },
        ],
      };
      const mockQuery = jest.fn(() => {
        return {
          promise() {
            const data = {
              Items: [
                {
                  lib_id: "connect#PktBLdr_IAMCJxA=",
                  room_code: "XRXCXA",
                  date: "2022-03-26T03:56:04.897Z",
                  connection_id: "PktBLdr_IAMCJxA=",
                  ms: 1648266964897,
                },
              ],
              Count: 1,
              ScannedCount: 1,
            };
            return Promise.resolve(data);
          },
        };
      });
      const mockPostToConnection = jest.fn(() => {
        return {
          promise() {
            return Promise.resolve({});
          },
        };
      });
      jest.mock("aws-sdk/clients/dynamodb", () => {
        return {
          DocumentClient: jest.fn(() => {
            return {
              query: mockQuery,
            };
          }),
        };
      });
      // jest.mock("aws-sdk/clients/apigatewaymanagementapi", () => {
      //   return {
      //     postToConnection: mockPostToConnection,
      //   };
      // });
      jest.mock("aws-sdk/clients/apigatewaymanagementapi", () => {
        const f = jest.fn(() => {
          return {
            postToConnectin: mockPostToConnection,
          };
        });
        return f;
      });
      process.env.TABLE_NAME = "mad_liberation_table";
      const handler = require("./stream").handler;
      const result = await handler(event);
    });
  });
});
