const DynamoDB = require("aws-sdk/clients/dynamodb");

afterEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
});
describe("connect", () => {
  test("happy path 0", async () => {
    const event = {
      headers: {
        "Cache-Control": "no-cache",
        Cookie:
          "a2fbc754b9ee1dc5a793eeb2c804c5e6cf962f680909050f28a69b6cdfdbab89=VMSSHYCHBHJRUGHOMAIHNKTRECLNAL",
        Host: "280igs74mf.execute-api.us-east-1.amazonaws.com",
        Origin: "https://d2onsx64yqssek.cloudfront.net",
        Pragma: "no-cache",
        "Sec-WebSocket-Extensions":
          "permessage-deflate; client_max_window_bits",
        "Sec-WebSocket-Key": "o+IA59iIQeFcp2gh4Vf3hQ==",
        "Sec-WebSocket-Version": "13",
        "User-Agent": "Amazon CloudFront",
        Via: "1.1 15cde442051269a0307a638d23683c8c.cloudfront.net (CloudFront)",
        "X-Amz-Cf-Id":
          "n864a57OXe_IQ_uKXpV1GtbZUtEYnPdwPYJkBAyq3g6yCqhYC3PEhg==",
        "X-Amzn-Trace-Id": "Root=1-623be5b9-5aa411431c907e6d43289f60",
        "X-Forwarded-For": "20.124.98.204, 64.252.151.135",
        "X-Forwarded-Port": "443",
        "X-Forwarded-Proto": "https",
      },
      multiValueHeaders: {
        "Cache-Control": ["no-cache"],
        Cookie: [
          "a2fbc754b9ee1dc5a793eeb2c804c5e6cf962f680909050f28a69b6cdfdbab89=VMSSHYCHBHJRUGHOMAIHNKTRECLNAL",
        ],
        Host: ["280igs74mf.execute-api.us-east-1.amazonaws.com"],
        Origin: ["https://d2onsx64yqssek.cloudfront.net"],
        Pragma: ["no-cache"],
        "Sec-WebSocket-Extensions": [
          "permessage-deflate; client_max_window_bits",
        ],
        "Sec-WebSocket-Key": ["o+IA59iIQeFcp2gh4Vf3hQ=="],
        "Sec-WebSocket-Version": ["13"],
        "User-Agent": ["Amazon CloudFront"],
        Via: [
          "1.1 15cde442051269a0307a638d23683c8c.cloudfront.net (CloudFront)",
        ],
        "X-Amz-Cf-Id": [
          "n864a57OXe_IQ_uKXpV1GtbZUtEYnPdwPYJkBAyq3g6yCqhYC3PEhg==",
        ],
        "X-Amzn-Trace-Id": ["Root=1-623be5b9-5aa411431c907e6d43289f60"],
        "X-Forwarded-For": ["20.124.98.204, 64.252.151.135"],
        "X-Forwarded-Port": ["443"],
        "X-Forwarded-Proto": ["https"],
      },
      queryStringParameters: { gamename: "Le", roomcode: "ZSMORM" },
      multiValueQueryStringParameters: {
        gamename: ["Le"],
        roomcode: ["ZSMORM"],
      },
      requestContext: {
        routeKey: "$connect",
        eventType: "CONNECT",
        extendedRequestId: "PeDU-HGxIAMFr5Q=",
        requestTime: "24/Mar/2022:03:30:01 +0000",
        messageDirection: "IN",
        stage: "ws",
        connectedAt: 1648092601239,
        requestTimeEpoch: 1648092601241,
        identity: {
          userAgent: "Amazon CloudFront",
          sourceIp: "64.252.151.135",
        },
        requestId: "PeDU-HGxIAMFr5Q=",
        domainName: "280igs74mf.execute-api.us-east-1.amazonaws.com",
        connectionId: "PeDU-fl2oAMCJfQ=",
        apiId: "280igs74mf",
      },
      isBase64Encoded: false,
    };
    const mockGet = jest.fn(() => {
      return {
        promise() {
          const data = {
            Item: {
              lib_id:
                "participant#a2fbc754b9ee1dc5a793eeb2c804c5e6cf962f680909050f28a69b6cdfdbab89",
              room_code: "ZSMORM",
              session_key: "VMSSHYCHBHJRUGHOMAIHNKTRECLNAL",
              game_name: "Le",
            },
          };
          return Promise.resolve(data);
        },
      };
    });
    const mockPut = jest.fn(() => {
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
            get: mockGet,
            put: mockPut,
          };
        }),
      };
    });
    const handler = require("./connect").handler;
    const result = await handler(event);
    expect(result.statusCode).toEqual(200);
  });
  test.each([
    {
      description: "happy path 1",
      event: {
        headers: {
          Cookie:
            "a2fbc754b9ee1dc5a793eeb2c804c5e6cf962f680909050f28a69b6cdfdbab89=VMSSHYCHBHJRUGHOMAIHNKTRECLNAL",
        },
        multiValueHeaders: {
          Cookie: [
            "a2fbc754b9ee1dc5a793eeb2c804c5e6cf962f680909050f28a69b6cdfdbab89=VMSSHYCHBHJRUGHOMAIHNKTRECLNAL",
          ],
        },
        queryStringParameters: { gamename: "Le", roomcode: "ZSMORM" },
        multiValueQueryStringParameters: {
          gamename: ["Le"],
          roomcode: ["ZSMORM"],
        },
        requestContext: {
          connectionId: "PeDU-fl2oAMCJfQ=",
        },
      },
      Item: {
        lib_id:
          "participant#a2fbc754b9ee1dc5a793eeb2c804c5e6cf962f680909050f28a69b6cdfdbab89",
        room_code: "ZSMORM",
        session_key: "VMSSHYCHBHJRUGHOMAIHNKTRECLNAL",
        game_name: "Le",
      },
      expectedStatus: 200,
    },
    {
      description: "happy path 2",
      event: {
        headers: {
          Cookie: `${(
            "61D034473102D7DAC305902770471FD50F4C5B26F6831A56D" +
            "D90B5184B3C30FC"
          ).toLowerCase()}=SOMESESSIONKEYABCXYZ`,
        },
        multiValueHeaders: {
          Cookie: [
            `${(
              "61D034473102D7DAC305902770471FD50F4C5B26F6831A56D" +
              "D90B5184B3C30FC"
            ).toLowerCase()}=SOMESESSIONKEYABCXYZ`,
          ],
        },
        queryStringParameters: {
          gamename: "some%20string",
          roomcode: "XSMORM",
        },
        multiValueQueryStringParameters: {
          gamename: ["some%20string"],
          roomcode: ["XSMORM"],
        },
        requestContext: {
          connectionId: "PeDU-fl2oAMCJfQ=",
        },
      },
      Item: {
        lib_id: `participant#${(
          "61D034473102D7DAC305902770471FD50F4C5B26F6831A56D" +
          "D90B5184B3C30FC"
        ).toLowerCase()}`,
        room_code: "XSMORM",
        session_key: "SOMESESSIONKEYABCXYZ",
        game_name: "some%20string",
      },
      expectedStatus: 200,
    },
    {
      description: "Item not found",
      event: {
        headers: {
          Cookie: `${(
            "61D034473102D7DAC305902770471FD50F4C5B26F6831A56D" +
            "D90B5184B3C30FC"
          ).toLowerCase()}=SOMESESSIONKEYABCXYZ`,
        },
        multiValueHeaders: {
          Cookie: [
            `${(
              "61D034473102D7DAC305902770471FD50F4C5B26F6831A56D" +
              "D90B5184B3C30FC"
            ).toLowerCase()}=SOMESESSIONKEYABCXYZ`,
          ],
        },
        queryStringParameters: {
          gamename: "some%20string",
          roomcode: "XSMORM",
        },
        multiValueQueryStringParameters: {
          gamename: ["some%20string"],
          roomcode: ["XSMORM"],
        },
        requestContext: {
          connectionId: "PeDU-fl2oAMCJfQ=",
        },
      },
      Item: {},
      expectedStatus: 400,
    },
    {
      description: "Session key mismatch",
      event: {
        headers: {
          Cookie: `${(
            "61D034473102D7DAC305902770471FD50F4C5B26F6831A56D" +
            "D90B5184B3C30FC"
          ).toLowerCase()}=WRONGSESSIONKEYABCXYZ`,
        },
        multiValueHeaders: {
          Cookie: [
            `${(
              "61D034473102D7DAC305902770471FD50F4C5B26F6831A56D" +
              "D90B5184B3C30FC"
            ).toLowerCase()}=WRONGSESSIONKEYABCXYZ`,
          ],
        },
        queryStringParameters: {
          gamename: "some%20string",
          roomcode: "XSMORM",
        },
        multiValueQueryStringParameters: {
          gamename: ["some%20string"],
          roomcode: ["XSMORM"],
        },
        requestContext: {
          connectionId: "PeDU-fl2oAMCJfQ=",
        },
      },
      Item: {
        lib_id: `participant#${(
          "61D034473102D7DAC305902770471FD50F4C5B26F6831A56D" +
          "D90B5184B3C30FC"
        ).toLowerCase()}`,
        room_code: "XSMORM",
        session_key: "SOMESESSIONKEYABCXYZ",
        game_name: "some%20string",
      },
      expectedStatus: 400,
    },
  ])("$description", async ({ event, Item, expectedStatus }) => {
    const mockGet = jest.fn(() => {
      return {
        promise() {
          const data = {
            Item,
          };
          return Promise.resolve(data);
        },
      };
    });
    const mockPut = jest.fn(() => {
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
            get: mockGet,
            put: mockPut,
          };
        }),
      };
    });
    const handler = require("./connect").handler;
    const result = await handler(event);
    expect(result.statusCode).toEqual(expectedStatus);
  });
});
