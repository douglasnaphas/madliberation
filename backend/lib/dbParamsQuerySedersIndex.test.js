/* globals expect, jest */
describe("dbParamsQuerySedersIndex", () => {
  const dbParamsQuerySedersIndex = require("./dbParamsQuerySedersIndex");
  const schema = require("../schema");
  test("should return middleware", () => {
    expect(typeof dbParamsQuerySedersIndex("myParamsName")).toEqual("function");
  });
  test("should fail without a positional arg paramsName", () => {
    expect(() => {dbParamsQuerySedersIndex();}).toThrow();
  });
  test("middleware should set params to query email -> seders 1", () => {
    const paramsName = "querySedersParams";
    const middleware = dbParamsQuerySedersIndex(paramsName);
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
      IndexName: 'user_email-path-TO-all-index'
    });
  });
  test("middleware should set params to query email -> seders 2", () => {
    const paramsName = "queryMORESedersParams";
    const middleware = dbParamsQuerySedersIndex(paramsName);
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
      IndexName: 'user_email-path-TO-all-index'
    });
  });
});