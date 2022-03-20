import { Construct } from "constructs";
import {
  App,
  CfnOutput,
  Duration,
  RemovalPolicy,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import { aws_lambda as lambda } from "aws-cdk-lib";
import { aws_apigateway as apigw } from "aws-cdk-lib";
import { aws_s3 as s3 } from "aws-cdk-lib";
import { aws_cloudfront as cloudfront } from "aws-cdk-lib";
import { aws_cloudfront_origins as origins } from "aws-cdk-lib";
import { aws_ssm as ssm } from "aws-cdk-lib";
import { aws_dynamodb as dynamodb } from "aws-cdk-lib";
import { aws_cognito as cognito } from "aws-cdk-lib";
const stackname = require("@cdk-turnkey/stackname");
const crypto = require("crypto");
import { aws_iam as iam } from "aws-cdk-lib";
import { aws_certificatemanager as acm } from "aws-cdk-lib";
import { aws_route53 as route53 } from "aws-cdk-lib";
import { aws_route53_targets as targets } from "aws-cdk-lib";
import { aws_sqs as sqs } from "aws-cdk-lib";
import {
  DynamoEventSource,
  SqsDlq,
} from "aws-cdk-lib/aws-lambda-event-sources";
import * as apigwv2 from "@aws-cdk/aws-apigatewayv2-alpha";
import * as apigwv2i from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
const schema = require("../backend/schema");

export interface MadLiberationWebappProps extends StackProps {
  fromAddress?: string;
  domainName?: string;
  zoneId?: string;
  facebookAppId?: string;
  facebookAppSecret?: string;
  amazonClientId?: string;
  amazonClientSecret?: string;
  googleClientId?: string;
  googleClientSecret?: string;
}

export class MadliberationWebapp extends Stack {
  constructor(scope: App, id: string, props: MadLiberationWebappProps = {}) {
    super(scope, id, props);

    const {
      fromAddress,
      domainName,
      zoneId,
      facebookAppId,
      facebookAppSecret,
      amazonClientId,
      amazonClientSecret,
      googleClientId,
      googleClientSecret,
    } = props;

    class MadLiberationBucket extends s3.Bucket {
      constructor(scope: Construct, id: string, props: s3.BucketProps = {}) {
        super(scope, id, {
          removalPolicy: RemovalPolicy.DESTROY,
          autoDeleteObjects: true,
          ...props,
        });
      }
    }

    class MadLiberationUserPool extends cognito.UserPool {
      constructor(
        scope: Construct,
        id: string,
        props: cognito.UserPoolProps = {}
      ) {
        super(scope, id, {
          removalPolicy: RemovalPolicy.DESTROY,
          ...props,
        });
      }
    }

    const sedersTable = new dynamodb.Table(this, "SedersTable", {
      partitionKey: {
        name: schema.PARTITION_KEY,
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: { name: schema.SORT_KEY, type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
    });
    sedersTable.addGlobalSecondaryIndex({
      indexName: schema.SCRIPTS_INDEX,
      partitionKey: {
        name: schema.SCRIPTS_PART_KEY,
        type: dynamodb.AttributeType.NUMBER,
      },
      nonKeyAttributes: [
        schema.HAGGADAH_DESCRIPTION,
        schema.HAGGADAH_NAME,
        schema.SORT_KEY,
        schema.PARTITION_KEY,
        schema.HAGGADAH_SHORT_DESC,
        schema.PATH,
      ],
      projectionType: dynamodb.ProjectionType.INCLUDE,
      sortKey: {
        name: schema.SCRIPT_NUMBER,
        type: dynamodb.AttributeType.NUMBER,
      },
    });
    sedersTable.addGlobalSecondaryIndex({
      indexName: schema.EMAIL_PATH_INDEX,
      partitionKey: {
        name: schema.USER_EMAIL,
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: schema.PATH,
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });
    sedersTable.addGlobalSecondaryIndex({
      indexName: schema.EMAIL_GAME_NAME_INDEX,
      partitionKey: {
        name: schema.USER_EMAIL,
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: schema.GAME_NAME,
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });
    sedersTable.addGlobalSecondaryIndex({
      indexName: schema.OPAQUE_COOKIE_INDEX,
      partitionKey: {
        name: schema.OPAQUE_COOKIE,
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    const frontendBucket = new MadLiberationBucket(this, "FrontendBucket");

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

    let hostedZone, wwwDomainName, certificate, domainNames;
    if (domainName && zoneId) {
      hostedZone = route53.HostedZone.fromHostedZoneAttributes(
        this,
        "HostedZone",
        { hostedZoneId: zoneId, zoneName: domainName + "." }
      );
      wwwDomainName = "www." + domainName;
      certificate = new acm.Certificate(this, "Certificate", {
        domainName,
        subjectAlternativeNames: [wwwDomainName],
        validation: acm.CertificateValidation.fromDns(hostedZone),
      });
      domainNames = [domainName, wwwDomainName];
    }

    const distroProps: any = {
      logBucket: new MadLiberationBucket(this, "DistroLoggingBucket"),
      logFilePrefix: "distribution-access-logs/",
      logIncludesCookies: true,
      defaultBehavior: {
        origin: new origins.S3Origin(frontendBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
      },
      defaultRootObject: "index.html",
      domainNames,
      certificate,
    };

    const distro = new cloudfront.Distribution(this, "Distro", distroProps);

    const userPool = new MadLiberationUserPool(this, "UserPool", {
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
          mutable: true,
        },
        nickname: {
          required: true,
          mutable: true,
        },
      },
    });
    let cfnUserPool;
    if (fromAddress) {
      cfnUserPool = userPool.node.defaultChild as cognito.CfnUserPool;
      cfnUserPool.emailConfiguration = {
        emailSendingAccount: "DEVELOPER",
        from: `Mad Liberation Verification <${fromAddress}>`,
        sourceArn:
          // SES integration is only available in us-east-1, us-west-2, eu-west-1
          `arn:aws:ses:${this.region}` +
          `:${this.account}:identity/` +
          `${fromAddress}`,
      };
    }
    const clientWriteAttributes =
      new cognito.ClientAttributes().withStandardAttributes({
        nickname: true,
        email: true,
      });
    const clientReadAttributes = clientWriteAttributes.withStandardAttributes({
      emailVerified: true,
    });
    const webappDomainName = domainName || distro.distributionDomainName;

    if (facebookAppId && facebookAppSecret) {
      const userPoolIdentityProviderFacebook =
        new cognito.UserPoolIdentityProviderFacebook(this, "Facebook", {
          clientId: facebookAppId,
          clientSecret: facebookAppSecret,
          userPool,
          scopes: ["public_profile", "email"],
          /*
          > Apps may ask for the following two permissions from any person
          > without submitting for review by Facebook:
          >
          > public profile
          > email

          https://developers.facebook.com/docs/facebook-login/overview
          */
          attributeMapping: {
            nickname: cognito.ProviderAttribute.FACEBOOK_NAME,
            email: cognito.ProviderAttribute.FACEBOOK_EMAIL,
          },
        });
      userPool.registerIdentityProvider(userPoolIdentityProviderFacebook);
    }
    if (amazonClientId && amazonClientSecret) {
      const userPoolIdentityProviderAmazon =
        new cognito.UserPoolIdentityProviderAmazon(this, "Amazon", {
          clientId: amazonClientId,
          clientSecret: amazonClientSecret,
          userPool,
          attributeMapping: {
            nickname: cognito.ProviderAttribute.AMAZON_NAME,
            email: cognito.ProviderAttribute.AMAZON_EMAIL,
          },
        });
      userPool.registerIdentityProvider(userPoolIdentityProviderAmazon);
    }
    if (googleClientId && googleClientSecret) {
      const userPoolIdentityProviderGoogle =
        new cognito.UserPoolIdentityProviderGoogle(this, "Google", {
          clientId: googleClientId,
          clientSecret: googleClientSecret,
          userPool,
          scopes: ["profile", "email"],
          attributeMapping: {
            nickname: cognito.ProviderAttribute.GOOGLE_NAME,
            email: cognito.ProviderAttribute.GOOGLE_EMAIL,
          },
        });
      userPool.registerIdentityProvider(userPoolIdentityProviderGoogle);
    }

    const userPoolClient = userPool.addClient("UserPoolClient", {
      generateSecret: true,
      oAuth: {
        callbackUrls: ["https://" + webappDomainName + "/prod/get-cookies"],
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

    const backendHandler = new lambda.Function(this, "BackendHandler", {
      runtime: lambda.Runtime.NODEJS_14_X,
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
        REDIRECT_URI: "https://" + webappDomainName + "/prod/get-cookies",
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
          webappDomainName +
          "/prod/get-cookies",
      },
      timeout: Duration.seconds(20),
    });

    sedersTable.grantReadWriteData(backendHandler);

    backendHandler.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["cognito-idp:DescribeUserPoolClient"],
        resources: [
          `arn:aws:cognito-idp:${userPool.stack.region}:${userPool.stack.account}:userpool/${userPool.userPoolId}`,
        ],
      })
    );

    const lambdaApi = new apigw.LambdaRestApi(this, "Endpoint", {
      handler: backendHandler,
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
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        originRequestPolicy: new cloudfront.OriginRequestPolicy(
          this,
          "BackendORP",
          {
            cookieBehavior: cloudfront.OriginRequestCookieBehavior.all(),
            queryStringBehavior:
              cloudfront.OriginRequestQueryStringBehavior.all(),
          }
        ),
      }
    );

    if (domainName && wwwDomainName && hostedZone) {
      // point the domain name with an alias record to the distro
      const aliasRecord = new route53.ARecord(this, "Alias", {
        recordName: domainName,
        zone: hostedZone,
        target: route53.RecordTarget.fromAlias(
          new targets.CloudFrontTarget(distro)
        ),
      });
      const aliasWWWRecord = new route53.ARecord(this, "AliasWWW", {
        recordName: wwwDomainName,
        zone: hostedZone,
        target: route53.RecordTarget.fromAlias(
          new targets.CloudFrontTarget(distro)
        ),
      });
      const DNS_WEIGHT = 100;
      const cfnAliasRecordSet = aliasRecord.node
        .defaultChild as route53.CfnRecordSet;
      cfnAliasRecordSet.weight = DNS_WEIGHT;
      cfnAliasRecordSet.setIdentifier = "mlwebapp-cf-alias";
      const cfnAliasWWWRecordSet = aliasWWWRecord.node
        .defaultChild as route53.CfnRecordSet;
      cfnAliasWWWRecordSet.weight = DNS_WEIGHT;
      cfnAliasWWWRecordSet.setIdentifier = "mlwebapp-www-cf-alias";
    }

    const makeHandler = (prefix: string) =>
      new lambda.Function(this, `${prefix}Handler`, {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: `${prefix.toLowerCase()}.handler`,
        code: lambda.Code.fromAsset("backend"),
        memorySize: 3000,
        environment: {
          NODE_ENV: "production",
          TABLE_NAME: sedersTable.tableName,
        },
        timeout: Duration.seconds(20),
      });
    const connectHandler = makeHandler("Connect");
    const disconnectHandler = makeHandler("Disconnet");
    const defaultHandler = makeHandler("Default");
    const joinedHandler = makeHandler("Joined");
    [connectHandler, disconnectHandler, defaultHandler].forEach((handler) => {
      sedersTable.grantReadWriteData(handler);
    });
    const webSocketApi = new apigwv2.WebSocketApi(this, "WSAPI", {
      connectRouteOptions: {
        integration: new apigwv2i.WebSocketLambdaIntegration(
          "ConnectIntegration",
          connectHandler
        ),
      },
      disconnectRouteOptions: {
        integration: new apigwv2i.WebSocketLambdaIntegration(
          "DisconnectIntegration",
          disconnectHandler
        ),
      },
      defaultRouteOptions: {
        integration: new apigwv2i.WebSocketLambdaIntegration(
          "DefaultIntegration",
          defaultHandler
        ),
      },
    });
    const stageName = "ws";
    const wsStage = new apigwv2.WebSocketStage(this, "WSStage", {
      stageName,
      webSocketApi,
      autoDeploy: true,
    });
    distro.addBehavior(
      `/${stageName}/*`,
      new origins.HttpOrigin(
        `${webSocketApi.apiId}.execute-api.${this.region}.${this.urlSuffix}`,
        {
          protocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
        }
      ),
      {
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        originRequestPolicy: new cloudfront.OriginRequestPolicy(
          this,
          "WSOriginRequestPolicy",
          {
            headerBehavior: cloudfront.OriginRequestHeaderBehavior.allowList(
              "Sec-WebSocket-Extensions",
              "Sec-WebSocket-Key",
              "Sec-WebSocket-Version"
            ),
            cookieBehavior: cloudfront.OriginRequestCookieBehavior.all(),
            queryStringBehavior:
              cloudfront.OriginRequestQueryStringBehavior.all(),
          }
        ),
      }
    );
    const deadLetterQueue = new sqs.Queue(this, "deadLetterQueue");

    joinedHandler.addEnvironment("WS_ENDPOINT", webSocketApi.apiEndpoint);

    const joinedMapping = new lambda.EventSourceMapping(this, "JoinedMapping", {
      target: joinedHandler,
      eventSourceArn: sedersTable.tableStreamArn,
      startingPosition: lambda.StartingPosition.TRIM_HORIZON,
      bisectBatchOnError: true,
      onFailure: new SqsDlq(deadLetterQueue),
      retryAttempts: 5,
    });

    const joinedFilter = require("../eventFilters/joinedFilter");

    const cfnJoinedMapping = joinedMapping.node
      .defaultChild as lambda.CfnEventSourceMapping;
    cfnJoinedMapping.addPropertyOverride("FilterCriteria", {
      Filters: [joinedFilter],
    });

    sedersTable.grantStreamRead(joinedHandler);

    const scriptsBucket = new MadLiberationBucket(this, "ScriptsBucket", {
      versioned: true,
    });
    scriptsBucket.grantRead(backendHandler);

    const fromAddressOutput = fromAddress || "no SES from address";
    new CfnOutput(this, "sesFromAddress", {
      value: fromAddressOutput,
    });
    new CfnOutput(this, "webappDomainName", {
      value: webappDomainName || "no domain name specified",
    });
    new CfnOutput(this, "wwwDomainName", {
      value: wwwDomainName || "no www domain name",
    });
    new CfnOutput(this, "zoneId", {
      value: zoneId || "no zoneId specified",
    });
    new CfnOutput(this, "DistributionDomainName", {
      value: distro.distributionDomainName,
    });
    new CfnOutput(this, "lambdaApi_url", {
      value: lambdaApi.url,
    });
    new CfnOutput(this, "FrontendBucketName", {
      value: frontendBucket.bucketName,
    });
    new CfnOutput(this, "FrontendBucketNameParamName", {
      value: frontendBucketNameParam.parameterName,
    });
    new CfnOutput(this, "UserPoolId", {
      value: userPool.userPoolId,
    });
    new CfnOutput(this, "UserPoolClientId", {
      value: userPoolClient.userPoolClientId,
    });
    new CfnOutput(this, "ScriptsBucketName", {
      value: scriptsBucket.bucketName,
    });
    new CfnOutput(this, "TableName", { value: sedersTable.tableName });
    new CfnOutput(this, "WSAPIEndpoint", {
      value: webSocketApi.apiEndpoint,
    });
  }
}
