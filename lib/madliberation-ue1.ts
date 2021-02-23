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

export class MadliberationUe1 extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new cdk.CfnOutput(this, "ue1StackStatus", {
      value: "created",
    });
    new cdk.CfnOutput(this, "someEnvVar", {
      value: process.env.someV1 as string,
    });
  }
}
