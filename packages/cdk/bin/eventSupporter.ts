import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { EventSupporterStack } from '../lib/eventSupporterStack';
import { CloudFrontWafStack } from '../lib/cloudfrontWafStack';

const app = new cdk.App();

let cloudFrontWafStack: CloudFrontWafStack | undefined;

const allowedIpV4AddressRanges: string[] | undefined = app.node.tryGetContext('allowedIpV4AddressRanges');
const allowedIpV6AddressRanges: string[] | undefined = app.node.tryGetContext('allowedIpV6AddressRanges');
const allowedCountryCodes: string[] | undefined = app.node.tryGetContext('allowedCountryCodes');

if ( allowedIpV4AddressRanges?.length || allowedIpV6AddressRanges?.length || allowedCountryCodes?.length) {
  cloudFrontWafStack = new CloudFrontWafStack(app, 'CloudFrontWafStack', {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: 'us-east-1',
    },
    allowedIpV4AddressRanges,
    allowedIpV6AddressRanges,
    allowedCountryCodes,
  });
}

new EventSupporterStack(app, 'EventSupporterStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  webAclId: cloudFrontWafStack ? cloudFrontWafStack.webAclArn.value : undefined,
  allowedIpV4AddressRanges,
  allowedIpV6AddressRanges,
  allowedCountryCodes,
  crossRegionReferences: true,
});