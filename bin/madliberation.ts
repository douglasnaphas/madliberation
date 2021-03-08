#!/usr/bin/env node
import * as cdk from "@aws-cdk/core";
const AWS = require("aws-sdk");
import { MadliberationWebapp } from "../lib/madliberation-webapp";
const stackname = require("@cdk-turnkey/stackname");

(async () => {
  const app = new cdk.App();

  enum PARAM_SUFFIXES {
    FROM_ADDRESS = "sesEmailVerificationFromAddress",
    DOMAIN_NAME = "domainName",
  }
  const fromAddressParam = stackname(PARAM_SUFFIXES.FROM_ADDRESS);
  const domainNameParam = stackname(PARAM_SUFFIXES.DOMAIN_NAME);
  const ssmParams = {
    Names: [fromAddressParam, domainNameParam],
  };
  AWS.config.update({ region: process.env.AWS_DEFAULT_REGION });
  const ssm = new AWS.SSM();
  let ssmResponse: any;
  ssmResponse = await new Promise((resolve, reject) => {
    ssm.getParameters(ssmParams, (err: any, data: any) => {
      resolve({ err, data });
    });
  });
  let fromAddress, domainName;
  if (ssmResponse?.data?.Parameters?.length > 0) {
    console.log("ssmResponse.data:");
    console.log(ssmResponse.data);
    ssmResponse.data.Parameters.forEach(
      (p: { Name: string; Value: string }) => {
        if (p.Name === fromAddressParam) {
          fromAddress = p.Value;
        }
        if (p.Name === domainNameParam) {
          domainName = p.Value;
        }
      }
    );

    // Validate the fromAddress, if provided
    if (fromAddress) {
      const sesv2 = new AWS.SESV2({ apiVersion: "2019-09-27" });
      // Check to make sure the email is verified and has sending enabled
      let sesv2Response: any;
      const getEmailIdentityParams = {
        EmailIdentity: fromAddress,
      };
      sesv2Response = await new Promise((resolve, reject) => {
        sesv2.getEmailIdentity(
          getEmailIdentityParams,
          (err: any, data: any) => {
            resolve({ err, data });
          }
        );
      });
      if (sesv2Response.err) {
        console.log("error: Could not get email identity, tried to get:");
        console.log(fromAddress);
        process.exit(1);
      }
      if (!sesv2Response.data.VerifiedForSendingStatus) {
        console.log("error: VerifiedForSendingStatus is not true for email:");
        console.log(fromAddress);
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
        console.log(fromAddress);
        process.exit(1);
      }
    }

    // No validation on the domainName param, because of edge cases.
    // For example, what if the account that owns the name has set the name
    // server's to this account's name servers for the name, thus
    // delegating DNS authority?
    // We'll just go with whatever is provided for domainName, and let the stack
    // or build fail if anything goes wrong.
  }
  console.log("bin: Instantiating stack with fromAddress:");
  console.log(fromAddress);
  console.log("and domainName:");
  console.log(domainName);
  new MadliberationWebapp(app, stackname("webapp"), {
    fromAddress,
    domainName,
  });
})();
