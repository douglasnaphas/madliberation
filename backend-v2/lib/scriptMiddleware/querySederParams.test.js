/* globals expect */
describe("scriptMiddleware/querySederParams", () => {
  const querySederParams = require("./querySederParams");
  const responses = require("../../responses");
  const schema = require("../../schema");
  const runTest = ({ req, expect500, expectNext, expectedDbParams }) => {
    let nextCalled = false;
    let sentData;
    let statusToSend = 200;
    let sentStatus;
    const res = {
      locals: {},
      status: (s) => {
        statusToSend = s;
        return {
          send: (d) => {
            sentData = d;
            sentStatus = statusToSend;
          },
        };
      },
      send: (d) => {
        sentData = d;
        sentStatus = statusToSend;
      },
    };
    const next = () => {
      nextCalled = true;
    };
    const middleware = querySederParams();
    middleware(req, res, next);
    if (expect500) {
      expect(sentStatus).toEqual(500);
      expect(sentData).toEqual(responses.SERVER_ERROR);
    }
    if (expectNext) {
      expect(nextCalled).toBeTruthy();
    }
    if (expectedDbParams) {
      expect(res.locals.querySederParams).toEqual(expectedDbParams);
    }
  };
  test("should 500 on missing Room Code", () => {
    const req = {
      query: {
        gamename: "but no room code",
      },
    };
    runTest({ req: req, expect500: true });
  });
  test("happy path 1", () => {
    const req = {
      query: {
        roomcode: "PROVID",
      },
    };
    const expectedDbParams = {
      ExpressionAttributeNames: {
        "#R": schema.PARTITION_KEY,
        "#P": schema.PATH,
      },
      ExpressionAttributeValues: {
        ":r": req.query.roomcode,
      },
      KeyConditionExpression: "#R = :r",
      ProjectionExpression:
        `#P, ${schema.SCRIPT_VERSION}, ${schema.ANSWERS}` +
        `, ${schema.ASSIGNMENTS}` +
        `, ${schema.ANSWERS_MAP}`,
      TableName: schema.TABLE_NAME,
    };
    runTest({ req: req, expectNext: true, expectedDbParams: expectedDbParams });
  });
  test("happy path 2", () => {
    const req = {
      query: {
        roomcode: "ALSOPR",
      },
    };
    const expectedDbParams = {
      ExpressionAttributeNames: {
        "#R": schema.PARTITION_KEY,
        "#P": schema.PATH,
      },
      ExpressionAttributeValues: {
        ":r": req.query.roomcode,
      },
      KeyConditionExpression: "#R = :r",
      ProjectionExpression:
        `#P, ${schema.SCRIPT_VERSION}, ${schema.ANSWERS}` +
        `, ${schema.ASSIGNMENTS}` +
        `, ${schema.ANSWERS_MAP}`,
      TableName: schema.TABLE_NAME,
    };
    runTest({ req: req, expectNext: true, expectedDbParams: expectedDbParams });
  });
});
