"use strict";

const supertest = require("supertest");
const app = require("../app.js");

describe("app", function () {
  it("test /v2 (POST)", (done) => {
    supertest(app)
      .post("/v2/")
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeTruthy();
        expect(response.body.Output).toBeTruthy();
        expect(response.body.Output).toEqual("Hello World!! ");
        done();
      });
  });
  it("test canary", (done) => {
    supertest(app)
      .get("/v2/public-endpoint")
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});
