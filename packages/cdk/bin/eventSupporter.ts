#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { EventSupporterStack } from '../lib/eventSupporterStack';

const app = new cdk.App();

import { CloudFrontWafStack } from '../lib/cloudfrontWafStack';

let cloudFrontWafStack: CloudFrontWafStack | undefined;

const allowedIpV4AddressRanges: string[] | null = app.node.tryGetContext(
  'allowedIpV4AddressRanges'
)!;
const allowedIpV6AddressRanges: string[] | null = app.node.tryGetContext(
  'allowedIpV6AddressRanges'
)!;
const allowedCountryCodes: string[] | null = app.node.tryGetContext(
  'allowedCountryCodes'
)!;

// IP アドレス範囲(v4もしくはv6のいずれか)か地理的制限が定義されている場合のみ、CloudFrontWafStack をデプロイする
if (
  allowedIpV4AddressRanges ||
  allowedIpV6AddressRanges ||
  allowedCountryCodes
) {
  // WAF v2 は us-east-1 でのみデプロイ可能なため、Stack を分けている
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

const eventSupporterStack = new EventSupporterStack(app, 'EventSupporterStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  webAclId: cloudFrontWafStack
      ? cloudFrontWafStack.webAclArn.value
      : undefined,
  allowedIpV4AddressRanges,
  allowedIpV6AddressRanges,
  allowedCountryCodes,
  crossRegionReferences: true,
});