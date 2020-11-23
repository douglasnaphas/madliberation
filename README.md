This is the **issue tracking** repo for Mad Liberation, the application which is live at https://passover.lol. It also holds code related to an experimental effort to deploy Mad Liberation with the AWS [Cloud Development Kit](https://aws.amazon.com/cdk/).

Application code for the production instance of Mad Liberation is in other repos, mostly https://github.com/douglasnaphas/mljsapi and https://github.com/douglasnaphas/madliberationjs.

The project demonstrates a CDK app with an instance of a stack (`MadliberationStack`)
which contains an Amazon SQS queue that is subscribed to an Amazon SNS topic.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
