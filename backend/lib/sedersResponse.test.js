/* globals expect, jest */
describe("sedersResponse", () => {
  const sedersResponse = require("./sedersResponse");
  test("should return middleware", () => {
    expect(typeof sedersResponse()).toEqual("function");
  });
  test("should respond with any contents of dbDataSeders 1", () => {
    const req = {};
    const send = jest.fn();
    const res = {
      send,
      locals: {
        dbDataSeders: {
          Items: [
            {
              sederProp1: "sederValue1",
              sederProp2: {
                sederProp2_1: "val 2 1",
                sederProp2_2: "val 2 2"
              }
            }
          ],
          SomethingElse: "about the seders"
        }
      }
    }
    const next = jest.fn();
    const middleware = sedersResponse();
    middleware(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(send).toHaveBeenCalled();
    expect(send).toHaveBeenCalledWith(res.locals.dbDataSeders);
  });
  test("should strip out session_key of all elements of dbDataSeders.Items",
    () => {
    const req = {};
    const send = jest.fn();
    const res = {
      send,
      locals: {
        dbDataSeders: {
          Items: [
            {
              sederPropA: "sederValue a",
              sederPropB: {
                sederPropB_1: "val b 1",
                sederPropB_2: "val b 2"
              }
            },
            {
              secondThingName: "my name",
              secondThingOther: [
                {anArray: 'of others'},
                {andSuch: 'and such'}
              ],
              session_key: "thisneedstoberemoved"
            }
          ],
          SomethingElse: "like items scanned, client doesn't really need this",
          ButIsGettingIt: "anyway"
        }
      }
    }
    const expectedData = {
      Items: [
        {
          sederPropA: "sederValue a",
          sederPropB: {
            sederPropB_1: "val b 1",
            sederPropB_2: "val b 2"
          }
        },
        {
          secondThingName: "my name",
          secondThingOther: [
            {anArray: 'of others'},
            {andSuch: 'and such'}
          ]
        }
      ],
      SomethingElse: "like items scanned, client doesn't really need this",
      ButIsGettingIt: "anyway"
    }
    const next = jest.fn();
    const middleware = sedersResponse();
    middleware(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(send).toHaveBeenCalled();
    expect(send).toHaveBeenCalledWith(expectedData);
  });
  test("should throw with dbErrorSeders if !dbDataSeders && dbErrorSeders 1",
    () => {
    const req = {};
    const send = jest.fn();
    const res = {
      send,
      locals: {
        dbErrorSeders: {
          message: "error in query 1"
        }
      }
    }
    const next = jest.fn();
    const middleware = sedersResponse();
    expect(
      () => {middleware(req, res, next);}
    ).toThrow();
    expect(next).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });
});