import { Construct } from "constructs";
import { aws_cognito as cognito, RemovalPolicy } from "aws-cdk-lib";
export class AppUserPool extends cognito.UserPool {
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