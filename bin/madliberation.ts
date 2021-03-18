#!/usr/bin/env node
import * as cdk from "@aws-cdk/core";
import { Console } from "console";
const AWS = require("aws-sdk");
const crypto = require("crypto");
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
    print = () => {
      console.log("webappParamName");
      console.log(this.webappParamName);
      console.log("ssmParamName:");
      console.log(this.ssmParamName());
      console.log("ssmParamValue:");
      console.log(this.ssmParamValue);
    };
    constructor(webappParamName: string) {
      this.webappParamName = webappParamName;
    }
  }
  const configParams: Array<ConfigParam> = [
    new ConfigParam("fromAddress"),
    new ConfigParam("domainName"),
    new ConfigParam("zoneId"),
    new ConfigParam("facebookAppId"),
    new ConfigParam("facebookAppSecret"),
    new ConfigParam("amazonClientId"),
    new ConfigParam("amazonClientSecret"),
    new ConfigParam("googleClientId"),
    new ConfigParam("googleClientSecret"),
  ];

  const ssmParams = {
    Names: configParams.map((c) => c.ssmParamName()),
    WithDecryption: true,
  };

  AWS.config.update({ region: process.env.AWS_DEFAULT_REGION });
  const ssm = new AWS.SSM();
  let ssmResponse: any;
  ssmResponse = await new Promise((resolve, reject) => {
    ssm.getParameters(ssmParams, (err: any, data: any) => {
      resolve({ err, data });
    });
  });

  if (!ssmResponse.data) {
    console.log("error: unsuccessful SSM call, failing");
    console.log(ssmResponse);
    process.exit(1);
  }

  const ssmParameterData: any = {};
  let valueHash;
  ssmResponse?.data?.Parameters?.forEach(
    (p: { Name: string; Value: string }) => {
      console.log("Received parameter named:");
      console.log(p.Name);
      valueHash = crypto
        .createHash("sha256")
        .update(p.Value)
        .digest("hex")
        .toLowerCase();
      console.log("value hash:");
      console.log(valueHash);
      console.log("**************");
      ssmParameterData[p.Name] = p.Value;
    }
  );

  console.log("==================");

  configParams.forEach((c) => {
    c.ssmParamValue = ssmParameterData[c.ssmParamName()];
  });
  const webappProps: any = {};
  configParams.forEach((c) => {
    webappProps[c.webappParamName] = c.ssmParamValue;
  });

  // Validation
  if (webappProps.fromAddress) {
    // Validate the fromAddress, if provided
    const { fromAddress } = webappProps;
    const sesv2 = new AWS.SESV2({ apiVersion: "2019-09-27" });
    // Check to make sure the email is verified and has sending enabled
    let sesv2Response: any;
    const getEmailIdentityParams = {
      EmailIdentity: fromAddress,
    };
    sesv2Response = await new Promise((resolve, reject) => {
      sesv2.getEmailIdentity(getEmailIdentityParams, (err: any, data: any) => {
        resolve({ err, data });
      });
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

  console.log("bin: Instantiating stack with fromAddress:");
  console.log(webappProps.fromAddress);
  console.log("and domainName:");
  console.log(webappProps.domainName);
  console.log("and zoneId:");
  console.log(webappProps.zoneId);
  // TODO: print a hash of the IDP app secrets
  new MadliberationWebapp(app, stackname("webapp"), {
    ...(webappProps as MadLiberationWebappProps),
  });
})();
