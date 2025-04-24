import { CfnIPSet, CfnWebACL, CfnWebACLProps } from 'aws-cdk-lib/aws-wafv2';
import { Construct } from 'constructs';

export interface CommonWebAclProps {
  scope: 'REGIONAL' | 'CLOUDFRONT';
  allowedIpV4AddressRanges: string[];
  allowedIpV6AddressRanges: string[];
  allowedCountryCodes: string[];
}

export class CommonWebAcl extends Construct {
  public readonly webAclArn: string;

  constructor(scope: Construct, id: string, props: CommonWebAclProps) {
    super(scope, id);

    const { allowedCountryCodes, allowedIpV4AddressRanges, allowedIpV6AddressRanges, scope:_scope} = props;

    const rules: CfnWebACLProps['rules'] = [];

    const generateIpSetRule = (
      priority: number,
      name: string,
      ipSetArn: string
    ) => ({
      priority,
      name,
      action: { allow: {} },
      visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudWatchMetricsEnabled: true,
        metricName: name,
      },
      statement: {
        ipSetReferenceStatement: {
          arn: ipSetArn,
        },
      },
    });

    if (allowedIpV4AddressRanges) {
      const wafIPv4Set = new CfnIPSet(this, `IPv4Set${id}`, {
        ipAddressVersion: 'IPV4',
        scope: _scope,
        addresses: allowedIpV4AddressRanges,
      });
      rules.push(generateIpSetRule(1, `IpV4SetRule${id}`, wafIPv4Set.attrArn));
    }

    if (allowedIpV6AddressRanges) {
      const wafIPv6Set = new CfnIPSet(this, `IPv6Set${id}`, {
        ipAddressVersion: 'IPV6',
        scope: _scope,
        addresses: allowedIpV6AddressRanges,
      });
      rules.push(generateIpSetRule(2, `IpV6SetRule${id}`, wafIPv6Set.attrArn));
    }

    if (allowedCountryCodes?.length >= 1) {
      rules.push({
        priority: 3,
        name: `GeoMatchSetRule${id}`,
        action: { allow: {} },
        visibilityConfig: {
          cloudWatchMetricsEnabled: true,
          metricName: 'FrontendWebAcl',
          sampledRequestsEnabled: true,
        },
        statement: {
          geoMatchStatement: {
            countryCodes: allowedCountryCodes,
          },
        },
      });
    }

    this.webAclArn = new CfnWebACL(this, `WebAcl${id}`, {
      defaultAction: { block: {} },
      name: `WebAcl${id}`,
      scope: _scope,
      visibilityConfig: {
        cloudWatchMetricsEnabled: true,
        sampledRequestsEnabled: true,
        metricName: `WebAcl${id}`,
      },
      rules: rules,
    }).attrArn
  }
}
