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
import { aws_cloudfront as cloudfront } from "aws-cdk-lib";
import { aws_cloudfront_origins as origins } from "aws-cdk-lib";
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
import { WebSocketApi, WebSocketStage } from "aws-cdk-lib/aws-apigatewayv2";
import { WebSocketLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
const appBucket = require("./appBucket");
import { AppUserPool } from "./AppUserPool";
const addBackendBehavior = require("./addBackendBehavior");
const configureSocialIDPs = require("./configureSocialIDPs");

export interface MadLiberationWebappProps extends StackProps {
  fromAddress?: string;
  domainName?: string;
  zoneId?: string;
  facebookAppId?: string;
  facebookAppSecret?: { name: string, SecureString: boolean };
  amazonClientId?: string;
  amazonClientSecret?: { name: string, SecureString: boolean };
  googleClientId?: string;
  googleClientSecret?: { name: string, SecureString: boolean };
}

export class MadliberationWebapp extends Stack {
  constructor(scope: App, id: string, props: MadLiberationWebappProps = {}) {
    super(scope, id, props);

    const { fromAddress, domainName, zoneId } = props;

    const sedersTable = require("./sedersTable")(this);
    const frontendBucket = appBucket(this, "FrontendBucket");
    const frontendCreateHaggadahBucket = appBucket(
      this,
      "FrontendCreateHaggadahBucket"
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
      enableLogging: true,
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

    distro.addBehavior(
      "/create-haggadah/*",
      new origins.S3Origin(frontendCreateHaggadahBucket),
      {
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
      }
    );

    const userPool = new AppUserPool(this, "UserPool", {
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

    configureSocialIDPs(this, props, userPool);

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
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("../backend"),
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

    const backendV2Handler = new lambda.Function(this, "BackendV2Handler", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("../backend-v2"),
      memorySize: 3000,
      environment: {
        NODE_ENV: "production",
        TABLE_NAME: sedersTable.tableName,
        REGION: this.region,
      },
      timeout: Duration.seconds(20),
    });

    sedersTable.grantReadWriteData(backendHandler);
    sedersTable.grantReadWriteData(backendV2Handler);

    backendHandler.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["cognito-idp:DescribeUserPoolClient"],
        resources: [
          `arn:aws:cognito-idp:${userPool.stack.region}:${userPool.stack.account}:userpool/${userPool.userPoolId}`,
        ],
      })
    );

    const backendApi = new apigw.LambdaRestApi(this, "Endpoint", {
      handler: backendHandler,
    });
    const backendV2Api = new apigw.LambdaRestApi(this, "EndpointV2", {
      handler: backendV2Handler,
    });
    addBackendBehavior({
      distro,
      pathPattern: "/prod/*",
      api: backendApi,
      stack: this,
      backendId: "Backend",
    });
    addBackendBehavior({
      distro,
      pathPattern: "/v2/*",
      originPath: "/prod",
      api: backendV2Api,
      stack: this,
      backendId: "BackendV2",
    });

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
      new lambda.Function(this, `${prefix.replace(/-/g, "")}Handler`, {
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: `${prefix.toLowerCase()}.handler`,
        code: lambda.Code.fromAsset("../backend"),
        memorySize: 3000,
        environment: {
          NODE_ENV: "production",
          TABLE_NAME: sedersTable.tableName,
        },
        timeout: Duration.seconds(20),
      });
    const connectRosterHandler = makeHandler("Connect-Roster");
    const connectWaitHandler = makeHandler("Connect-Wait");
    const connectReadRosterHandler = makeHandler("Connect-Read-Roster");
    const disconnectHandler = makeHandler("Disconnect");
    const defaultHandler = makeHandler("Default");
    const joinHandler = makeHandler("Join");
    const assignHandler = makeHandler("Assign");
    const submitHandler = makeHandler("Submit");
    [
      connectRosterHandler,
      connectWaitHandler,
      connectReadRosterHandler,
      disconnectHandler,
      defaultHandler,
    ].forEach((handler) => {
      sedersTable.grantReadWriteData(handler);
    });
    const wsRosterApi = new WebSocketApi(this, "WSRosterAPI", {
      connectRouteOptions: {
        integration: new WebSocketLambdaIntegration(
          "ConnectIntegration",
          connectRosterHandler
        ),
      },
      disconnectRouteOptions: {
        integration: new WebSocketLambdaIntegration(
          "DisconnectIntegration",
          disconnectHandler
        ),
      },
      defaultRouteOptions: {
        integration: new WebSocketLambdaIntegration(
          "DefaultIntegration",
          defaultHandler
        ),
      },
    });
    const wsRosterStageName = "ws-roster";
    const wsRosterStage = new WebSocketStage(this, "WSRosterStage", {
      stageName: wsRosterStageName,
      webSocketApi: wsRosterApi,
      autoDeploy: true,
    });
    const wsWaitApi = new WebSocketApi(this, "WSWaitAPI", {
      connectRouteOptions: {
        integration: new WebSocketLambdaIntegration(
          "ConnectWaitIntegration",
          connectWaitHandler
        ),
      },
      disconnectRouteOptions: {
        integration: new WebSocketLambdaIntegration(
          "DisconnectIntegration",
          disconnectHandler
        ),
      },
      defaultRouteOptions: {
        integration: new WebSocketLambdaIntegration(
          "DefaultIntegration",
          defaultHandler
        ),
      },
    });
    const wsWaitStageName = "ws-wait";
    const wsWaitStage = new WebSocketStage(this, "WSWaitStage", {
      stageName: wsWaitStageName,
      webSocketApi: wsWaitApi,
      autoDeploy: true,
    });
    const wsReadRosterApi = new WebSocketApi(this, "WSReadRosterAPI", {
      connectRouteOptions: {
        integration: new WebSocketLambdaIntegration(
          "ConnectRRIntegration",
          connectReadRosterHandler
        ),
      },
      disconnectRouteOptions: {
        integration: new WebSocketLambdaIntegration(
          "DisconnectRRIntegration",
          disconnectHandler
        ),
      },
      defaultRouteOptions: {
        integration: new WebSocketLambdaIntegration(
          "DefaultRRIntegration",
          defaultHandler
        ),
      },
    });
    const wsReadRosterStageName = "ws-read-roster";
    const wsReadRosterStage = new WebSocketStage(
      this,
      "WSReadRosterStage",
      {
        stageName: wsReadRosterStageName,
        webSocketApi: wsReadRosterApi,
        autoDeploy: true,
      }
    );

    // for all WebSocket behaviors
    const wsOrp = new cloudfront.OriginRequestPolicy(
      this,
      "WSOriginRequestPolicy",
      {
        headerBehavior: cloudfront.OriginRequestHeaderBehavior.allowList(
          "Sec-WebSocket-Extensions",
          "Sec-WebSocket-Key",
          "Sec-WebSocket-Version"
        ),
        cookieBehavior: cloudfront.OriginRequestCookieBehavior.all(),
        queryStringBehavior: cloudfront.OriginRequestQueryStringBehavior.all(),
      }
    );
    distro.addBehavior(
      `/${wsRosterStageName}/*`,
      new origins.HttpOrigin(
        `${wsRosterApi.apiId}.execute-api.${this.region}.${this.urlSuffix}`,
        {
          protocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
        }
      ),
      {
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        originRequestPolicy: wsOrp,
      }
    );
    distro.addBehavior(
      `/${wsWaitStageName}/*`,
      new origins.HttpOrigin(
        `${wsWaitApi.apiId}.execute-api.${this.region}.${this.urlSuffix}`,
        {
          protocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
        }
      ),
      {
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        originRequestPolicy: wsOrp,
      }
    );
    distro.addBehavior(
      `/${wsReadRosterStageName}/*`,
      new origins.HttpOrigin(
        `${wsReadRosterApi.apiId}.execute-api.${this.region}.${this.urlSuffix}`,
        {
          protocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
        }
      ),
      {
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        originRequestPolicy: wsOrp,
      }
    );

    const deadLetterQueue = new sqs.Queue(this, "deadLetterQueue");

    const wsRosterHostname =
      wsRosterApi.apiId + ".execute-api." + this.region + "." + this.urlSuffix;
    const wsWaitHostname =
      wsWaitApi.apiId + ".execute-api." + this.region + "." + this.urlSuffix;
    const wsReadRosterHostname =
      wsReadRosterApi.apiId +
      ".execute-api." +
      this.region +
      "." +
      this.urlSuffix;
    joinHandler.addEnvironment(
      "WS_ENDPOINT",
      `${wsRosterHostname}/${wsRosterStage.stageName}`
    );
    assignHandler.addEnvironment(
      "WS_ENDPOINT",
      `${wsWaitHostname}/${wsWaitStage.stageName}`
    );
    submitHandler.addEnvironment(
      "WS_ENDPOINT",
      `${wsReadRosterHostname}/${wsReadRosterStage.stageName}`
    );

    const joinMapping = new lambda.EventSourceMapping(this, "JoinMapping", {
      target: joinHandler,
      eventSourceArn: sedersTable.tableStreamArn,
      startingPosition: lambda.StartingPosition.TRIM_HORIZON,
      bisectBatchOnError: true,
      onFailure: new SqsDlq(deadLetterQueue),
      retryAttempts: 5,
    });
    const cfnJoinMapping = joinMapping.node
      .defaultChild as lambda.CfnEventSourceMapping;
    cfnJoinMapping.addPropertyOverride("FilterCriteria", {
      Filters: [
        {
          Pattern: JSON.stringify({
            eventName: ["INSERT"],
            dynamodb: {
              NewImage: {
                game_name: { S: [{ exists: true }] },
                lib_id: { S: [{ prefix: "participant#" }] },
              },
            },
          }),
        },
      ],
    });

    const assignMapping = new lambda.EventSourceMapping(this, "AssignMapping", {
      target: assignHandler,
      eventSourceArn: sedersTable.tableStreamArn,
      startingPosition: lambda.StartingPosition.TRIM_HORIZON,
      bisectBatchOnError: true,
      onFailure: new SqsDlq(deadLetterQueue),
      retryAttempts: 5,
    });
    const cfnAssignMapping = assignMapping.node
      .defaultChild as lambda.CfnEventSourceMapping;
    cfnAssignMapping.addPropertyOverride("FilterCriteria", {
      Filters: [
        {
          Pattern: JSON.stringify({
            eventName: ["MODIFY"],
            dynamodb: {
              NewImage: {
                game_name: { S: [{ exists: true }] },
                lib_id: { S: [{ prefix: "participant#" }] },
              },
              OldImage: {
                assignments: {
                  L: [{ exists: false }],
                },
              },
            },
          }),
        },
      ],
    });

    const submitMapping = new lambda.EventSourceMapping(this, "SubmitMapping", {
      target: submitHandler,
      eventSourceArn: sedersTable.tableStreamArn,
      startingPosition: lambda.StartingPosition.TRIM_HORIZON,
      bisectBatchOnError: true,
      onFailure: new SqsDlq(deadLetterQueue),
      retryAttempts: 5,
    });
    const cfnSubmitMapping = submitMapping.node
      .defaultChild as lambda.CfnEventSourceMapping;
    cfnSubmitMapping.addPropertyOverride("FilterCriteria", {
      Filters: [
        {
          Pattern: JSON.stringify({
            eventName: ["MODIFY"],
            dynamodb: {
              NewImage: {
                game_name: { S: [{ exists: true }] },
                lib_id: { S: [{ prefix: "participant#" }] },
              },
              OldImage: {
                answers: { L: [{ exists: false }] },
              },
            },
          }),
        },
      ],
    });

    [joinHandler, assignHandler, submitHandler].forEach((handler) => {
      sedersTable.grantStreamRead(handler);
      sedersTable.grantReadData(handler);
    });
    wsRosterStage.grantManagementApiAccess(joinHandler);
    wsWaitStage.grantManagementApiAccess(assignHandler);
    wsReadRosterStage.grantManagementApiAccess(submitHandler);

    const scriptsBucket = appBucket(this, "ScriptsBucket", {
      versioned: true,
    });
    scriptsBucket.grantRead(backendHandler);
    scriptsBucket.grantRead(backendV2Handler);

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
      value: backendApi.url,
    });
    new CfnOutput(this, "UserPoolId", {
      value: userPool.userPoolId,
    });
    new CfnOutput(this, "UserPoolClientId", {
      value: userPoolClient.userPoolClientId,
    });
    new CfnOutput(this, "TableName", { value: sedersTable.tableName });
    new CfnOutput(this, "WSRosterEndpoint", {
      value: wsRosterApi.apiEndpoint,
    });
    new CfnOutput(this, "WSHostname", { value: wsRosterHostname });
  }
}
