import { expect as expectCDK, haveResource } from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import * as MadliberationWebapp from "../lib/madliberation-webapp";

const OLD_ENV = process.env;
beforeEach(() => {
  jest.resetModules();
  process.env = { ...OLD_ENV };
});
afterAll(() => {
  process.env = { ...OLD_ENV };
});
test("can instantiate webapp stack", () => {
  const app = new cdk.App();
  process.env.GITHUB_REPOSITORY = "douglasnaphas/madliberation";
  process.env.GITHUB_REF = "refs/heads/master";
  const stack = new MadliberationWebapp.MadliberationWebapp(
    app,
    "MyTestWebapp"
  );
});
