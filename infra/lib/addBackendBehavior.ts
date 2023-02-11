import { Construct } from "constructs";
import { Stack } from "aws-cdk-lib";
import { aws_apigateway as apigw } from "aws-cdk-lib";
import { aws_cloudfront as cloudfront } from "aws-cdk-lib";
import { aws_cloudfront_origins as origins } from "aws-cdk-lib";

const apiUrl = (api: apigw.LambdaRestApi, stack: Stack) =>
  api.restApiId + ".execute-api." + stack.region + "." + stack.urlSuffix;
const addBackendBehavior: (props: {
  distro: cloudfront.Distribution;
  pathPattern: string;
  api: apigw.LambdaRestApi;
  stack: Stack;
  backendId: string;
}) => void = ({ distro, pathPattern, api, stack, backendId }) => {
  distro.addBehavior(
    pathPattern,
    new origins.HttpOrigin(apiUrl(api, stack), {
      protocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
    }),
    {
      allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
      originRequestPolicy: new cloudfront.OriginRequestPolicy(
        stack,
        `${backendId}ORP`,
        {
          cookieBehavior: cloudfront.OriginRequestCookieBehavior.all(),
          queryStringBehavior:
            cloudfront.OriginRequestQueryStringBehavior.all(),
        }
      ),
    }
  );
};
module.exports = addBackendBehavior;
