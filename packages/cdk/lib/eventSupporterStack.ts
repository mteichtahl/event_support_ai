import * as cdk from 'aws-cdk-lib';
import { StackProps, CfnOutput } from 'aws-cdk-lib'
import { Construct } from 'constructs';
import { Auth } from './construct/auth';
import { Api } from './construct/api';
import { CommonWebAcl } from './construct/commonWebAcl';
import { Web } from './construct/web';

import * as cognito from 'aws-cdk-lib/aws-cognito';
import { CfnWebACLAssociation } from 'aws-cdk-lib/aws-wafv2';

interface CustomStackProps extends StackProps {
  webAclId?: string;
  allowedIpV4AddressRanges: string[] | null;
  allowedIpV6AddressRanges: string[] | null;
  allowedCountryCodes: string[] | null;
}

export class EventSupporterStack extends cdk.Stack {
  public readonly userPool: cognito.UserPool;
  public readonly userPoolClient: cognito.UserPoolClient;

  constructor(scope: Construct, id: string, props: CustomStackProps) {
    super(scope, id, props);

    const selfSignUpEnabled: boolean =
      this.node.tryGetContext('selfSignUpEnabled')!;
    const allowedSignUpEmailDomains: string[] | null | undefined =
      this.node.tryGetContext('allowedSignUpEmailDomains');

    const auth = new Auth(this, 'Auth', {
      selfSignUpEnabled,
      allowedIpV4AddressRanges: props.allowedIpV4AddressRanges,
      allowedIpV6AddressRanges: props.allowedIpV6AddressRanges,
      allowedSignUpEmailDomains
    });

    const api = new Api(this, 'API', {});

    if (
      props.allowedIpV4AddressRanges ||
      props.allowedIpV6AddressRanges ||
      props.allowedCountryCodes
    ) {
      const regionalWaf = new CommonWebAcl(this, 'RegionalWaf', {
        scope: 'REGIONAL',
        allowedIpV4AddressRanges: props.allowedIpV4AddressRanges,
        allowedIpV6AddressRanges: props.allowedIpV6AddressRanges,
        allowedCountryCodes: props.allowedCountryCodes,
      });
      new CfnWebACLAssociation(this, 'ApiWafAssociation', {
        resourceArn: api.api.deploymentStage.stageArn,
        webAclArn: regionalWaf.webAclArn,
      });
      new CfnWebACLAssociation(this, 'UserPoolWafAssociation', {
        resourceArn: auth.userPool.userPoolArn,
        webAclArn: regionalWaf.webAclArn,
      });
    }

    const web = new Web(this, 'Api', {
      apiEndpointUrl: api.api.url,
      userPoolId: auth.userPool.userPoolId,
      userPoolClientId: auth.client.userPoolClientId,
      idPoolId: auth.idPool.identityPoolId,
      selfSignUpEnabled,
      webAclId: props.webAclId,
      modelRegion: api.modelRegion,
      modelId: api.modelId,
      multiModalModelIds: api.multiModalModelIds,
      imageGenerationModelIds: api.imageGenerationModelIds,
    });

    new CfnOutput(this, 'UserPoolId', { value: auth.userPool.userPoolId });
    new CfnOutput(this, 'UserPoolClientId', {
      value: auth.client.userPoolClientId,
    });
    new CfnOutput(this, 'IdPoolId', { value: auth.idPool.identityPoolId });


    this.userPool = auth.userPool;
    this.userPoolClient = auth.client;
  }
}
