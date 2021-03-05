#!/usr/bin/env node
import * as cdk from "@aws-cdk/core";
const AWS = require("aws-sdk");
import { MadliberationWebapp } from "../lib/madliberation-webapp";
import { MadliberationUe1 } from "../lib/madliberation-ue1";
const stackname = require("@cdk-turnkey/stackname");

(async () => {
  const app = new cdk.App();

  const emailVerificationAddressParam = stackname(
    "sesEmailVerificationFromAddress"
  );
  const emailVerificationRegionParam = stackname(
    "sesEmailVerificationFromRegion"
  );
  const ssmParams = {
    Names: [emailVerificationAddressParam, emailVerificationRegionParam],
  };
  AWS.config.update({ region: "us-east-1" });
  const ssm = new AWS.SSM();
  let ssmResponse: any;
  ssmResponse = await new Promise((resolve, reject) => {
    ssm.getParameters(ssmParams, (err: any, data: any) => {
      resolve({ err, data });
    });
  });
  let sesEmailVerificationFromAddress;
  if (ssmResponse && ssmResponse.data && ssmResponse.data.Parameters) {
    sesEmailVerificationFromAddress = ssmResponse.data.Parameter.Value;
  }
  new MadliberationUe1(app, stackname("ue1"), {
    env: { region: "us-east-1" },
    sesVerificationConfig: sesEmailVerificationFromAddress && {
      fromAddress: sesEmailVerificationFromAddress,
      fromRegion: "us-east-1",
    },
  });
  new MadliberationWebapp(app, stackname("webapp"));
})();
