import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apigw from "@aws-cdk/aws-apigateway";
import * as s3 from "@aws-cdk/aws-s3";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as origins from "@aws-cdk/aws-cloudfront-origins";
import * as ssm from "@aws-cdk/aws-ssm";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as cognito from "@aws-cdk/aws-cognito";
const stackname = require("@cdk-turnkey/stackname");
const crypto = require("crypto");
import { Effect, PolicyStatement } from "@aws-cdk/aws-iam";

export interface MadLiberationUe1Props extends cdk.StackProps {
  sesVerificationConfig?: { fromAddress: string; fromRegion: string };
}

export enum SES_VERIFICATION_PARAM_SUFFIXES {
  FROM_ADDRESS = "sesEmailVerificationFromAddress",
  FROM_REGION = "sesEmailVerificationFromRegion",
}

export class MadliberationUe1 extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: MadLiberationUe1Props) {
    super(scope, id, props);

    const sesFromAddressParamName = stackname(
      SES_VERIFICATION_PARAM_SUFFIXES.FROM_ADDRESS
    );
    const sesFromRegionParamName = stackname(
      SES_VERIFICATION_PARAM_SUFFIXES.FROM_REGION
    );
    new cdk.CfnOutput(this, "sesFromAddressParamName", {
      value: sesFromAddressParamName,
    });
    const sesFromAddress =
      props?.sesVerificationConfig?.fromAddress || "no SES from address";
    new cdk.CfnOutput(this, "sesFromAddress", {
      value: sesFromAddress,
    });
    new cdk.CfnOutput(this, "sesFromRegionParamName", {
      value: sesFromRegionParamName,
    });
    const sesFromRegion =
      props?.sesVerificationConfig?.fromRegion || "no SES from region";
    new cdk.CfnOutput(this, "sesFromRegion", {
      value: sesFromRegion,
    });
  }
}
