import * as sns from "@aws-cdk/aws-sns";
import * as subs from "@aws-cdk/aws-sns-subscriptions";
import * as sqs from "@aws-cdk/aws-sqs";
import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apigw from "@aws-cdk/aws-apigateway";
import * as s3 from "@aws-cdk/aws-s3";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as origins from "@aws-cdk/aws-cloudfront-origins";

export class MadliberationStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const frontendBucketName = this.node.tryGetContext(
      "frontendBucketName"
    ) as string;

    const queue = new sqs.Queue(this, "MadliberationQueue", {
      visibilityTimeout: cdk.Duration.seconds(300),
    });

    const topic = new sns.Topic(this, "MadliberationTopic");

    topic.addSubscription(new subs.SqsSubscription(queue));

    const fn = new lambda.Function(this, "MLJSAPIHandler", {
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("mljsapi"),
      environment: {
        NODE_ENV: "development",
      },
      timeout: cdk.Duration.seconds(20),
    });

    const lambdaApi = new apigw.LambdaRestApi(this, "Endpoint", {
      handler: fn,
    });

    const frontendBucket = new s3.Bucket(this, "FrontendBucket", {
      bucketName: frontendBucketName,
    });
    const distro = new cloudfront.Distribution(this, "Distro", {
      defaultBehavior: { origin: new origins.S3Origin(frontendBucket) },
      defaultRootObject: "index.html",
      additionalBehaviors: {
        "/prod/*": {
          origin: new origins.HttpOrigin(
            lambdaApi.url.replace(/^https:\/\//, "").replace(/\/prod\/$/, ""),
            { protocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY }
          ),
        },
      },
    });
    new cdk.CfnOutput(this, "DistributionDomainName", {
      value: distro.distributionDomainName,
    });
    new cdk.CfnOutput(this, "DomainName", {
      value: distro.domainName,
    });
    new cdk.CfnOutput(this, "lambdaApi_url", {
      value: lambdaApi.url,
    });
    new cdk.CfnOutput(this, "lambdaApi_url_transformed", {
      value: lambdaApi.url.replace(/^https:\/\//, "").replace(/\/prod\/$/, ""),
    });
  }
}
