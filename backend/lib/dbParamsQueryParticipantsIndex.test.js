/* globals expect, jest */
describe("dbParamsQueryParticipantsIndex", () => {
  const dbParamsQueryParticipantsIndex =
    require("./dbParamsQueryParticipantsIndex");
  const schema = require("../schema");
  test("should return middleware", () => {
    expect(typeof dbParamsQueryParticipantsIndex("myParamsName")).toEqual("function");
  });
  test("should fail without a positional arg paramsName", () => {
    expect(() => {dbParamsQueryParticipantsIndex();}).toThrow();
  });
  test("middleware should set params to query email -> seders 1", () => {
    const paramsName = "querySedersParams";
    const middleware = dbParamsQueryParticipantsIndex(paramsName);
    const req = {};
    const res = {locals:{userEmail: "present@person.com"}};
    const next = jest.fn();
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.locals[paramsName]).toEqual({
      ExpressionAttributeNames: {"#E": schema.USER_EMAIL},
      ExpressionAttributeValues: {
        ":e": res.locals.userEmail
      },
      KeyConditionExpression: '#E = :e',
      TableName: schema.TABLE_NAME,
      IndexName: schema.EMAIL_GAME_NAME_INDEX
    });
  });
  test("middleware should set params to query email -> seders 2", () => {
    const paramsName = "queryMORESedersParams";
    const middleware = dbParamsQueryParticipantsIndex(paramsName);
    const req = {};
    const res = {locals:{userEmail: "MORE@othercases.org"}};
    const next = jest.fn();
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.locals[paramsName]).toEqual({
      ExpressionAttributeNames: {"#E": schema.USER_EMAIL},
      ExpressionAttributeValues: {
        ":e": res.locals.userEmail
      },
      KeyConditionExpression: '#E = :e',
      TableName: schema.TABLE_NAME,
      IndexName: schema.EMAIL_GAME_NAME_INDEX
    });
  });
});