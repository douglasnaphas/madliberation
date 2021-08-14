/* globals expect, jest */
describe("setDbParamsGetEmailFromSub", () => {
  const setDbParamsGetEmailFromSub = require("./setDbParamsGetEmailFromSub");
  const schema = require("../schema");
  test("should return middleware", () => {
    const middleware = setDbParamsGetEmailFromSub({paramsName: "user"});
    expect(typeof middleware).toEqual("function");
  });
  test("should fail without an arg paramsName", () => {
    expect(
      () => {setDbParamsGetEmailFromSub();}
    ).toThrow();
  });
  test("returned middleware should call next and do nothing else if local " +
    "is provided but res.locals[local] is not set", () => {
    const middleware = setDbParamsGetEmailFromSub({
      paramsName: "anything",
      local: "thisNeedsToBePresentForLogicToHappen"
    });
    const req = {};
    const res = {
      locals: {
        noteHowTheValueOfLocalAbove: "is not a key in res.locals"
      }
    };
    const next = jest.fn();
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.locals["anything"]).toBeUndefined();
  });
  test("returned middleware should set params for DynamoDB query to get " +
    "email addresses where the sub is in the partition key 1", () => {
    const local = "user";
    const paramsName = "userSubEmailQueryParams"
    const middleware = setDbParamsGetEmailFromSub({local, paramsName});
    const req = {};
    const res = {
      locals: {
        user: "somesub-xyz-111-fff"
      }
    };
    const next = jest.fn();
    const expectedDbParams = {
      ExpressionAttributeNames: {
        '#R': schema.PARTITION_KEY
      },
      ExpressionAttributeValues: {
        ':r': `${schema.PKEY_PREFIX_SUB}${schema.SEPARATOR}${res.locals.user}`
      },
      KeyConditionExpression: '#R = :r',
      ProjectionExpression: schema.USER_EMAIL,
      TableName: schema.TABLE_NAME
    };
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.locals[paramsName]).toEqual(expectedDbParams);
  });
  test("returned middleware should set params for DynamoDB query to get " +
    "email addresses where the sub is in the partition key 2", () => {
    const local = "jwt_sub";
    const paramsName = "jwtSubEmailQueryParams"
    const middleware = setDbParamsGetEmailFromSub({local, paramsName});
    const req = {};
    const res = {
      locals: {
        jwt_sub: "thesubfromtheJWT-222-ggg"
      }
    };
    const next = jest.fn();
    const expectedDbParams = {
      ExpressionAttributeNames: {
        '#R': schema.PARTITION_KEY
      },
      ExpressionAttributeValues: {
        ':r': `${schema.PKEY_PREFIX_SUB}${schema.SEPARATOR}${res.locals[local]}`
      },
      KeyConditionExpression: '#R = :r',
      ProjectionExpression: schema.USER_EMAIL,
      TableName: schema.TABLE_NAME
    };
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.locals[paramsName]).toEqual(expectedDbParams);
  });
});