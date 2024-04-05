#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { EventSupporterStack } from '../lib/eventSupporterStack';

const app = new cdk.App();
const eventSupporterStack = new EventSupporterStack(app, 'EventSupporterStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});