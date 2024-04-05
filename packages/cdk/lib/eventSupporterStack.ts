import * as cdk from 'aws-cdk-lib';
import { StackProps, CfnOutput } from 'aws-cdk-lib'
import { Construct } from 'constructs';
import { Auth } from './construct/auth';
import { Api } from './construct/api';
import { Transcribe } from './construct/transcribe';
import * as cognito from 'aws-cdk-lib/aws-cognito';

interface CustomStackProps extends StackProps {
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
      allowedSignUpEmailDomains
    });

    const api = new Api(this, 'API', {});

    new Transcribe(this, 'Transcribe', {
      userPool: auth.userPool,
      idPool: auth.idPool,
      api: api.api,
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
