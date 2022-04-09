const DynamoDB = require("aws-sdk/clients/dynamodb");
const schema = require("./schema");

const originalEnv = process.env;
afterEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
  process.env = originalEnv;
});

afterAll(() => {
  jest.useRealTimers();
});

describe("disconnect", () => {
  const fakeTime1 = new Date(2022, 3 /* April, 0 is January */, 15, 19);
  const fakeTime2 = new Date(2019, 2, 31, 19);
  test.each([
    // happy path 1
    {
      description: "happy path 1",
      fakeTime: fakeTime1,
      tableName: "some_table",
      event: {
        headers: {
          Host: "280igs74mf.execute-api.us-east-1.amazonaws.com",
          "x-api-key": "",
          "X-Forwarded-For": "",
          "x-restapi": "",
        },
        multiValueHeaders: {
          Host: ["280igs74mf.execute-api.us-east-1.amazonaws.com"],
          "x-api-key": [""],
          "X-Forwarded-For": [""],
          "x-restapi": [""],
        },
        requestContext: {
          routeKey: "$disconnect",
          disconnectStatusCode: 1005,
          eventType: "DISCONNECT",
          extendedRequestId: "QQGAoEcsoAMF09A=",
          requestTime: "08/Apr/2022:07:53:39 +0000",
          messageDirection: "IN",
          disconnectReason: "Client-side close frame status not set",
          stage: "ws",
          connectedAt: 1649404324086,
          requestTimeEpoch: 1649404419881,
          identity: {
            userAgent: "Amazon CloudFront",
            sourceIp: "130.176.133.78",
          },
          requestId: "QQGAoEcsoAMF09A=",
          domainName: "280igs74mf.execute-api.us-east-1.amazonaws.com",
          connectionId: "QQFxqeZfIAMCKRA=",
          apiId: "280igs74mf",
        },
        isBase64Encoded: false,
      },
      expectedPutParams: {
        TableName: "some_table",
        Item: {
          [schema.PARTITION_KEY]: `QQFxqeZfIAMCKRA=`,
          [schema.SORT_KEY]: `${schema.DISCONNECT}` + `${schema.SEPARATOR}`,
          [schema.CONNECTION_ID]: "QQFxqeZfIAMCKRA=",
          [schema.DATE]: fakeTime1.toISOString(),
          [schema.MS]: fakeTime1.getTime(),
        },
      },
      putSucceeds: true,
      expectedStatus: 200,
    },
    // happy path 2
    {
      description: "happy path 2",
      fakeTime: fakeTime2,
      tableName: "some_other_table",
      event: {
        headers: {
          Host: "280igs74mf.execute-api.us-east-1.amazonaws.com",
          "x-api-key": "",
          "X-Forwarded-For": "",
          "x-restapi": "",
        },
        multiValueHeaders: {
          Host: ["280igs74mf.execute-api.us-east-1.amazonaws.com"],
          "x-api-key": [""],
          "X-Forwarded-For": [""],
          "x-restapi": [""],
        },
        requestContext: {
          routeKey: "$disconnect",
          disconnectStatusCode: 1005,
          eventType: "DISCONNECT",
          extendedRequestId: "QQGAoEcsoAMF09A=",
          requestTime: "08/Apr/2022:07:53:39 +0000",
          messageDirection: "IN",
          disconnectReason: "Client-side close frame status not set",
          stage: "ws",
          connectedAt: 1649404324286,
          requestTimeEpoch: 1649404419881,
          identity: {
            userAgent: "Amazon CloudFront",
            sourceIp: "130.176.133.78",
          },
          requestId: "QQGAoEcsoAMF09A=",
          domainName: "280igs74mf.execute-api.us-east-1.amazonaws.com",
          connectionId: "RRRrqeZfIAMCKRA=",
          apiId: "280igs74mf",
        },
        isBase64Encoded: false,
      },
      expectedPutParams: {
        TableName: "some_other_table",
        Item: {
          [schema.PARTITION_KEY]: `RRRrqeZfIAMCKRA=`,
          [schema.SORT_KEY]: `${schema.DISCONNECT}` + `${schema.SEPARATOR}`,
          [schema.CONNECTION_ID]: "RRRrqeZfIAMCKRA=",
          [schema.DATE]: fakeTime2.toISOString(),
          [schema.MS]: fakeTime2.getTime(),
        },
      },
      putSucceeds: true,
      expectedStatus: 200,
    },
    // failed put
    {
      description: "failed put",
      fakeTime: fakeTime1,
      tableName: "some_table",
      event: {
        headers: {
          Host: "280igs74mf.execute-api.us-east-1.amazonaws.com",
          "x-api-key": "",
          "X-Forwarded-For": "",
          "x-restapi": "",
        },
        multiValueHeaders: {
          Host: ["280igs74mf.execute-api.us-east-1.amazonaws.com"],
          "x-api-key": [""],
          "X-Forwarded-For": [""],
          "x-restapi": [""],
        },
        requestContext: {
          routeKey: "$disconnect",
          disconnectStatusCode: 1005,
          eventType: "DISCONNECT",
          extendedRequestId: "QQGAoEcsoAMF09A=",
          requestTime: "08/Apr/2022:07:53:39 +0000",
          messageDirection: "IN",
          disconnectReason: "Client-side close frame status not set",
          stage: "ws",
          connectedAt: 1649404324086,
          requestTimeEpoch: 1649404419881,
          identity: {
            userAgent: "Amazon CloudFront",
            sourceIp: "130.176.133.78",
          },
          requestId: "QQGAoEcsoAMF09A=",
          domainName: "280igs74mf.execute-api.us-east-1.amazonaws.com",
          connectionId: "QQFxqeZfIAMCKRA=",
          apiId: "280igs74mf",
        },
        isBase64Encoded: false,
      },
      expectedPutParams: {
        TableName: "some_table",
        Item: {
          [schema.PARTITION_KEY]: `QQFxqeZfIAMCKRA=`,
          [schema.SORT_KEY]: `${schema.DISCONNECT}` + `${schema.SEPARATOR}`,
          [schema.CONNECTION_ID]: "QQFxqeZfIAMCKRA=",
          [schema.DATE]: fakeTime1.toISOString(),
          [schema.MS]: fakeTime1.getTime(),
        },
      },
      putSucceeds: false,
      expectedStatus: 501,
    },
  ])(
    "$description",
    async ({
      description,
      fakeTime,
      tableName,
      event,
      expectedPutParams,
      putSucceeds,
      expectedStatus,
    }) => {
      const mockPut = putSucceeds
        ? jest.fn(() => {
            return {
              promise() {
                return Promise.resolve({});
              },
            };
          })
        : jest.fn(() => {
            return {
              promise() {
                return Promise.reject("failure");
              },
            };
          });
      jest.mock("aws-sdk/clients/dynamodb", () => {
        return {
          DocumentClient: jest.fn(() => {
            return {
              put: mockPut,
            };
          }),
        };
      });
      process.env.TABLE_NAME = tableName;
      jest.useFakeTimers("modern");
      jest.setSystemTime(fakeTime);
      const handler = require("./disconnect").handler;
      const result = await handler(event);
      expect(result.statusCode).toEqual(expectedStatus);
      if (expectedPutParams) {
        expect(mockPut).toHaveBeenCalledTimes(1);
        expect(mockPut).toHaveBeenCalledWith(expectedPutParams);
      }
    }
  );
});
