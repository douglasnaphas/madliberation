import { expect as expectCDK, haveResource } from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import * as MadliberationWebapp from "../lib/madliberation-webapp";
import * as MadliberationUe1 from "../lib/madliberation-ue1";

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
test("can instantiate ue1 stack", () => {
  const app = new cdk.App();
  process.env.GITHUB_REPOSITORY = "douglasnaphas/madliberation";
  process.env.GITHUB_REF = "refs/heads/master";
  process.env.someV1 = "just something";
  const stack = new MadliberationUe1.MadliberationUe1(app, "MyTestUe1Stack");
});
