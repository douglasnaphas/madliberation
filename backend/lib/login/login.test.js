const login = require("./login");
const express = require("express");
const Configs = require("../../Configs");
const request = require("supertest");

const app = express();
app.get("/login", login);
const OLD_ENV = process.env;
process.env.IDP_URL = "https://the-redirect-for.cognitoaws.com/with?params=set";
beforeEach(() => {
  jest.resetModules();
});
afterEach(() => {
  process.env = { ...OLD_ENV };
});

describe("login", () => {
  test.each([
    {
      requestUrl: "/login",
      expectedLocation: `${Configs.idpUrl()}`,
    },
    {
      requestUrl: "/login?return-page=/create-haggadah/index.html",
      expectedLocation: `${Configs.idpUrl()}&return-page=/create-haggadah/index.html`,
    },
  ])("$requestUrl -> $expectedLocation", ({ requestUrl, expectedLocation }) => {
    return request(app)
      .get(requestUrl)
      .then((response) => {
        expect(response.statusCode).toBe(301);
        const redirectLocationURL = new URL(response.get("Location"));
        expect(redirectLocationURL.searchParams.get("params")).toEqual("set");
        expect(response.get("Location")).toEqual(expectedLocation);
      });
  });
});
