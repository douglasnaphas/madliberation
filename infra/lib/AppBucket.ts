import { Construct } from "constructs";
import { aws_s3 as s3, RemovalPolicy } from "aws-cdk-lib";
export class AppBucket extends s3.Bucket {
  constructor(scope: Construct, id: string, props: s3.BucketProps = {}) {
    super(scope, id, {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      ...props,
    });
  }
}
