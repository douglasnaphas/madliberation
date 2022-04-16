const DynamoDB = require("aws-sdk/clients/dynamodb");
const ApiGatewayManagementApi = require("aws-sdk/clients/apigatewaymanagementapi");
const schema = require("./schema");

const originalEnv = process.env;
afterEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
  process.env = originalEnv;
});

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
    const handler = require("./join").handler;
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
      WS_ENDPOINT: "100abc.execute-api.us-east-1.amazonaws.com/ws-roster",
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
      WS_ENDPOINT: "100abc.execute-api.us-east-1.amazonaws.com/ws-roster",
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
      WS_ENDPOINT: "100abc.execute-api.us-east-1.amazonaws.com/ws-roster",
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
      WS_ENDPOINT: "100abc.execute-api.us-east-1.amazonaws.com/ws-roster",
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
      const handler = require("./join").handler;
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
