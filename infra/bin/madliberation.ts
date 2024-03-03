#!/usr/bin/env node
import { App, SecretValue } from "aws-cdk-lib";
import { Console } from "console";
const { SSMClient, GetParametersCommand } = require("@aws-sdk/client-ssm");
import { SESv2Client, GetEmailIdentityCommand } from "@aws-sdk/client-sesv2";
const crypto = require("crypto");
import {
  MadliberationWebapp,
  MadLiberationWebappProps,
} from "../lib/madliberation-webapp";
import * as iam from 'aws-cdk-lib/aws-iam';
const stackname = require("@cdk-turnkey/stackname");
import { GitHubOidcRoleStacks } from "./GitHubOIDCRoleStacks";

(async () => {
  const app = new App();

  if (!process.env.GITHUB_REPOSITORY) {
    console.error("GITHUB_REPOSITORY is not set, it should be something like douglasnaphas/aws-github-oidc");
    process.exit(3);
  }
  GitHubOidcRoleStacks(app, process.env.GITHUB_REPOSITORY);

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
  const ssmClient = new SSMClient({ region: process.env.AWS_DEFAULT_REGION });
  const getParametersInput = {
    Names: configParams.map((c) => c.ssmParamName()),
    WithDecryption: true,
  };
  const getParametersCommand = new GetParametersCommand(getParametersInput);
  const getParametersResponse = await ssmClient.send(getParametersCommand);
  const ssmParameterData: any = {};
  let valueHash;
  getParametersResponse?.Parameters?.forEach(
    (p: { Name: string; Value: string, Type: string }) => {
      console.log("(v3) Received parameter named:");
      console.log(p.Name);
      const SHORT_PREFIX_LENGTH = 6;
      valueHash = crypto
        .createHash("sha256")
        .update(p.Value)
        .digest("hex")
        .toLowerCase()
        .substring(0, SHORT_PREFIX_LENGTH);
      console.log("(v3) value hash:");
      console.log(valueHash);
      console.log("**************");
      if (p.Type === "SecureString") {
        ssmParameterData[p.Name] = SecretValue.ssmSecure(p.Name);
      } else {
        ssmParameterData[p.Name] = p.Value;
      }
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
    const sesv2Client = new SESv2Client({
      region: process.env.AWS_DEFAULT_REGION,
    });
    // Check to make sure the email is verified and has sending enabled
    const getEmailIdentityInput = {
      EmailIdentity: fromAddress,
    };
    const getEmailIdentityCommand = new GetEmailIdentityCommand(
      getEmailIdentityInput
    );
    const getEmailIdentityResponse = await sesv2Client.send(
      getEmailIdentityCommand
    );
    if (!getEmailIdentityResponse.VerifiedForSendingStatus) {
      console.log("error: VerifiedForSendingStatus is not true for email:");
      console.log(fromAddress);
      process.exit(1);
    }
    if (
      !(
        getEmailIdentityResponse.DkimAttributes &&
        getEmailIdentityResponse.DkimAttributes.Status &&
        getEmailIdentityResponse.DkimAttributes.Status === "SUCCESS"
      )
    ) {
      console.log(
        "error: DkimAttributes.Status is not SUCCESS. DkimAttributes.Status:"
      );
      console.log(
        getEmailIdentityResponse.DkimAttributes &&
        getEmailIdentityResponse.DkimAttributes.Status &&
        getEmailIdentityResponse.DkimAttributes.Status
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
