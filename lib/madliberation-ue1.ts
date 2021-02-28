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
const AWS = require("aws-sdk");

export interface MadLiberationUe1Props extends cdk.StackProps {
  sesEmailVerificationFromAddress?: string;
}

export class MadliberationUe1 extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: MadLiberationUe1Props) {
    super(scope, id, props);

    // condition an output on an SSM param
    const ssm = new AWS.SSM();
    let ssmResponse: any;
    // const paramName = stackname("example-param-1");
    // const ssmParams = {
    //   Name: paramName,
    // };
    let outputBasedOnParam: any = "the default for outputBasedOnParam";
    if (props?.sesEmailVerificationFromAddress) {
      outputBasedOnParam = props.sesEmailVerificationFromAddress;
    }
    // (async () => {
    //   ssmResponse = await new Promise((resolve, reject) => {
    //     ssm.getParameter(ssmParams, (err: any, data: any) => {
    //       console.log("in callback...");
    //       console.log("data:");
    //       console.log(data);
    //       console.log(err);
    //       console.log(err);
    //       if (data && data.Parameter && data.Parameter.Value) {
    //         console.log("data.Parameter.Value");
    //       }
    //       console.log(data.Parameter.Value);
    //       resolve({ err, data });
    //     });
    //   });
    // })();
    // maybe the above isn't being awaited?
    // it isn't. the important parts are happening after the constructor returns.
    // I need to move the async part, the sdk call, into the bin/ file.
    // if (
    //   ssmResponse &&
    //   ssmResponse.data &&
    //   ssmResponse.data.Parameter &&
    //   ssmResponse.data.Parameter.Value
    // ) {
    //   console.log("assigning to outputBasedOnParam");
    //   console.log(outputBasedOnParam);
    //   outputBasedOnParam = ssmResponse.data.Parameter.Value;
    // }
    new cdk.CfnOutput(this, "outputBasedOnParam", {
      value: outputBasedOnParam,
    });

    // If a

    new cdk.CfnOutput(this, "ue1StackStatus", {
      value: "created",
    });
    const someEnvVarOutput = process.env.someV1 || "default val";
    new cdk.CfnOutput(this, "someEnvVar", {
      value: someEnvVarOutput,
    });
    // new cdk.CfnOutput(this, "paramName", {
    //   value: paramName,
    // });
  }
}
