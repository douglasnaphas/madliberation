# Mad Liberation

## This repo

This is the **issue tracking** repo for Mad Liberation, the application which is live at https://passover.lol. It also holds code related to an experimental effort to deploy Mad Liberation with the AWS [Cloud Development Kit](https://aws.amazon.com/cdk/).

Application code for the production instance of Mad Liberation is in other repos, mostly https://github.com/douglasnaphas/mljsapi and https://github.com/douglasnaphas/madliberationjs.

## How to run this app

Don't. This app uses serverless AWS managed services, and it is not worth the effort to mimic them locally. To make a change, fork this repo, add the `DEV_AWS_*` variables to your GitHub repository secrets, run the `feature-branch` build, and it will deploy the app with your change to the account specified by the secrets.

## How to deploy inter-commit changes

## SSM Parameters

The app reads some configuration information from each account where it is deployed. It reads parameters from AWS Systems Manager (SSM) [Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html) at deploy time.

It figures out the names of parameters using [stackname](https://www.npmjs.com/package/@cdk-turnkey/stackname).

**These params are generally for pieces of information that cannot be determined on the fly, cannot be shared among deployments, and require some manual setup outside of the normal CDK deployment process.** For example, the domain name for the production app will eventually be communicated as an SSM param.

The parameters are as follows. They are all optional. The app will deploy with default behavior for any unset param. Default behavior is usually appropriate for dev and test environments. Production environments will generally want most or all params set. Params:

1. `stackname("sesEmailVerificationFromAddress")`. The email address that Cognito and SES will use to verify new user self-signups. The from-email address itself should be [verified](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-email-addresses.html) with AWS.
2. `stackname("sesEmailVerificationFromRegion")`. The region of the `sesEmailVerificationFromAddress`. It is [limited to](https://github.com/aws/aws-cdk/issues/6768#issuecomment-652937588) `us-east-1`, `us-west-2`, or `eu-west-1`.
