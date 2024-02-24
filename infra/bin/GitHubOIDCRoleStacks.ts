import { App } from "aws-cdk-lib";
import * as iam from 'aws-cdk-lib/aws-iam';
import { GitHubOidcRoleStack } from "aws-github-oidc-role";
const stackname = require("@cdk-turnkey/stackname");
export const GitHubOidcRoleStacks = (app: App, repository: string) => {
  const policyStatements = [
    new iam.PolicyStatement(
      {
        effect: iam.Effect.ALLOW,
        actions: [
          "cloudformation:CreateChangeSet",
          "cloudformation:DeleteChangeSet",
          "cloudformation:DescribeChangeSet",
          "cloudformation:DescribeStackEvents",
          "cloudformation:DescribeStacks",
          "cloudformation:ExecuteChangeSet",
          "cloudformation:GetTemplate",
          "cognito-idp:AdminCreateUser",
          "cognito-idp:DescribeUserPool",
          "dynamodb:BatchWriteItem",
          "kms:Decrypt",
          "s3:GetAccelerateConfiguration",
          "s3:GetBucketAnalyticsConfiguration",
          "s3:GetBucketCors",
          "s3:GetBucketEncryption",
          "s3:GetBucketIntelligentTieringConfiguration",
          "s3:GetBucketInventoryConfiguration",
          "s3:GetBucketLifecycle",
          "s3:GetBucketLogging",
          "s3:GetBucketMetricsConfiguration",
          "s3:GetBucketNotification",
          "s3:GetBucketObjectLockConfiguration",
          "s3:GetBucketOwnershipControls",
          "s3:GetBucketPublicAccessBlock",
          "s3:GetBucketReplication",
          "s3:GetBucketTagging",
          "s3:GetBucketVersioning",
          "s3:GetBucketWebsite",
          "s3:GetObject",
          "s3:List*",
          "s3:PutBucketTagging",
          "s3:PutObject",
          "sns:GetSMSSandboxAccountStatus",
          "ssm:GetParameters",
          "ssm:PutParameter",
          "sts:AssumeRole",
          "sts:GetCallerIdentity",
        ],
        resources: ["*"]
      }
    )
  ];
  new GitHubOidcRoleStack(app, stackname("role-master"), {
    ref: "refs/heads/master",
    repository,
    managedPolicyList: [],
    policyStatements,
    roleName: `github-actions` +
      `@${repository.split("/").slice(-1)}` +
      `@master`
  });
  new GitHubOidcRoleStack(app, stackname("role-all-branches"), {
    ref: "*",
    repository,
    managedPolicyList: [],
    policyStatements,
    roleName: `github-actions` +
      `@${repository.split("/").slice(-1)}`
  });
}