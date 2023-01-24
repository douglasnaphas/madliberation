import { aws_route53 as route53 } from "aws-cdk-lib";
import { aws_certificatemanager as acm } from "aws-cdk-lib";
import { Construct } from "constructs";
import { MadLiberationWebappProps } from "./madliberation-webapp";

const hostedZone: (
  construct: Construct,
  props: MadLiberationWebappProps
) => route53.IHostedZone | undefined = (construct, props) => {
  const { domainName, zoneId } = props;
  if (!domainName || !zoneId) {
    return undefined;
  }
  const hz = route53.HostedZone.fromHostedZoneAttributes(
    construct,
    "HostedZone",
    { hostedZoneId: zoneId, zoneName: domainName + "." }
  );

  return hz;
};
