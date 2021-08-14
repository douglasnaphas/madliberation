/* globals expect, jest */
const joinSeder = require("./joinSeder");
let schema;

describe("joinSeder", () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env.TABLE_NAME = "seders";
    schema = require("../schema"); // uses the env var TABLE_NAME
  });
  afterEach(() => {
    process.env = { ...OLD_ENV };
  });
  const now = new Date();
  const Configs = require("../Configs");

  // codes
  const goodCode = "GOODCO";
  const badCode = "BADCOD";

  // names
  const freeNameEmptySeder = "First to Seder";
  const freeNameCrowdedSeder = "Late but Welcome";
  const takenNameOnePersonSeder = "Taken at 1-Person Seder";
  const takenNameCrowdedSeder = "Taken by Someone";

  // names already at seders
  const namesAtOnePersonSeder = [takenNameOnePersonSeder];
  const namesAtCrowdedSeder = [
    takenNameCrowdedSeder,
    "A Girlfriend",
    "A Friend",
    "A Roommate",
    "Cousin 1",
    "Aunt Three",
  ];

  // reqs
  // invalid
  const reqWithNoBody = { nobody: "this has no body" };
  const reqWithBodyNoCodeNoName = {
    body: {
      noCode: "no room code",
      noName: "no game name",
    },
  };
  const reqWithRoomCodeNoGameName = {
    body: {
      roomCode: goodCode,
    },
  };
  const reqWithGameNameNoRoomCode = {
    body: {
      gameName: freeNameEmptySeder,
    },
  };
  // good code
  const reqGoodCodeFreeNameEmptySeder = {
    body: {
      roomCode: goodCode,
      gameName: freeNameEmptySeder,
    },
  }; // 200
  const reqGoodCodeFreeNameCrowdedSeder = {
    body: {
      roomCode: goodCode,
      gameName: freeNameCrowdedSeder,
    },
  }; // 200
  const reqGoodCodeTakenNameOnePersonSeder = {
    body: {
      roomCode: goodCode,
      gameName: takenNameOnePersonSeder,
    },
  }; // 400
  const reqGoodCodeTakenNameCrowdedSeder = {
    body: {
      roomCode: goodCode,
      gameName: takenNameCrowdedSeder,
    },
  }; // 400
  // bad code
  const reqBadCodeFreeNameEmptySeder = {
    body: {
      roomCode: badCode,
      gameName: freeNameEmptySeder,
    },
  }; // 400
  const reqBadCodeFreeNameCrowdedSeder = {
    body: {
      roomCode: badCode,
      gameName: freeNameCrowdedSeder,
    },
  }; // 400
  const reqBadCodeTakenNameOnePersonSeder = {
    body: {
      roomCode: badCode,
      gameName: takenNameOnePersonSeder,
    },
  }; // 400
  const reqBadCodeTakenNameCrowdedSeder = {
    body: {
      roomCode: badCode,
      gameName: takenNameCrowdedSeder,
    },
  }; // 400

  // cookies
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  };
  const cookieValueFreeNameEmptySeder = "COOKIEVALUEFREENAMEEMPTYSEDER";
  const cookieFreeNameEmptySeder = {
    name: freeNameEmptySeder,
    value: cookieValueFreeNameEmptySeder,
    options: cookieOptions,
  };
  const randomStringGeneratorFreeNameEmptySeder = function* (options) {
    yield cookieValueFreeNameEmptySeder;
  };
  const cookieValueFreeNameCrowdedSeder = "COOKIEVALUEFREENAMECROWDEDSEDER";
  const cookieFreeNameCrowdedSeder = {
    name: freeNameCrowdedSeder,
    value: cookieValueFreeNameCrowdedSeder,
    options: cookieOptions,
  };
  const randomStringGeneratorFreeNameCrowdedSeder = function* (options) {
    yield cookieValueFreeNameCrowdedSeder;
  };
  const emptyStringGenerator = function* (options) {
    yield "";
  };

  // db responses
  // good code
  const dbResponseFreeNameEmptySeder = {};
  const dbResponseFreeNameCrowdedSeder = {
    Attributes: {
      participants: {
        type: "String",
        values: namesAtCrowdedSeder,
        wrapperName: "Set",
      },
    },
  };
  const dbResponseTakenNameOnePersonSeder = {
    Attributes: {
      participants: {
        type: "String",
        values: namesAtOnePersonSeder,
        wrapperName: "Set",
      },
    },
  };
  const dbResponseTakenNameCrowdedSeder = dbResponseFreeNameCrowdedSeder;
  // bad code: error (built in to update() logic)

  // db
  const createSet = (gameName) => [gameName];
  const conditionExpression =
    "attribute_exists(room_code) AND attribute_exists(created) AND created >" +
    " :mc";
  const db = {
    createSet: createSet,
    update: (params, cb) => {
      if (
        !params ||
        !params.ExpressionAttributeNames ||
        !params.ExpressionAttributeNames["#P"] ||
        params.ExpressionAttributeNames["#P"] != "participants" ||
        !params.ExpressionAttributeValues ||
        !params.ExpressionAttributeValues[":p"] ||
        !params.ExpressionAttributeValues[":mc"] ||
        params.ExpressionAttributeValues[":mc"] !=
          now.getTime() - Configs.msToJoinSeder() ||
        !params.Key ||
        !params.Key.room_code ||
        params.Key.room_code != goodCode ||
        !params.Key.lib_id ||
        params.Key.lib_id != "000" ||
        !params.ReturnValues ||
        params.ReturnValues != "UPDATED_OLD" ||
        !params.TableName ||
        params.TableName != schema.TABLE_NAME ||
        !params.UpdateExpression ||
        params.UpdateExpression != "ADD #P :p" ||
        !params.ConditionExpression ||
        params.ConditionExpression != conditionExpression
      ) {
        cb({ err: "there was an error" }, false);
      } else if (Array.isArray(params.ExpressionAttributeValues[":p"])) {
        if (params.ExpressionAttributeValues[":p"][0] == freeNameEmptySeder) {
          cb(false, dbResponseFreeNameEmptySeder);
        } else if (
          params.ExpressionAttributeValues[":p"][0] == freeNameCrowdedSeder
        ) {
          cb(false, dbResponseFreeNameCrowdedSeder);
        } else if (
          params.ExpressionAttributeValues[":p"][0] == takenNameOnePersonSeder
        ) {
          cb(false, dbResponseTakenNameOnePersonSeder);
        } else if (
          params.ExpressionAttributeValues[":p"][0] == takenNameCrowdedSeder
        ) {
          cb(false, dbResponseTakenNameCrowdedSeder);
        }
      } else {
        cb({ err: "unkown error" }, false);
        // TODO: Fix this logic to avoid repeating the error case, and in the
        // meantime avoid having to list every failure condition, since I
        // will just be succeeding on success conditions and failing
        // otherwise
      }
    },
  };
  const awsSdk = {
    DynamoDB: {
      DocumentClient: class {
        constructor() {
          return db;
        }
      },
    },
  };

  // endpoint responses
  const apiResponseNameTaken = { error: "name taken" };

  const runTest = async ({
    req,
    expectedStatus,
    expectedResponseData,
    expectedCookie,
    randomStringGenerator,
    expectNext,
  }) => {
    const handler = joinSeder(awsSdk, now, Configs, randomStringGenerator);
    const cookies = [];
    let nextCalled = false;
    const result = await new Promise((resolve, reject) => {
      const res = {
        get: () => "get called",
        cookie: (name, value, options) => {
          cookies.push({ name: name, value: value, options: options });
        },
        status: (s) => {
          if (s == expectedStatus) {
            return {
              send: (data) => {
                resolve({ sentStatus: s, sentData: data });
              },
            };
          } else {
            resolve({ sentStatus: s });
          }
        },
        send: (data) => {
          resolve({ sentStatus: 200, sentData: data });
        },
      };
      const next = () => {
        nextCalled = true;
        resolve();
      };
      handler(req, res, next);
    });

    if (expectedCookie) {
      // TODO: hash the Game Name for the cookie name
      const matchingCookie = cookies.find(
        (c) => c.name == expectedCookie.name && c.value == expectedCookie.value
      );
      expect(matchingCookie).toBeTruthy();
      expect(matchingCookie.options).toEqual(expectedCookie.options);
    }
    if (expectNext) {
      expect(nextCalled).toBeTruthy();
    } else {
      expect(result.sentStatus).toEqual(expectedStatus);
      expect(result.sentData).toEqual(expectedResponseData);
    }
  };
  test("req with no body", () => {
    return runTest({ req: reqWithNoBody, expectedStatus: 400 });
  });
  test("req with body, no room code, no game name", () => {
    return runTest({ req: reqWithBodyNoCodeNoName, expectedStatus: 400 });
  });
  test("req with room code, but no game name", () => {
    return runTest({ req: reqWithRoomCodeNoGameName, expectedStatus: 400 });
  });
  test("req with game name, no room code", () => {
    return runTest({ req: reqWithGameNameNoRoomCode, expectedStatus: 400 });
  });
  test("good code, 1st person to empty seder", () => {
    // 1
    return runTest({
      req: reqGoodCodeFreeNameEmptySeder,
      expectNext: true,
      expectedCookie: cookieFreeNameEmptySeder,
      randomStringGenerator: randomStringGeneratorFreeNameEmptySeder,
    });
  });
  test("good code, free name, crowded seder", () => {
    // 2
    return runTest({
      req: reqGoodCodeFreeNameCrowdedSeder,
      expectNext: true,
      expectedCookie: cookieFreeNameCrowdedSeder,
      randomStringGenerator: randomStringGeneratorFreeNameCrowdedSeder,
    });
  });
  test("good code, taken name, 1 other person at seder", () => {
    // 3
    return runTest({
      req: reqGoodCodeTakenNameOnePersonSeder,
      expectedStatus: 400,
      expectedResponseData: apiResponseNameTaken,
      randomStringGenerator: emptyStringGenerator,
    });
  });
  test("good code, taken name, crowded seder", () => {
    // 4
    return runTest({
      req: reqGoodCodeTakenNameCrowdedSeder,
      expectedStatus: 400,
      expectedResponseData: apiResponseNameTaken,
      randomStringGenerator: emptyStringGenerator,
    });
  });
  test("bad room code, free name, empty seder", () => {
    // 5
    return runTest({ req: reqBadCodeFreeNameEmptySeder, expectedStatus: 400 });
  });
  test("bad code, free name, crowded seder", () => {
    // 6
    return runTest({
      req: reqBadCodeFreeNameCrowdedSeder,
      expectedStatus: 400,
    });
  });
  test("bad code, taken name, 1 person at seder", () => {
    // 7
    return runTest({
      req: reqBadCodeTakenNameOnePersonSeder,
      expectedStatus: 400,
    });
  });
  test("bad code, taken name, crowded seder", () => {
    // 8
    return runTest({
      req: reqBadCodeTakenNameCrowdedSeder,
      expectedStatus: 400,
    });
  });
  test("cookie should go in the DB (update runTest)", () => {});
  test("cookie should match what is in the DB", () => {});
  test("scale test, what if there are 100,000 people at a seder?", () => {
    /* TODO: set a participant limit, see if dynamo limits what it will return
     */
  });
  const rt = async () => {
    expect(true).toBeFalsy();
  };
  test.skip("rt, illustrates expect-from-function pattern", () => {
    return rt();
  });
});
