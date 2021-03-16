#!/usr/bin/env node
import * as cdk from "@aws-cdk/core";
const AWS = require("aws-sdk");
import {
  MadliberationWebapp,
  MadLiberationWebappProps,
} from "../lib/madliberation-webapp";
const stackname = require("@cdk-turnkey/stackname");

(async () => {
  const app = new cdk.App();

  // This is the array I'll eventually use to elegantly state these names only
  // once in this file.
  class ConfigParam {
    webappParamName: string;
    ssmParamName = () => stackname(this.webappParamName);
    ssmParamValue?: string;
    constructor(webappParamName: string) {
      this.webappParamName = webappParamName;
    }
  }
  const configParams: Array<ConfigParam> = [
    new ConfigParam("fromAddress"),
    new ConfigParam("domainName"),
    new ConfigParam("zoneId"),
    new ConfigParam("facbookAppId"),
    new ConfigParam("facebookAppSecret"),
  ];

  const ssmParams = {
    Names: [configParams.map((c) => c.ssmParamName())],
  };
  AWS.config.update({ region: process.env.AWS_DEFAULT_REGION });
  const ssm = new AWS.SSM();
  let ssmResponse: any;
  ssmResponse = await new Promise((resolve, reject) => {
    ssm.getParameters(ssmParams, (err: any, data: any) => {
      resolve({ err, data });
    });
  });

  const ssmParameterData: any = {};
  ssmResponse?.data?.Parameters?.forEach(
    (p: { Name: string; Value: string }) => {
      ssmParameterData[p.Name] = p.Value;
    }
  );

  // Validation
  if (ssmParameterData.fromAddress) {
    // Validate the fromAddress, if provided
    const { fromAddress } = ssmParameterData;
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
  }
  // No validation on the domainName param, because of edge cases.
  // For example, what if the account that owns the name has set the name
  // server's to this account's name servers for the name, thus
  // delegating DNS authority?
  // We'll just go with whatever is provided for domainName, and let the stack
  // or build fail if anything goes wrong.

  configParams.forEach((c) => {
    c.ssmParamValue = ssmParameterData[c.ssmParamName()];
  });
  const webappProps: any = {};
  configParams.forEach((c) => {
    webappProps[c.webappParamName] = c.ssmParamValue;
  });
  console.log("bin: Instantiating stack with fromAddress:");
  console.log(webappProps.fromAddress);
  console.log("and domainName:");
  console.log(webappProps.domainName);
  console.log("and zoneId:");
  console.log(webappProps.zoneId);
  new MadliberationWebapp(app, stackname("webapp"), {
    ...(webappProps as MadLiberationWebappProps),
  });
})();
