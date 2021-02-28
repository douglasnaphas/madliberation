#!/usr/bin/env node
import * as cdk from "@aws-cdk/core";
const AWS = require("aws-sdk");
import { MadliberationWebapp } from "../lib/madliberation-webapp";
import { MadliberationUe1 } from "../lib/madliberation-ue1";
const stackname = require("@cdk-turnkey/stackname");

(async () => {
  const app = new cdk.App();
  const paramName = stackname("example-param-1");
  const ssmParams = {
    Name: paramName,
  };
  AWS.config.update({ region: "us-east-1" });
  const ssm = new AWS.SSM();
  let ssmResponse: any;
  ssmResponse = await new Promise((resolve, reject) => {
    ssm.getParameter(ssmParams, (err: any, data: any) => {
      console.log("in callback...");
      console.log("data:");
      console.log(data);
      console.log(err);
      console.log(err);
      if (data && data.Parameter && data.Parameter.Value) {
        console.log("data.Parameter.Value");
      }
      console.log(data.Parameter.Value);
      resolve({ err, data });
    });
  });
  let sesEmailVerificationFromAddress;
  if (
    ssmResponse &&
    ssmResponse.data &&
    ssmResponse.data.Parameter &&
    ssmResponse.data.Parameter.Value
  ) {
    console.log("assigning to sesEmailVerificationFromAddress");
    sesEmailVerificationFromAddress = ssmResponse.data.Parameter.Value;
  }
  new MadliberationUe1(app, stackname("ue1"), {
    env: { region: "us-east-1" },
    sesEmailVerificationFromAddress,
  });
  new MadliberationWebapp(app, stackname("webapp"));
})();
