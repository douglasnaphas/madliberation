const DynamoDB = require("aws-sdk/clients/dynamodb");
const ApiGatewayManagementApi = require("aws-sdk/clients/apigatewaymanagementapi");
const schema = require("./schema");

const originalEnv = process.env;
beforeEach(() => {
  process.env.WS_ENDPOINT =
    "100abc.execute-api.us-east-1.amazonaws.com/ws-wait";
});
afterEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
  process.env = originalEnv;
});

describe("assign", () => {
  test.each([
    // happy path 1: 1 Record, 1 participant connection
    {
      description: "happy path 1: 1 Record, 1 participant connection",
      event: {
        Records: [
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
      expectedPostToConnectionParams: [
        {
          ConnectionId: "PvsmLdr_IAMCJyB=",
          Data: Buffer.from("assignments_ready"),
        },
      ],
      postToConnectionData: {},
      postToConnectionOutcomes: [true],
      expectedStatusCode: 200,
    },
    // happy path 2: 1 Record, 1 participant connection",
    {
      description: "happy path 2: 1 Record, 1 participant connection",
      event: {
        Records: [
          {
            eventID: "22c3a5161cf3f4f601648c7464b1f4b4",
            eventName: "MODIFY",
            eventVersion: "1.1",
            eventSource: "aws:dynamodb",
            awsRegion: "us-east-1",
            dynamodb: {
              ApproximateCreationDateTime: 1649529142,
              Keys: {
                lib_id: {
                  S: "participant#b2fbc754b9ee1dc5a793eeb2c804c5e6cf962f680909050f28a69b6cdfdbab89",
                },
                room_code: {
                  S: "BBKYIQ",
                },
              },
              NewImage: {
                game_name: {
                  S: "Me Sir",
                },
                assignments: {
                  L: [
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
                  S: "participant#b2fbc754b9ee1dc5a793eeb2c804c5e6cf962f680909050f28a69b6cdfdbab89",
                },
                room_code: {
                  S: "BBKYIQ",
                },
                session_key: {
                  S: "BBWPHWGYIXISTHQGJSAUYDEHYBLHDB",
                },
              },
              OldImage: {
                game_name: {
                  S: "Me Sir",
                },
                lib_id: {
                  S: "participant#b2fbc754b9ee1dc5a793eeb2c804c5e6cf962f680909050f28a69b6cdfdbab89",
                },
                room_code: {
                  S: "BBKYIQ",
                },
                session_key: {
                  S: "BBWPHWGYIXISTHQGJSAUYDEHYBLHDB",
                },
              },
              SequenceNumber: "106969500000000002006747624",
              SizeBytes: 975,
              StreamViewType: "NEW_AND_OLD_IMAGES",
            },
            eventSourceARN:
              "arn:aws:dynamodb:us-east-1:403958634573:table/DouglasnaphasMadliberation250-ws-roster-webapp-SedersTable7FFD9727-WW3J54QQ8OWQ/stream/2022-03-19T18:19:39.071",
          },
        ],
      },
      TABLE_NAME: "one_table2",
      expectedDbQueryParams: {
        TableName: "one_table2",
        KeyConditionExpression: `room_code = :rc and begins_with(lib_id, :prefix)`,
        ExpressionAttributeValues: {
          ":rc": "BBKYIQ",
          ":prefix": "connect#wait#Me Sir#",
        },
      },
      queryData: {
        Items: [
          {
            lib_id: "connect#wait#Me Sir#PbbmLdr_IAMCJyB=",
            room_code: "BBKYIQ",
            date: "2022-03-27T03:56:04.897Z",
            connection_id: "PbbmLdr_IAMCJyB=",
            ms: 1648267964897,
          },
        ],
        Count: 1,
        ScannedCount: 1,
      },
      expectedPostToConnectionParams: [
        {
          ConnectionId: "PbbmLdr_IAMCJyB=",
          Data: Buffer.from("assignments_ready"),
        },
      ],
      postToConnectionData: {},
      postToConnectionOutcomes: [true],
      expectedStatusCode: 200,
    },
    // multiple Records, multiple connections, failed posts
    {
      description: "multiple Records, multiple connections, failed posts",
      event: {
        Records: [
          {
            eventID: "22c3a5161cf3f4f601648c7464b1f4b4",
            eventName: "MODIFY",
            eventVersion: "1.1",
            eventSource: "aws:dynamodb",
            awsRegion: "us-east-1",
            dynamodb: {
              ApproximateCreationDateTime: 1649529142,
              Keys: {
                lib_id: {
                  S: "participant#b2fbc754b9ee1dc5a793eeb2c804c5e6cf962f680909050f28a69b6cdfdbab89",
                },
                room_code: {
                  S: "BBKYIQ",
                },
              },
              NewImage: {
                game_name: {
                  S: "Me Sir",
                },
                assignments: {
                  L: [
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
                  ],
                },
                lib_id: {
                  S: "participant#b2fbc754b9ee1dc5a793eeb2c804c5e6cf962f680909050f28a69b6cdfdbab89",
                },
                room_code: {
                  S: "BBKYIQ",
                },
                session_key: {
                  S: "BBWPHWGYIXISTHQGJSAUYDEHYBLHDB",
                },
              },
              OldImage: {
                game_name: {
                  S: "Me Sir",
                },
                lib_id: {
                  S: "participant#b2fbc754b9ee1dc5a793eeb2c804c5e6cf962f680909050f28a69b6cdfdbab89",
                },
                room_code: {
                  S: "BBKYIQ",
                },
                session_key: {
                  S: "BBWPHWGYIXISTHQGJSAUYDEHYBLHDB",
                },
              },
              SequenceNumber: "106969500000000002006747624",
              SizeBytes: 975,
              StreamViewType: "NEW_AND_OLD_IMAGES",
            },
            eventSourceARN:
              "arn:aws:dynamodb:us-east-1:403958634573:table/DouglasnaphasMadliberation250-ws-roster-webapp-SedersTable7FFD9727-WW3J54QQ8OWQ/stream/2022-03-19T18:19:39.071",
          },
          {
            eventID: "33c3a5161cf3f4f601648c7464b1f4b4",
            eventName: "MODIFY",
            eventVersion: "1.1",
            eventSource: "aws:dynamodb",
            awsRegion: "us-east-1",
            dynamodb: {
              ApproximateCreationDateTime: 1649529342,
              Keys: {
                lib_id: {
                  S: "participant#c3fbc754b9ee1dc5a793eeb2c804c5e6cf962f680909050f28a69b6cdfdbab89",
                },
                room_code: {
                  S: "CCKYIQ",
                },
              },
              NewImage: {
                game_name: {
                  S: "Me3Sir",
                },
                assignments: {
                  L: [
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
                  ],
                },
                lib_id: {
                  S: "participant#c3fbc754b9ee1dc5a793eeb2c804c5e6cf962f680909050f28a69b6cdfdbab89",
                },
                room_code: {
                  S: "CCKYIQ",
                },
                session_key: {
                  S: "CCWPHWGYIXISTHQGJSAUYDEHYBLHDB",
                },
              },
              OldImage: {
                game_name: {
                  S: "Me3Sir",
                },
                lib_id: {
                  S: "participant#c3fbc754b9ee1dc5a793eeb2c804c5e6cf962f680909050f28a69b6cdfdbab89",
                },
                room_code: {
                  S: "CCKYIQ",
                },
                session_key: {
                  S: "CCWPHWGYIXISTHQGJSAUYDEHYBLHDB",
                },
              },
              SequenceNumber: "106969500000000002006747634",
              SizeBytes: 975,
              StreamViewType: "NEW_AND_OLD_IMAGES",
            },
            eventSourceARN:
              "arn:aws:dynamodb:us-east-1:403958634573:table/DouglasnaphasMadliberation250-ws-roster-webapp-SedersTable7FFD9727-WW3J54QQ8OWQ/stream/2022-03-19T18:19:39.071",
          },
        ],
      },
      TABLE_NAME: "one_table2",
      expectedDbQueryParams: [
        {
          TableName: "one_table2",
          KeyConditionExpression: `room_code = :rc and begins_with(lib_id, :prefix)`,
          ExpressionAttributeValues: {
            ":rc": "BBKYIQ",
            ":prefix": "connect#wait#Me Sir#",
          },
        },
        {
          TableName: "one_table2",
          KeyConditionExpression: `room_code = :rc and begins_with(lib_id, :prefix)`,
          ExpressionAttributeValues: {
            ":rc": "CCKYIQ",
            ":prefix": "connect#wait#Me3Sir#",
          },
        },
      ],
      queryData: [
        {
          Items: [
            {
              lib_id: "connect#wait#Me Sir#PbbmLdr_IAMCJyB=",
              room_code: "BBKYIQ",
              date: "2022-03-27T03:56:04.897Z",
              connection_id: "PbbmLdr_IAMCJyB=",
              ms: 1648267964897,
            },
          ],
          Count: 1,
          ScannedCount: 1,
        },
        {
          Items: [
            {
              lib_id: "connect#wait#Me3Sir#PccmLdr_IAMCJyB=",
              room_code: "CCKYIQ",
              date: "2022-03-27T03:56:04.897Z",
              connection_id: "PccmLdr_IAMCJyB=",
              ms: 1648267964897,
            },
            {
              lib_id: "connect#wait#Me3Sir#PcdmLdr_IAMCJyB=",
              room_code: "CCKYIQ",
              date: "2022-03-27T03:57:04.897Z",
              connection_id: "PcdmLdr_IAMCJyB=",
              ms: 1648267965897,
            },
          ],
          Count: 1,
          ScannedCount: 1,
        },
      ],
      expectedPostToConnectionParams: [
        {
          ConnectionId: "PbbmLdr_IAMCJyB=",
          Data: Buffer.from("assignments_ready"),
        },
        {
          ConnectionId: "PccmLdr_IAMCJyB=",
          Data: Buffer.from("assignments_ready"),
        },
        {
          ConnectionId: "PcdmLdr_IAMCJyB=",
          Data: Buffer.from("assignments_ready"),
        },
      ],
      postToConnectionData: {},
      postToConnectionOutcomes: [true],
      expectedStatusCode: 200,
    },
  ])(
    "$description",
    async ({
      description,
      event,
      TABLE_NAME,
      expectedDbQueryParams,
      queryData,
      expectedPostToConnectionParams,
      postToConnectionData,
      postToConnectionOutcomes,
      expectedStatusCode,
    }) => {
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
      const postToConnectionSequence = postToConnectionGenerator(
        postToConnectionOutcomes
      );
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
      process.env.TABLE_NAME = TABLE_NAME;
      const MockApiGatewayManagementApi = jest.fn(({ endpoint }) => {
        return {
          postToConnection: mockPostToConnection,
        };
      });
      jest.mock("aws-sdk/clients/apigatewaymanagementapi", () => {
        return MockApiGatewayManagementApi;
      });
      const handler = require("./assign").handler;
      const result = await handler(event);
      expect(result.statusCode).toEqual(expectedStatusCode);
      expect(MockApiGatewayManagementApi).toHaveBeenCalledWith({
        endpoint: process.env.WS_ENDPOINT,
      });
      if (expectedDbQueryParams) {
        if (Array.isArray(expectedDbQueryParams)) {
          expect(mockQuery).toHaveBeenCalledTimes(expectedDbQueryParams.length);
          expectedDbQueryParams.forEach((ex) => {
            expect(mockQuery).toHaveBeenCalledWith(ex);
          });
        } else {
          expect(mockQuery).toHaveBeenCalledTimes(1);
          expect(mockQuery).toHaveBeenCalledWith(expectedDbQueryParams);
        }
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
