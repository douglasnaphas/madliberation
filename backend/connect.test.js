const DynamoDB = require("aws-sdk/clients/dynamodb");

describe("connect", () => {
  test("happy path", async () => {
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
          console.log('in promise...')
          const data = {
            Item: {
              lib_id:
                "participant#a2fbc754b9ee1dc5a793eeb2c804c5e6cf962f680909050f28a69b6cdfdbab89",
              room_code: "ZSMORM",
              session_key: "VMSSHYCHBHJRUGHOMAIHNKTRECLNAL",
              game_name: "Le",
            },
          };
          return data;
          Promise.resolve({
            Item: {
              lib_id:
                "participant#a2fbc754b9ee1dc5a793eeb2c804c5e6cf962f680909050f28a69b6cdfdbab89",
              room_code: "ZSMORM",
              session_key: "VMSSHYCHBHJRUGHOMAIHNKTRECLNAL",
              game_name: "Le",
            },
          });
        },
      };
    });
    const mockPut = jest.fn(() => {
      return {
        promise() {
          Promise.resolve({});
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
    console.log(result);
  });
});
