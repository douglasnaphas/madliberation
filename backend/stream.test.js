const DynamoDB = require("aws-sdk/clients/dynamodb");
const ApiGatewayManagementApi = require("aws-sdk/clients/apigatewaymanagementapi");
const schema = require("./schema");

const originalEnv = process.env;
beforeEach(() => {
  process.env.WS_WAIT_ENDPOINT =
    "100abc.execute-api.us-east-1.amazonaws.com/ws-wait";
});
afterEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
  process.env = originalEnv;
});

describe("stream", () => {
  describe("join", () => {
    test("buffs", () => {
      let buff1 = Buffer.from("ab");
      let buff2 = Buffer.from("ab");
      let buff3 = Buffer.from("ac");
      expect(buff1).toEqual(buff2);
      expect(buff1).not.toEqual(buff3);
    });
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
      jest.mock("aws-sdk/clients/apigatewaymanagementapi", () => {
        const f = jest.fn(() => {
          return {
            postToConnection: mockPostToConnection,
          };
        });
        return f;
      });
      process.env.TABLE_NAME = "mad_liberation_table";
      const handler = require("./stream").handler;
      const result = await handler(event);
    });
    test.each([
      // happy path 1
      {
        description: "happy path 1",
        event: {
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
        },
        WS_ENDPOINT: "100abc.execute-api.us-east-1.amazonaws.com/ws",
        TABLE_NAME: "the_1_table",
        expectedDbQueryParams: {
          TableName: "the_1_table",
          KeyConditionExpression: `room_code = :rc and begins_with(lib_id, :prefix)`,
          ExpressionAttributeValues: {
            ":rc": "XRXCXA",
            ":prefix": "connect#",
          },
        },
        queryData: {
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
        },
        expectedPostToConnectionParams: {
          ConnectionId: "PktBLdr_IAMCJxA=",
          Data: Buffer.from(JSON.stringify({ newParticipant: "Le" })),
        },
        postToConnectionData: {},
        postToConnectionOutcomes: [true],
        expectedStatusCode: 200,
      },
      // failed post
      {
        description: "failed post",
        event: {
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
        },
        WS_ENDPOINT: "100abc.execute-api.us-east-1.amazonaws.com/ws",
        TABLE_NAME: "the_1_table",
        expectedDbQueryParams: {
          TableName: "the_1_table",
          KeyConditionExpression: `room_code = :rc and begins_with(lib_id, :prefix)`,
          ExpressionAttributeValues: {
            ":rc": "XRXCXA",
            ":prefix": "connect#",
          },
        },
        queryData: {
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
        },
        expectedPostToConnectionParams: {
          ConnectionId: "PktBLdr_IAMCJxA=",
          Data: Buffer.from(JSON.stringify({ newParticipant: "Le" })),
        },
        postToConnectionData: {},
        postToConnectionOutcomes: [false],
        expectedStatusCode: 200,
      },
      // multiple items, all successful posts
      {
        description: "multiple items, all successful posts",
        event: {
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
        },
        WS_ENDPOINT: "100abc.execute-api.us-east-1.amazonaws.com/ws",
        TABLE_NAME: "the_1_table",
        expectedDbQueryParams: {
          TableName: "the_1_table",
          KeyConditionExpression: `room_code = :rc and begins_with(lib_id, :prefix)`,
          ExpressionAttributeValues: {
            ":rc": "XRXCXA",
            ":prefix": "connect#",
          },
        },
        queryData: {
          Items: [
            {
              lib_id: "connect#PktBLdr_IAMCJxA=",
              room_code: "XRXCXA",
              date: "2022-03-26T03:56:04.897Z",
              connection_id: "PktBLdr_IAMCJxA=",
              ms: 1648266964897,
            },
            {
              lib_id: "connect#BBBBLdr_IAMCJxA=",
              room_code: "XRXCXA",
              date: "2022-03-26T03:56:04.897Z",
              connection_id: "BBBBLdr_IAMCJxA=",
              ms: 1648266964997,
            },
            {
              lib_id: "connect#CCCBLdr_IAMCJxA=",
              room_code: "XRXCXA",
              date: "2022-03-26T03:56:04.897Z",
              connection_id: "CCCBLdr_IAMCJxA=",
              ms: 1648266965126,
            },
          ],
          Count: 3,
          ScannedCount: 3,
        },
        expectedPostToConnectionParams: [
          {
            ConnectionId: "PktBLdr_IAMCJxA=",
            Data: Buffer.from(JSON.stringify({ newParticipant: "Le" })),
          },
          {
            ConnectionId: "BBBBLdr_IAMCJxA=",
            Data: Buffer.from(JSON.stringify({ newParticipant: "Le" })),
          },
          {
            ConnectionId: "CCCBLdr_IAMCJxA=",
            Data: Buffer.from(JSON.stringify({ newParticipant: "Le" })),
          },
        ],
        postToConnectionData: {},
        postToConnectionOutcomes: [true, true, true],
        expectedStatusCode: 200,
      },
      // multiple items, some failed posts, some successes
      {
        description: "multiple items, some failed posts, some successes",
        event: {
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
        },
        WS_ENDPOINT: "100abc.execute-api.us-east-1.amazonaws.com/ws",
        TABLE_NAME: "the_1_table",
        expectedDbQueryParams: {
          TableName: "the_1_table",
          KeyConditionExpression: `room_code = :rc and begins_with(lib_id, :prefix)`,
          ExpressionAttributeValues: {
            ":rc": "XRXCXA",
            ":prefix": "connect#",
          },
        },
        queryData: {
          Items: [
            {
              lib_id: "connect#PktBLdr_IAMCJxA=",
              room_code: "XRXCXA",
              date: "2022-03-26T03:56:04.897Z",
              connection_id: "PktBLdr_IAMCJxA=",
              ms: 1648266964897,
            },
            {
              lib_id: "connect#BBBBLdr_IAMCJxA=",
              room_code: "XRXCXA",
              date: "2022-03-26T03:56:04.897Z",
              connection_id: "BBBBLdr_IAMCJxA=",
              ms: 1648266964997,
            },
            {
              lib_id: "connect#CCCBLdr_IAMCJxA=",
              room_code: "XRXCXA",
              date: "2022-03-26T03:56:04.897Z",
              connection_id: "CCCBLdr_IAMCJxA=",
              ms: 1648266965126,
            },
          ],
          Count: 3,
          ScannedCount: 3,
        },
        expectedPostToConnectionParams: [
          {
            ConnectionId: "PktBLdr_IAMCJxA=",
            Data: Buffer.from(JSON.stringify({ newParticipant: "Le" })),
          },
          {
            ConnectionId: "BBBBLdr_IAMCJxA=",
            Data: Buffer.from(JSON.stringify({ newParticipant: "Le" })),
          },
          {
            ConnectionId: "CCCBLdr_IAMCJxA=",
            Data: Buffer.from(JSON.stringify({ newParticipant: "Le" })),
          },
        ],
        postToConnectionData: {},
        postToConnectionOutcomes: [true, false, true],
        expectedStatusCode: 200,
      },
      // multiple stream Records
    ])(
      "$description",
      async ({
        event,
        WS_ENDPOINT,
        TABLE_NAME,
        expectedDbQueryParams,
        queryData,
        expectedPostToConnectionParams,
        postToConnectionData,
        postToConnectionOutcomes,
        expectedStatusCode,
      }) => {
        const MOCK_WS_ENDPOINT = WS_ENDPOINT;
        function* queryDataGenerator() {
          if (!Array.isArray(queryData)) {
            yield queryData;
          } else {
            for (let i = 0; i < queryData.length; i++) {
              yield queryData[i];
            }
          }
        }
        const queryDataSeries = queryDataGenerator();
        const mockQuery = jest.fn(() => {
          return {
            promise() {
              return Promise.resolve(queryDataSeries.next().value);
            },
          };
        });
        function* postToConnectionGenerator() {
          for (let p = 0; p < postToConnectionOutcomes.length; p++) {
            yield postToConnectionOutcomes[p];
          }
        }
        const postToConnectionSequence = postToConnectionGenerator();
        const mockPostToConnection = jest.fn(() => {
          return {
            promise() {
              if (postToConnectionSequence.next().value) {
                return Promise.resolve(postToConnectionData);
              }
              return Promise.reject("failed postToConnection");
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
        process.env.TABLE_NAME = TABLE_NAME;
        process.env.WS_ENDPOINT = MOCK_WS_ENDPOINT;
        const MockApiGatewayManagementApi = jest.fn(({ endpoint }) => {
          if (endpoint == MOCK_WS_ENDPOINT) {
            return {
              postToConnection: mockPostToConnection,
            };
          }
        });
        jest.mock("aws-sdk/clients/apigatewaymanagementapi", () => {
          return MockApiGatewayManagementApi;
        });
        const handler = require("./stream").handler;
        const result = await handler(event);
        expect(result.statusCode).toEqual(expectedStatusCode);
        expect(MockApiGatewayManagementApi).toHaveBeenCalledWith({
          endpoint: WS_ENDPOINT,
        });
        if (expectedDbQueryParams) {
          expect(mockQuery).toHaveBeenCalledWith(expectedDbQueryParams);
        }
        if (expectedPostToConnectionParams) {
          if (Array.isArray(expectedPostToConnectionParams)) {
            expect(mockPostToConnection).toHaveBeenCalledTimes(
              expectedPostToConnectionParams.length
            );
            for (let i = 0; i < expectedPostToConnectionParams.length; i++) {
              expect(mockPostToConnection).toHaveBeenCalledWith(
                expectedPostToConnectionParams[i]
              );
            }
          } else {
            expect(mockPostToConnection).toHaveBeenCalledWith(
              expectedPostToConnectionParams
            );
          }
        }
      }
    );
  });
  describe("assign", () => {
    test.each([
      // happy path 1: multiple Records, 1 assign, 1 participant connection
      {
        description:
          "happy path 1: multiple Records, 1 assign, 1 participant connection",
        event: {
          Records: [
            {
              eventID: "89b3ca1cfedb84b4192b46fc371391e9",
              eventName: "MODIFY",
              eventVersion: "1.1",
              eventSource: "aws:dynamodb",
              awsRegion: "us-east-1",
              dynamodb: {
                ApproximateCreationDateTime: 1649529042,
                Keys: {
                  lib_id: {
                    S: "seder",
                  },
                  room_code: {
                    S: "HGKYIQ",
                  },
                },
                NewImage: {
                  path: {
                    S: "douglasnaphasmadliberation2-scriptsbucket40feb4b1-a36u593vsscd/004-Practice_Script",
                  },
                  lib_id: {
                    S: "seder",
                  },
                  created: {
                    N: "1649528937085",
                  },
                  room_code: {
                    S: "HGKYIQ",
                  },
                  closed: {
                    BOOL: true,
                  },
                  timestamp: {
                    S: "2022-04-09T18:28:57.085Z",
                  },
                },
                OldImage: {
                  path: {
                    S: "douglasnaphasmadliberation2-scriptsbucket40feb4b1-a36u593vsscd/004-Practice_Script",
                  },
                  lib_id: {
                    S: "seder",
                  },
                  created: {
                    N: "1649528937085",
                  },
                  room_code: {
                    S: "HGKYIQ",
                  },
                  timestamp: {
                    S: "2022-04-09T18:28:57.085Z",
                  },
                },
                SequenceNumber: "106969200000000002006747361",
                SizeBytes: 353,
                StreamViewType: "NEW_AND_OLD_IMAGES",
              },
              eventSourceARN:
                "arn:aws:dynamodb:us-east-1:403958634573:table/DouglasnaphasMadliberation250-ws-roster-webapp-SedersTable7FFD9727-WW3J54QQ8OWQ/stream/2022-03-19T18:19:39.071",
            },
            {
              eventID: "06c6b939a5c61b8f812576610b9003c8",
              eventName: "MODIFY",
              eventVersion: "1.1",
              eventSource: "aws:dynamodb",
              awsRegion: "us-east-1",
              dynamodb: {
                ApproximateCreationDateTime: 1649529042,
                Keys: {
                  lib_id: {
                    S: "seder",
                  },
                  room_code: {
                    S: "HGKYIQ",
                  },
                },
                NewImage: {
                  path: {
                    S: "douglasnaphasmadliberation2-scriptsbucket40feb4b1-a36u593vsscd/004-Practice_Script",
                  },
                  lib_id: {
                    S: "seder",
                  },
                  created: {
                    N: "1649528937085",
                  },
                  room_code: {
                    S: "HGKYIQ",
                  },
                  closed: {
                    BOOL: true,
                  },
                  script_version: {
                    S: "ep18f7QWc8mO6s5WvAi816I6YgsBG.uA",
                  },
                  timestamp: {
                    S: "2022-04-09T18:28:57.085Z",
                  },
                },
                OldImage: {
                  path: {
                    S: "douglasnaphasmadliberation2-scriptsbucket40feb4b1-a36u593vsscd/004-Practice_Script",
                  },
                  lib_id: {
                    S: "seder",
                  },
                  created: {
                    N: "1649528937085",
                  },
                  room_code: {
                    S: "HGKYIQ",
                  },
                  closed: {
                    BOOL: true,
                  },
                  timestamp: {
                    S: "2022-04-09T18:28:57.085Z",
                  },
                },
                SequenceNumber: "106969300000000002006747600",
                SizeBytes: 406,
                StreamViewType: "NEW_AND_OLD_IMAGES",
              },
              eventSourceARN:
                "arn:aws:dynamodb:us-east-1:403958634573:table/DouglasnaphasMadliberation250-ws-roster-webapp-SedersTable7FFD9727-WW3J54QQ8OWQ/stream/2022-03-19T18:19:39.071",
            },
            {
              eventID: "db18df195b1eb7ee4fb5d458565d5cf7",
              eventName: "MODIFY",
              eventVersion: "1.1",
              eventSource: "aws:dynamodb",
              awsRegion: "us-east-1",
              dynamodb: {
                ApproximateCreationDateTime: 1649529042,
                Keys: {
                  lib_id: {
                    S: "participant#acbbb742c7524cecdec7557d60e4a19af062346309ce5731c88485c7daf48982",
                  },
                  room_code: {
                    S: "HGKYIQ",
                  },
                },
                NewImage: {
                  game_name: {
                    S: "P2",
                  },
                  user_email: {
                    S: "voEQTUSd@example.com",
                  },
                  assignments: {
                    L: [
                      {
                        M: {
                          sentence: {
                            S: "This is a _",
                          },
                          defaultAnswer: {
                            S: "snake",
                          },
                          id: {
                            N: "3",
                          },
                          prompt: {
                            S: "long thing",
                          },
                        },
                      },
                      {
                        M: {
                          sentence: {
                            S: "She _",
                          },
                          defaultAnswer: {
                            S: "leaves with the seder plate",
                          },
                          id: {
                            N: "1",
                          },
                          prompt: {
                            S: "does something disruptive",
                          },
                        },
                      },
                      {
                        M: {
                          defaultAnswer: {
                            S: "industry-leading",
                          },
                          id: {
                            N: "10",
                          },
                          prompt: {
                            S: "tech buzz word",
                          },
                          example: {
                            S: "Big Data",
                          },
                        },
                      },
                      {
                        M: {
                          defaultAnswer: {
                            S: "a silly fool",
                          },
                          id: {
                            N: "11",
                          },
                          prompt: {
                            S: "a person who doesn’t know anything",
                          },
                        },
                      },
                      {
                        M: {
                          sentence: {
                            S: "We will write on __.",
                          },
                          defaultAnswer: {
                            S: "dry erase boards",
                          },
                          id: {
                            N: "8",
                          },
                          prompt: {
                            S: "things you could technically write on",
                          },
                          example: {
                            S: "bananas",
                          },
                        },
                      },
                      {
                        M: {
                          sentence: {
                            S: "That day is __.",
                          },
                          defaultAnswer: {
                            S: "Pentecost",
                          },
                          id: {
                            N: "12",
                          },
                          prompt: {
                            S: "a holiday",
                          },
                        },
                      },
                    ],
                  },
                  lib_id: {
                    S: "participant#acbbb742c7524cecdec7557d60e4a19af062346309ce5731c88485c7daf48982",
                  },
                  room_code: {
                    S: "HGKYIQ",
                  },
                  session_key: {
                    S: "VFPPCJYNBLXQMBEIVITEFLOEMJQHWE",
                  },
                },
                OldImage: {
                  game_name: {
                    S: "P2",
                  },
                  user_email: {
                    S: "voEQTUSd@example.com",
                  },
                  lib_id: {
                    S: "participant#acbbb742c7524cecdec7557d60e4a19af062346309ce5731c88485c7daf48982",
                  },
                  room_code: {
                    S: "HGKYIQ",
                  },
                  session_key: {
                    S: "VFPPCJYNBLXQMBEIVITEFLOEMJQHWE",
                  },
                },
                SequenceNumber: "106969400000000002006747603",
                SizeBytes: 983,
                StreamViewType: "NEW_AND_OLD_IMAGES",
              },
              eventSourceARN:
                "arn:aws:dynamodb:us-east-1:403958634573:table/DouglasnaphasMadliberation250-ws-roster-webapp-SedersTable7FFD9727-WW3J54QQ8OWQ/stream/2022-03-19T18:19:39.071",
            },
            // this is the assign
            {
              eventID: "38c3a5161cf3f4f601648c7464b1f4b4",
              eventName: "MODIFY",
              eventVersion: "1.1",
              eventSource: "aws:dynamodb",
              awsRegion: "us-east-1",
              dynamodb: {
                ApproximateCreationDateTime: 1649529042,
                Keys: {
                  lib_id: {
                    S: "participant#a2fbc754b9ee1dc5a793eeb2c804c5e6cf962f680909050f28a69b6cdfdbab89",
                  },
                  room_code: {
                    S: "HGKYIQ",
                  },
                },
                NewImage: {
                  game_name: {
                    S: "Le",
                  },
                  assignments: {
                    L: [
                      {
                        M: {
                          sentence: {
                            S: "Let’s use __.",
                          },
                          defaultAnswer: {
                            S: "steam engines",
                          },
                          id: {
                            N: "7",
                          },
                          prompt: {
                            S: "archaic machines",
                          },
                        },
                      },
                      {
                        M: {
                          sentence: {
                            S: "That is __.",
                          },
                          defaultAnswer: {
                            S: "Claude Monet",
                          },
                          id: {
                            N: "4",
                          },
                          prompt: {
                            S: "three-syllable person/place/thing that rhymes with “ay”",
                          },
                          example: {
                            S: "my bidet",
                          },
                        },
                      },
                      {
                        M: {
                          sentence: {
                            S: "This is __.",
                          },
                          defaultAnswer: {
                            S: "a blank space",
                          },
                          id: {
                            N: "6",
                          },
                          prompt: {
                            S: "something non-informative",
                          },
                        },
                      },
                      {
                        M: {
                          sentence: {
                            S: "I like to _",
                          },
                          defaultAnswer: {
                            S: "read him",
                          },
                          id: {
                            N: "5",
                          },
                          prompt: {
                            S: "verb",
                          },
                        },
                      },
                      {
                        M: {
                          sentence: {
                            S: "This is _",
                          },
                          defaultAnswer: {
                            S: "a damn lib",
                          },
                          id: {
                            N: "2",
                          },
                          prompt: {
                            S: "something fast and heavy",
                          },
                        },
                      },
                      {
                        M: {
                          sentence: {
                            S: "She would __",
                          },
                          defaultAnswer: {
                            S: "blow trumpets",
                          },
                          id: {
                            N: "9",
                          },
                          prompt: {
                            S: "take a conspicuous action",
                          },
                          example: {
                            S: "quack like a duck",
                          },
                        },
                      },
                    ],
                  },
                  lib_id: {
                    S: "participant#a2fbc754b9ee1dc5a793eeb2c804c5e6cf962f680909050f28a69b6cdfdbab89",
                  },
                  room_code: {
                    S: "HGKYIQ",
                  },
                  session_key: {
                    S: "EBWPHWGYIXISTHQGJSAUYDEHYBLHDB",
                  },
                },
                OldImage: {
                  game_name: {
                    S: "Le",
                  },
                  lib_id: {
                    S: "participant#a2fbc754b9ee1dc5a793eeb2c804c5e6cf962f680909050f28a69b6cdfdbab89",
                  },
                  room_code: {
                    S: "HGKYIQ",
                  },
                  session_key: {
                    S: "EBWPHWGYIXISTHQGJSAUYDEHYBLHDB",
                  },
                },
                SequenceNumber: "106969500000000002006747604",
                SizeBytes: 975,
                StreamViewType: "NEW_AND_OLD_IMAGES",
              },
              eventSourceARN:
                "arn:aws:dynamodb:us-east-1:403958634573:table/DouglasnaphasMadliberation250-ws-roster-webapp-SedersTable7FFD9727-WW3J54QQ8OWQ/stream/2022-03-19T18:19:39.071",
            },
          ],
        },
        TABLE_NAME: "one_table",
        expectedDbQueryParams: {
          TableName: "one_table",
          KeyConditionExpression: `room_code = :rc and begins_with(lib_id, :prefix)`,
          ExpressionAttributeValues: {
            ":rc": "HGKYIQ",
            ":prefix": "connect#wait#Le#",
          },
        },
        queryData: {
          Items: [
            {
              lib_id: "connect#wait#Le#PvsmLdr_IAMCJyB=",
              room_code: "HGKYIQ",
              date: "2022-03-26T03:56:04.897Z",
              connection_id: "PvsmLdr_IAMCJyB=",
              ms: 1648266964897,
            },
          ],
          Count: 1,
          ScannedCount: 1,
        },
        expectedPostToConnectionWsWaitParams: [
          {
            ConnectionId: "PvsmLdr_IAMCJyB=",
            Data: Buffer.from("assignments_ready"),
          },
        ],
        postToConnectionData: {},
        postToConnectionWsWaitOutcomes: [true],
        expectedStatusCode: 200,
      },
      // happy path 2: multiple Records, 1 assign, 1 participant connection
      // no assign Records
      // multiple connections
    ])(
      "$description",
      async ({
        description,
        event,
        TABLE_NAME,
        expectedDbQueryParams,
        queryData,
        expectedPostToConnectionWsWaitParams,
        postToConnectionData,
        postToConnectionWsWaitOutcomes,
        expectedStatusCode,
      }) => {
        const MOCK_WS_ENDPOINT =
          "100abc.execute-api.us-east-1.amazonaws.com/ws";
        function* queryDataGenerator() {
          if (!Array.isArray(queryData)) {
            yield queryData;
          } else {
            for (let i = 0; i < queryData.length; i++) {
              yield queryData[i];
            }
          }
        }
        const queryDataSeries = queryDataGenerator();
        const mockQuery = jest.fn(() => {
          return {
            promise() {
              return Promise.resolve(queryDataSeries.next().value);
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
        function* postToConnectionGenerator(outcomes) {
          for (let p = 0; p < outcomes.length; p++) {
            yield outcomes[p];
          }
        }
        // /ws/



        // /ws-wait/
        const postToConnectionSequenceWsWait = postToConnectionGenerator(postToConnectionWsWaitOutcomes);
        const mockPostToConnectionWsWait = jest.fn(() => {
          return {
            promise() {
              if (postToConnectionSequence.next().value) {
                return Promise.resolve(postToConnectionData);
              }
              return Promise.reject("failed postToConnection");
            },
          };
        });
        
        process.env.TABLE_NAME = TABLE_NAME;
        process.env.WS_ENDPOINT = MOCK_WS_ENDPOINT;
        const MockApiGatewayManagementApi = jest.fn(({ endpoint }) => {
          if (endpoint == MOCK_WS_ENDPOINT) {
            return {
              postToConnection: mockPostToConnectionWsWait,
            };
          }
        });
      }
    );
  });
  describe("assign and join", () => {
    test.each([
      // 2 assigns, 2 joins, 1 nothing, all different room codes
      {},
    ]);
  });
});
