import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CommonWebAcl } from './construct/commonWebAcl';

interface CloudFrontWafStackProps extends StackProps {
  allowedIpV4AddressRanges?: string[];
  allowedIpV6AddressRanges?: string[];
  allowedCountryCodes?: string[];
}

export class CloudFrontWafStack extends Stack {
  public readonly webAclArn: CfnOutput;
  public readonly webAcl: CommonWebAcl;

  constructor(scope: Construct, id: string, props: CloudFrontWafStackProps) {
    super(scope, id, props);

    const { allowedCountryCodes, allowedIpV4AddressRanges, allowedIpV6AddressRanges} = props;

    this.webAcl = new CommonWebAcl(this, `WebAcl${id}`, {
      scope: 'CLOUDFRONT',
      allowedIpV4AddressRanges: allowedIpV4AddressRanges,
      allowedIpV6AddressRanges: allowedIpV6AddressRanges,
      allowedCountryCodes: allowedCountryCodes,
    });

    this.webAclArn = new CfnOutput(this, 'WebAclId', {
      value: this.webAcl.webAclArn,
    });

  }
}
