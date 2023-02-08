import { App } from "aws-cdk-lib";
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
  const app = new App();
  process.env.GITHUB_REPOSITORY = "douglasnaphas/madliberation";
  process.env.GITHUB_REF = "refs/heads/master";
  const stack = new MadliberationWebapp.MadliberationWebapp(
    app,
    "MyTestWebapp"
  );
});
