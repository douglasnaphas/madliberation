import { expect as expectCDK, haveResource } from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import * as Madliberation from "../lib/madliberation-stack";

const OLD_ENV = process.env;
beforeEach(() => {
  jest.resetModules();
  process.env = { ...OLD_ENV };
});
afterAll(() => {
  process.env = { ...OLD_ENV };
});
test("can instantiate stack", () => {
  const app = new cdk.App();
  process.env.GITHUB_REPOSITORY = "douglasnaphas/madliberation";
  process.env.GITHUB_REF = "refs/heads/master";
  const stack = new Madliberation.MadliberationStack(app, "MyTestStack");
});
