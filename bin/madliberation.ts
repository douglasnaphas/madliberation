#!/usr/bin/env node
import * as cdk from "@aws-cdk/core";
const AWS = require("aws-sdk");
import {
  MadliberationWebapp,
  SES_VERIFICATION_PARAM_SUFFIXES,
} from "../lib/madliberation-webapp";
const stackname = require("@cdk-turnkey/stackname");

(async () => {
  const app = new cdk.App();

  const emailVerificationAddressParam = stackname(
    SES_VERIFICATION_PARAM_SUFFIXES.FROM_ADDRESS
  );
  const ssmParams = {
    Names: [emailVerificationAddressParam],
  };
  AWS.config.update({ region: process.env.AWS_DEFAULT_REGION });
  const ssm = new AWS.SSM();
  let ssmResponse: any;
  ssmResponse = await new Promise((resolve, reject) => {
    ssm.getParameters(ssmParams, (err: any, data: any) => {
      resolve({ err, data });
    });
  });
  let sesEmailVerificationFromAddress;
  if (ssmResponse?.data?.Parameters?.length > 0) {
    console.log("ssmResponse.data:");
    console.log(ssmResponse.data);
    ssmResponse.data.Parameters.forEach(
      (p: { Name: string; Value: string }) => {
        if (p.Name === emailVerificationAddressParam) {
          sesEmailVerificationFromAddress = p.Value;
        }
      }
    );
    if (!sesEmailVerificationFromAddress) {
      console.log(
        "error: sesEmailVerificationFromAddress expected, but not set"
      );
      console.log("to fix this, set this param:");
      console.log(emailVerificationAddressParam);
      process.exit(1);
    }

    // We have the verification email info, now validate it
    const sesv2 = new AWS.SESV2({ apiVersion: "2019-09-27" });
    // Check to make sure the email is verified and has sending enabled
    let sesv2Response: any;
    const getEmailIdentityParams = {
      EmailIdentity: sesEmailVerificationFromAddress,
    };
    sesv2Response = await new Promise((resolve, reject) => {
      sesv2.getEmailIdentity(getEmailIdentityParams, (err: any, data: any) => {
        resolve({ err, data });
      });
    });
    if (sesv2Response.err) {
      console.log("error: Could not get email identity, tried to get:");
      console.log(sesEmailVerificationFromAddress);
      process.exit(1);
    }
    if (!sesv2Response.data.VerifiedForSendingStatus) {
      console.log("error: VerifiedForSendingStatus is not true for email:");
      console.log(sesEmailVerificationFromAddress);
      process.exit(1);
    }
    if (
      !(
        sesv2Response.data.DkimAttributes &&
        sesv2Response.data.DkimAttributes.Status &&
        sesv2Response.data.DkimAttributes.Status === "SUCCESS"
      )
    ) {
      console.log(
        "error: DkimAttributes.Status is not SUCCESS. DkimAttributes.Status:"
      );
      console.log(
        sesv2Response.data.DkimAttributes &&
          sesv2Response.data.DkimAttributes.Status &&
          sesv2Response.data.DkimAttributes.Status
      );
      console.log("email:");
      console.log(sesEmailVerificationFromAddress);
      process.exit(1);
    }
  }
  const sesVerificationConfig = sesEmailVerificationFromAddress && {
    fromAddress: sesEmailVerificationFromAddress,
  };

  console.log("bin: Instantiating stack with sesVerificationConfig:");
  console.log(sesVerificationConfig);
  new MadliberationWebapp(app, stackname("webapp"), { sesVerificationConfig });
})();
