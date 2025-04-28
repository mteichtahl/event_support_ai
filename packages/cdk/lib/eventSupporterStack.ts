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
  allowedIpV4AddressRanges?: string[];
  allowedIpV6AddressRanges?: string[];
  allowedCountryCodes?: string[];
}

export class EventSupporterStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props: CustomStackProps) {
    super(scope, id, props);

    const { allowedCountryCodes, allowedIpV4AddressRanges, allowedIpV6AddressRanges, webAclId } = props;

    const selfSignUpEnabled = this.node.tryGetContext('selfSignUpEnabled');

    const auth = new Auth(this, 'Auth', {
      selfSignUpEnabled,
      allowedIpV4AddressRanges: allowedIpV4AddressRanges,
      allowedIpV6AddressRanges: allowedIpV6AddressRanges,
    });

    const api = new Api(this, 'API', {});

    if (allowedIpV4AddressRanges || allowedIpV6AddressRanges || allowedCountryCodes) {
      const regionalWaf = new CommonWebAcl(this, 'RegionalWaf', {
        scope: 'REGIONAL',
        allowedIpV4AddressRanges: allowedIpV4AddressRanges,
        allowedIpV6AddressRanges: allowedIpV6AddressRanges,
        allowedCountryCodes: allowedCountryCodes,
      });

      if (regionalWaf.webAclArn) {

        new CfnWebACLAssociation(this, 'ApiWafAssociation', {
          resourceArn: api.api.deploymentStage.stageArn,
          webAclArn: regionalWaf.webAclArn,
        });

        new CfnWebACLAssociation(this, 'UserPoolWafAssociation', {
          resourceArn: auth.userPool.userPoolArn,
          webAclArn: regionalWaf.webAclArn,
        });
      }
    }

    new Web(this, 'Api', {
      apiEndpointUrl: api.api.url,
      userPoolId: auth.userPool.userPoolId,
      userPoolClientId: auth.client.userPoolClientId,
      idPoolId: auth.idPool.identityPoolId,
      selfSignUpEnabled,
      webAclId: webAclId,
      modelRegion: api.modelRegion,
      modelId: api.modelId,
      multiModalModelIds: api.multiModalModelIds,
      imageGenerationModelIds: api.imageGenerationModelIds,
    });

    new CfnOutput(this, 'UserPoolId', { value: auth.userPool.userPoolId });
    new CfnOutput(this, 'UserPoolClientId', { value: auth.client.userPoolClientId });
    new CfnOutput(this, 'IdPoolId', { value: auth.idPool.identityPoolId });

  }
}
