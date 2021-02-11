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

export class MadliberationStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const sedersTable = new dynamodb.Table(this, "SedersTable", {
      partitionKey: { name: "room_code", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "lib_id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // This has to happen before the backend handler, because the Lambda needs
    // the bucket name as an env var.
    const clientSecretBucket = new s3.Bucket(this, "BackendSecretBucket", {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      versioned: true,
    });

    const fn = new lambda.Function(this, "BackendHandler", {
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("backend"),
      memorySize: 3000,
      environment: {
        NODE_ENV: "production",
        TABLE_NAME: sedersTable.tableName,
        CLIENT_SECRET_BUCKET_NAME: clientSecretBucket.bucketName,
      },
      timeout: cdk.Duration.seconds(20),
    });

    clientSecretBucket.grantRead(fn);

    const lambdaApi = new apigw.LambdaRestApi(this, "Endpoint", {
      handler: fn,
    });

    const frontendBucket = new s3.Bucket(this, "FrontendBucket");

    // This is so a script can find the bucket and deploy to it.
    // I can't wrap up the artifact at cdk-deploy time, because the CDK Level-3
    // construct for doing so is still (last I checked) experimental
    const frontendBucketNameParam = new ssm.StringParameter(
      this,
      "FrontendBucketNameParam",
      {
        description: "The name of the bucket where front-end assets go",
        parameterName: stackname("FrontendBucketName"),
        stringValue: frontendBucket.bucketName,
        tier: ssm.ParameterTier.STANDARD,
        type: ssm.ParameterType.STRING,
      }
    );

    const lambdaApiUrlConstructed =
      lambdaApi.restApiId +
      ".execute-api." +
      this.region +
      "." +
      this.urlSuffix;
    const distro = new cloudfront.Distribution(this, "Distro", {
      logBucket: new s3.Bucket(this, "DistroLoggingBucket"),
      logFilePrefix: "distribution-access-logs/",
      logIncludesCookies: true,
      defaultBehavior: {
        origin: new origins.S3Origin(frontendBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
      },
      defaultRootObject: "index.html",
      additionalBehaviors: {
        "/prod/*": {
          origin: new origins.HttpOrigin(lambdaApiUrlConstructed, {
            protocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
          }),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          originRequestPolicy: new cloudfront.OriginRequestPolicy(
            this,
            "BackendORP",
            {
              cookieBehavior: cloudfront.OriginRequestCookieBehavior.all(),
              queryStringBehavior: cloudfront.OriginRequestQueryStringBehavior.all(),
            }
          ),
          // originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER,
        },
      },
    });

    const userPool = new cognito.UserPool(this, "UserPool", {
      selfSignUpEnabled: true,
      userVerification: {
        emailSubject: "Mad Liberation: verify your new account",
        emailStyle: cognito.VerificationEmailStyle.LINK,
      },
      signInAliases: { username: true, email: true, phone: true },
      autoVerify: { email: true, phone: true },
      mfa: cognito.Mfa.OPTIONAL,
      accountRecovery: cognito.AccountRecovery.EMAIL_AND_PHONE_WITHOUT_MFA,
    });
    const userPoolClient = userPool.addClient("UserPoolClient", {
      generateSecret: true,
      oAuth: {
        callbackUrls: ["https://" + distro.domainName + "/prod/get-cookies"],
        scopes: [cognito.OAuthScope.EMAIL],
        flows: {
          authorizationCodeGrant: true,
          clientCredentials: false,
          implicitCodeGrant: false,
        },
      },
    });

    const stacknameHash = crypto
      .createHash("sha256")
      .update(stackname(`udp`))
      .digest("hex")
      .toLowerCase()
      .slice(0, 20);
    const domainPrefix = stacknameHash + this.account;

    userPool.addDomain("UserPoolDomain", {
      cognitoDomain: {
        domainPrefix: domainPrefix,
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
      value: lambdaApi.url.replace(/https:\/\/|\/prod\//g, ""),
    });
    new cdk.CfnOutput(this, "lambdaApi_url_constructed", {
      value: lambdaApiUrlConstructed,
    });
    new cdk.CfnOutput(this, "FrontendBucketName", {
      value: frontendBucket.bucketName,
    });
    new cdk.CfnOutput(this, "FrontendBucketNameParamName", {
      value: frontendBucketNameParam.parameterName,
    });
    new cdk.CfnOutput(this, "UserPoolId", {
      value: userPool.userPoolId,
    });
    new cdk.CfnOutput(this, "UserPoolClientId", {
      value: userPoolClient.userPoolClientId,
    });
    new cdk.CfnOutput(this, "ClientSecretBucketName", {
      value: clientSecretBucket.bucketName,
    });
  }
}
