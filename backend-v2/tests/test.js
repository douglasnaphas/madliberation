"use strict";

const supertest = require("supertest");
const app = require("../app.js");

describe("app", function () {
  it("test / (POST)", (done) => {
    supertest(app)
      .post("/")
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
      .get("/public-endpoint")
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
  it("test redirect from /login", function (done) {
    supertest(app)
      .get("/login")
      .then((response) => {
        expect(response.statusCode).toBe(301);
        done();
      });
  });
});
