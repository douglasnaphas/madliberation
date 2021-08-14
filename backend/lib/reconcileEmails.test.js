/* globals expect, jest */
describe("reconcileEmails", () => {
  const reconcileEmails = require("./reconcileEmails");
  test("should return middleware", () => {
    expect(typeof reconcileEmails()).toEqual("function");
  });
  describe("condition present and res.locals[condition] undefined (no logic)",
    () => {
    test("should be no logic", () => {
      const condition = "user_sub";
      const local1 = "something";
      const local2 = "somethingElse";
      const output = "outVar";
      const middleware = reconcileEmails(condition, local1, local2, output);
      const req = {};
      const res = {locals: {}};
      const next = jest.fn();
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(res.locals[output]).toBeUndefined();
    });
  });
  describe("condition present, res.locals[condition] set", () => {
    test("local1 and local2 each contain one email address, a match", () => {
      const condition = "user";
      const local1 = "userEmailData";
      const local2 = "jwtEmailData";
      const output = "userEmail";
      const middleware = reconcileEmails(condition, local1, local2, output);
      const req = {};
      const res = {
        locals: {
          "user": "some-sub-1",
          [local1]: {
            Items: [ { user_email: 'douglasnaphas@gmail.com' } ],
            Count: 1,
            ScannedCount: 1
          },
          [local2]: {
            Items: [ { user_email: 'douglasnaphas@gmail.com' } ],
            Count: 1,
            ScannedCount: 1
          }
        }
      };
      const next = jest.fn();
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(res.locals[output]).toEqual("douglasnaphas@gmail.com");
    });
    test("local1, local2 contain email addresses, including a match", () => {
      const condition = "user";
      const local1 = "userEmailData2";
      const local2 = "jwtEmailData2";
      const output = "userEmail2";
      const middleware = reconcileEmails(condition, local1, local2, output);
      const req = {};
      const res = {
        locals: {
          user: "a-sub-2",
          [local1]: {
            Items: [
              { user_email: "abc@d.com" },
              { user_email: 'douglasnaphas@gmail.com' },
              { user_email: "the.user@passover.lol" },
              { user_email: "douglasnaphas@gmail.com" }
            ],
            Count: 4,
            ScannedCount: 4
          },
          [local2]: {
            Items: [
              { user_email: 'anothernaphas@gmail.com' },
              { user_email: "the.user@passover.lol" }
            ],
            Count: 2,
            ScannedCount: 2
          }
        }
      };
      const next = jest.fn();
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(res.locals[output]).toEqual("the.user@passover.lol");
    });
    test("emails mis-match, expect error", () => {
      const condition = "userX";
      const local1 = "userEmailDataA";
      const local2 = "jwtEmailDataB";
      const output = "userEmailC";
      const middleware = reconcileEmails(condition, local1, local2, output);
      const req = {};
      const res = {
        locals: {
          userX: 'user-sub-x',
          [local1]: {
            Items: [
              { user_email: "bad@situation.com" }
            ],
            Count: 1,
            ScannedCount: 1
          },
          [local2]: {
            Items: [
              { user_email: 'notasingle@match.net' }
            ],
            Count: 1,
            ScannedCount: 1
          }
        }
      };
      const next = jest.fn();
      expect(() => {middleware(req, res, next);}).toThrow();
      expect(next).not.toHaveBeenCalled();
    });
    test("disjoint sets of emails, expect error", () => {
      const condition = "YuserY";
      const local1 = "XuserEmailDataX";
      const local2 = "YjwtEmailDataY";
      const output = "ZuserEmailZ";
      const middleware = reconcileEmails(condition, local1, local2, output);
      const req = {};
      const res = {
        locals: {
          YuserY: 'y-sub-y',
          [local1]: {
            Items: [
              { user_email: "justnomatches@matches.xyz" },
              { user_email: "bad@situation.com" }
            ],
            Count: 2,
            ScannedCount: 1
          },
          [local2]: {
            Items: [
              { user_email: 'really@terrible.net' },
              { user_email: "howtherearent@any.matches" },
              { user_email: "imsorry@abc.state.us" }
            ],
            Count: 3,
            ScannedCount: 1
          }
        }
      };
      const next = jest.fn();
      expect(() => {middleware(req, res, next);}).toThrow();
      expect(next).not.toHaveBeenCalled();
    });
  });
  
});