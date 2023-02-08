import { Construct } from "constructs";
import { aws_s3 as s3, CfnOutput, RemovalPolicy } from "aws-cdk-lib";

const appBucket: (
  scope: Construct,
  id: string,
  props?: s3.BucketProps
) => s3.Bucket = (scope, id, props) => {
  const bucket = new s3.Bucket(scope, id, {
    removalPolicy: RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
    ...props,
  });
  new CfnOutput(scope, `${id}Name`, { value: bucket.bucketName });
  return bucket;
};
module.exports = appBucket;