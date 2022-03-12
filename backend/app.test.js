/* globals jest */
const request = require("supertest");
const app = require("./app");
const Configs = require("./Configs");

describe("app request-level tests", () => {
  describe("canary", () => {
    test("canary should return 200 with canary message", () => {
      return request(app)
        .get("/public-endpoint")
        .then((response) => {
          expect(response.statusCode).toBe(200);
          expect(response.body.Output).toEqual("this endpoint is public");
        });
    });
  });
  describe("/login", () => {
    const OLD_ENV = process.env;
    beforeEach(() => {
      jest.resetModules();
    });
    afterEach(() => {
      process.env = { ...OLD_ENV };
    });
    describe("returns the IDP_URL location from the env", () => {
      test("some IDP_URL", () => {
        process.env.IDP_URL =
          "https://the-redirect-for.cognitoaws.com/with?params=set";
        return request(app)
          .get("/login")
          .then((response) => {
            expect(response.statusCode).toBe(301);
            expect(response.get("Location")).toEqual(process.env.IDP_URL);
          });
      });
      test("some other IDP_URL", () => {
        process.env.IDP_URL =
          "https://a-different-redirect-url.amazoncognito.com/with?params=set?and=still-set";
        return request(app)
          .get("/login")
          .then((response) => {
            expect(response.statusCode).toBe(301);
            expect(response.get("Location")).toEqual(process.env.IDP_URL);
          });
      });
    });
  });
  describe("/logout", () => {
    test(
      "request with no cookies, params, or data should receive expired " +
        "cookies.",
      async () => {
        const resPublicEndpoint = await request(app).get("/public-endpoint");
        expect(resPublicEndpoint.body.Output).toEqual(
          "this endpoint is public"
        );
        const logoutPath = "/logout";
        const resLogout = await request(app).get(logoutPath);
        expect(resLogout.statusCode).toBe(200);
        expect(resLogout.res.headers["set-cookie"]).toBeTruthy();
        const deletedCookieValue = "expired-via-logout";
        // ; Path=/; HttpOnly; Secure; SameSite=Strict
        [
          ("id_token",
          "access_token",
          "refresh_token",
          Configs.loginCookieName()),
        ].forEach((t) => {
          expect(
            resLogout.res.headers["set-cookie"].find((c) =>
              c.match(
                new RegExp(
                  `^${t}=${deletedCookieValue}.*; ?Expires=Thu, 01 Jan 1970 00:00:00 GMT`
                )
              )
            )
          ).toBeTruthy();
          // get the expiration date
        });
      }
    );
  });
});
