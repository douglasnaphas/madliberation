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

export interface MadLiberationWebappProps extends cdk.StackProps {
  sesVerificationConfig?: { fromAddress: string };
}

export enum SES_VERIFICATION_PARAM_SUFFIXES {
  FROM_ADDRESS = "sesEmailVerificationFromAddress",
}

export class MadliberationWebapp extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: MadLiberationWebappProps) {
    super(scope, id, props);

    const sedersTable = new dynamodb.Table(this, "SedersTable", {
      partitionKey: { name: "room_code", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "lib_id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
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
    });

    const userPool = new cognito.UserPool(this, "UserPool", {
      selfSignUpEnabled: true,
      userVerification: {
        emailSubject: "Mad Liberation: verify your new account",
        emailStyle: cognito.VerificationEmailStyle.LINK,
      },
      signInAliases: { username: false, email: true, phone: false },
      autoVerify: { email: true, phone: false },
      mfa: cognito.Mfa.OPTIONAL,
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      passwordPolicy: {
        requireDigits: false,
        requireLowercase: false,
        requireSymbols: false,
        requireUppercase: false,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: false,
        },
        nickname: {
          required: true,
          mutable: true,
        },
      },
    });
    let cfnUserPool;
    if (props?.sesVerificationConfig) {
      cfnUserPool = userPool.node.defaultChild as cognito.CfnUserPool;
      cfnUserPool.emailConfiguration = {
        emailSendingAccount: "DEVELOPER",
        from: `Mad Liberation Verification <${props?.sesVerificationConfig?.fromAddress}>`,
        sourceArn:
          // SES integration is only available in us-east-1, us-west-2, eu-west-1
          `arn:aws:ses:${this.region}` +
          `:${this.account}:identity/` +
          `${props?.sesVerificationConfig?.fromAddress}`,
      };
    }
    const clientWriteAttributes = new cognito.ClientAttributes().withStandardAttributes(
      { nickname: true, email: true }
    );
    const clientReadAttributes = clientWriteAttributes.withStandardAttributes({
      emailVerified: true,
    });
    const userPoolClient = userPool.addClient("UserPoolClient", {
      generateSecret: true,
      oAuth: {
        callbackUrls: ["https://" + distro.domainName + "/prod/get-cookies"],
        scopes: [
          cognito.OAuthScope.EMAIL,
          cognito.OAuthScope.COGNITO_ADMIN,
          cognito.OAuthScope.OPENID,
          cognito.OAuthScope.PROFILE,
        ],
        flows: {
          authorizationCodeGrant: true,
          clientCredentials: false,
          implicitCodeGrant: false,
        },
      },
      readAttributes: clientReadAttributes,
      writeAttributes: clientWriteAttributes,
    });

    const stacknameHash = crypto
      .createHash("sha256")
      .update(stackname(`udp`))
      .digest("hex")
      .toLowerCase()
      .slice(0, 20);
    const domainPrefix = stacknameHash + this.account;

    const userPoolDomain = userPool.addDomain("UserPoolDomain", {
      cognitoDomain: {
        domainPrefix: domainPrefix,
      },
    });

    const fn = new lambda.Function(this, "BackendHandler", {
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("backend"),
      memorySize: 3000,
      environment: {
        NODE_ENV: "production",
        TABLE_NAME: sedersTable.tableName,
        JWKS_URL:
          "https://cognito-idp." +
          this.region +
          ".amazonaws.com/" +
          userPool.userPoolId +
          "/.well-known/jwks.json",
        USER_POOL_CLIENT_ID: userPoolClient.userPoolClientId,
        USER_POOL_ID: userPool.userPoolId,
        USER_POOL_DOMAIN: userPoolDomain.domainName,
        REDIRECT_URI: "https://" + distro.domainName + "/prod/get-cookies",
        REGION: this.region,
        IDP_URL:
          "https://" +
          userPoolDomain.domainName +
          ".auth." +
          this.region +
          ".amazoncognito.com/login?response_type=code&client_id=" +
          userPoolClient.userPoolClientId +
          "&redirect_uri=" +
          "https://" +
          distro.domainName +
          "/prod/get-cookies",
      },
      timeout: cdk.Duration.seconds(20),
    });

    fn.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["cognito-idp:DescribeUserPoolClient"],
        resources: [
          `arn:aws:cognito-idp:${userPool.stack.region}:${userPool.stack.account}:userpool/${userPool.userPoolId}`,
        ],
      })
    );

    const lambdaApi = new apigw.LambdaRestApi(this, "Endpoint", {
      handler: fn,
    });

    const lambdaApiUrlConstructed =
      lambdaApi.restApiId +
      ".execute-api." +
      this.region +
      "." +
      this.urlSuffix;
    distro.addBehavior(
      "/prod/*",
      new origins.HttpOrigin(lambdaApiUrlConstructed, {
        protocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
      }),
      {
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        originRequestPolicy: new cloudfront.OriginRequestPolicy(
          this,
          "BackendORP",
          {
            cookieBehavior: cloudfront.OriginRequestCookieBehavior.all(),
            queryStringBehavior: cloudfront.OriginRequestQueryStringBehavior.all(),
          }
        ),
      }
    );

    const sesFromAddressParamName = stackname(
      SES_VERIFICATION_PARAM_SUFFIXES.FROM_ADDRESS
    );
    new cdk.CfnOutput(this, "sesFromAddressParamName", {
      value: sesFromAddressParamName,
    });
    const sesFromAddress =
      props?.sesVerificationConfig?.fromAddress || "no SES from address";
    new cdk.CfnOutput(this, "sesFromAddress", {
      value: sesFromAddress,
    });
    new cdk.CfnOutput(this, "DistributionDomainName", {
      value: distro.distributionDomainName,
    });
    new cdk.CfnOutput(this, "lambdaApi_url", {
      value: lambdaApi.url,
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
  }
}
