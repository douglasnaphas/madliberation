# Mad Liberation

## This repo

This is the **issue tracking** repo for Mad Liberation, the application which is live at https://passover.lol. It also holds code related to an experimental effort to deploy Mad Liberation with the AWS [Cloud Development Kit](https://aws.amazon.com/cdk/).

Application code for the production instance of Mad Liberation is in other repos, mostly https://github.com/douglasnaphas/mljsapi and https://github.com/douglasnaphas/madliberationjs.

## Quickstart guide

This repo will deploy a web application, including all the AWS resources needed for it to be usable, if you do the following.

1. Do either or both, depending on whether you want to deploy from feature branches in this repo or the main branch in this repo, of the following pertaining to [AWS credentials](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html):
   1. Add a valid AWS access key ID and corresponding AWS secret access key in GitHub repository secrets as `DEV_AWS_ACCESS_KEY_ID` and `DEV_AWS_SECRET_ACCESS_KEY`, respectively. GitHub Actions will deploy to this account from feature branches in this repo.
   1. Add valid AWS access key IDs and the corresponding AWS secret access keys in GitHub repository secrets as `TEST_AWS_ACCESS_KEY_ID`, `PROD_AWS_ACCESS_KEY_ID`, `TEST_AWS_SECRET_ACCESS_KEY`, and `PROD_AWS_SECRET_ACCESS_KEY`.
1. Optional: Configure [SSM Params](#ssm-parameters) if you want to send user signup verification emails from a custom email address, like one at your own domain, or host the app at a custom domain name that you own in AWS Route53.

## How to run this app

Don't. This app uses serverless AWS managed services, and it is not worth the effort to mimic them locally. To make a change, fork this repo, add `DEV_AWS_ACCESS_KEY_ID` and `DEV_AWS_SECRET_ACCESS_KEY` to your GitHub repository secrets, run the `feature-branch` build, and it will deploy the app with your change to the account specified by the secrets.

## How to deploy inter-commit changes

Your development environment is a [CloudFormation stack](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-whatis-concepts.html#w2ab1b5c15b9) of real AWS resources in the AWS account that your feature branch build is deploying to from GitHub Actions. You get a different CloudFormation stack for each feature branch. You can't continuously deploy your local source code changes to your development environment, meaning you can't have your changes deployed whenever you save your source files.

But you can deploy changes from your local source code without committing and pushing and running the whole feature branch build.

### Suggested development workflow

1. Fork the repo.
2. Add`DEV_AWS_ACCESS_KEY_ID` and `DEV_AWS_SECRET_ACCESS_KEY` to your GitHub repository secrets.
3. Cut a feature branch locally.
4. Push it to your fork.
5. Run `npm install` and then build the project(s) you're changing and run their tests in a loop.
6. Make sure the tests are passing.
7. Make the tests fail by having them test for the change you want to make.
8. Commit your failing tests to your feature branch, and observe your feature branch build failing. This is so you know your tests will fail if your change doesn't work.
9. Fix the tests locally by implementing your change.
10. Deploy your local changes as detailed in this section.
11. Commit your changes to see if your build passes.
12. Repeat from Step 6 above until your change is done.
13. Make a pull request from your fork to the master branch on the main repo.

### Frontend

Similar to the _Deploy content (dev account)_ step in `.github/workflows/feature-branch.yml`, run:

```
AWS_PROFILE=my-profile-from-aws-credentials-file \
  GITHUB_REPOSITORY=your-github-username \
  GITHUB_REF=refs/heads/your-branch-name \
  bash deploy-frontend.sh
```

Make sure you've run:

```
npm install
npm run build
npm test
```

in the `frontend/` directory first.

### Content (the Haggadah scripts)

Similar to the _Deploy content (dev account)_ step in `.github/workflows/feature-branch.yml`, run:

```
cd content/ ;
AWS_PROFILE=my-profile-from-aws-credentials-file \
  GITHUB_REPOSITORY=your-github-username \
  GITHUB_REF=refs/heads/your-branch-name \
  bash deploy-frontend.sh
```

Make sure you've run:

```
npm install
npm test
```

in the `content/` directory first.

### Backend

Do the _Deploy the webapp stack to the test account_ step, but without the `bootstrap` part.

```
STACKNAME=$( \
  GITHUB_REPOSITORY=your-github-username \
  GITHUB_REF=refs/heads/your-branch-name \
  npx @cdk-turnkey/stackname@1.2.0 --suffix webapp ) ;
AWS_PROFILE=my-profile-from-aws-credentials-file \
  GITHUB_REPOSITORY=your-github-username \
  GITHUB_REF=refs/heads/your-branch-name \
  npx cdk deploy --require-approval never ${STACKNAME}
```

Make sure you've run:

```
npm install
npm run build
npm test
```

in the `backend/` directory first.

### itest (integration tests)

```
STACKNAME=$( \
  GITHUB_REPOSITORY=your-github-username \
  GITHUB_REF=refs/heads/your-branch-name \
  bash scripts/itest.sh
```

Make sure you've run:

```
npm install
npm test
```

in the `itest/` directory first.

## SSM Parameters

The app reads some configuration information from each account where it is deployed. It reads parameters from AWS Systems Manager (SSM) [Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html) at deploy time.

It figures out the names of parameters using [stackname](https://www.npmjs.com/package/@cdk-turnkey/stackname).

**These params are generally for pieces of information that cannot be determined on the fly, cannot be shared among deployments, and require some manual setup outside of the normal CDK deployment process.** For example, the domain name for the production app will eventually be communicated as an SSM param.

The parameters are as follows. They are all optional. The app will deploy with default behavior for any unset param. Default behavior is usually appropriate for dev and test environments. Production environments will generally want most or all params set. Params:

1. `stackname("fromAddress")`. The email address that Cognito and SES will use to verify new user self-signups. The from-email address itself should be [verified](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-email-addresses.html) with AWS.
2. `stackname("domainName")`. The DNS name where the app will be reachable. You should have the right to configure DNS for this name, in AWS Route53.
3. `stackname("zoneId")`. The Route53 hosted zone where a DNS record pointing to the app, and DNS records validating the TLS certificate, should be created.
