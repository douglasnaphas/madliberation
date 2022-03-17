/* globals expect, jest */
const dbParamsSaveUserTokenInfo = require("./dbParamsSaveUserTokenInfo");
const Configs = require("../Configs");
const schema = require("../schema");
const responses = require("../responses");

describe("dbParamsSaveUserTokenInfo", () => {
  const runTest = ({
    locals,
    expectedDbParams,
    expectNext,
    expect500,
    expectedStatus,
    expectedData,
  }) => {
    const middleware = dbParamsSaveUserTokenInfo();
    const req = {};
    const next = jest.fn();
    const res = { locals };
    const send = jest.fn();
    res.status = jest.fn(() => {
      return { send };
    });
    middleware(req, res, next);
    if (expectedDbParams) {
      expect(res.locals.dbParamsSaveUserTokenInfo).toEqual(expectedDbParams);
    }
    if (expectNext) {
      expect(next).toHaveBeenCalled();
    }
    if (expect500) {
      expect(res.status).toHaveBeenCalledWith(500);
      expect(send).toHaveBeenCalledWith(responses.SERVER_ERROR);
    }
    if (expectedStatus) {
      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    }
    if (expectedData) {
      expect(send).toHaveBeenCalledWith(expectedData);
    }
  };
  test("happy path 1", () => {
    const locals = {
      nickname: "Mr Me",
      email: "saohan@shile.sh",
      sub: "4829382911838-fjda-23f",
      "cognito:username": "Google_3829328",
      opaqueCookie: "QWERTYQWERTYQWERTYQWERTYQWERTY",
    };
    const expectedDbParams = {
      TableName: schema.TABLE_NAME,
      Item: {
        [schema.PARTITION_KEY]:
          schema.PKEY_PREFIX_SUB + schema.SEPARATOR + locals.sub,
        [schema.SORT_KEY]:
          schema.USERINFO_PREFIX +
          schema.SEPARATOR +
          locals["cognito:username"],
        [schema.USER_NICKNAME]: locals.nickname,
        [schema.USER_EMAIL]: locals.email,
        [schema.OPAQUE_COOKIE]: locals.opaqueCookie,
      },
    };
    runTest({
      locals,
      expectedDbParams,
      expectNext: true,
    });
  });
  test("happy path 2", () => {
    const locals = {
      nickname: "dubronum",
      email: "soodoo@spa.sha",
      sub: "a3fda3jffd2911838-k4jda1-11g",
      "cognito:username": "Facebook_88593282343ikf",
      opaqueCookie: "NUMINALQWERTYQWERTYQWERTYNUMINALF",
    };
    const expectedDbParams = {
      TableName: schema.TABLE_NAME,
      Item: {
        [schema.PARTITION_KEY]:
          schema.PKEY_PREFIX_SUB + schema.SEPARATOR + locals.sub,
        [schema.SORT_KEY]:
          schema.USERINFO_PREFIX +
          schema.SEPARATOR +
          locals["cognito:username"],
        [schema.USER_NICKNAME]: locals.nickname,
        [schema.USER_EMAIL]: locals.email,
        [schema.OPAQUE_COOKIE]: locals.opaqueCookie,
      },
    };
    runTest({
      locals,
      expectedDbParams,
      expectNext: true,
    });
  });
  const testDataMissingInfo = [
    {
      nickname: "nick nom",
      email: "subulu@row.com",
      sub: "423j-erjke-FE2",
      cUn: "Amazon_333",
      opaqueCookie: undefined,
    },
    {
      nickname: "nick nom",
      email: "subulu@row.com",
      sub: "423j-erjke-FE2",
      cUn: undefined,
      opaqueCookie: "RJEIOAFDJAKFIEOADK",
    },
    {
      nickname: "rick nom",
      email: "tubulu@3ow.co",
      sub: undefined,
      cUn: "Google_124",
      opaqueCookie: "ABWWDDDJAKFIEOADK",
    },
    {
      nickname: "the space",
      email: undefined,
      sub: "kirj-erjke-d14",
      cUn: "Facebook_7rwe8",
      opaqueCookie: "UQMFOEDJAKFIEOADK",
    },
    {
      nickname: undefined,
      email: "FRbulu@row.com",
      sub: "111-erjke-FE2",
      cUn: "Google_124",
      opaqueCookie: "EIDGHQOAFDJAKFIEOADK",
    },
  ];
  test.each(testDataMissingInfo)(
    "missing locals property, nickname $nickname, email $email, sub $sub, " +
      "cognito:username $cUn, expect 500",
    ({ nickname, email, sub, cUn }) => {
      runTest({
        locals: { nickname, email, sub, "cognito:username": cUn },
        expect500: true,
      });
    }
  );
});
