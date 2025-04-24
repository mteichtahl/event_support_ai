import { Duration } from 'aws-cdk-lib';
import { UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { IdentityPool, UserPoolAuthenticationProvider } from '@aws-cdk/aws-cognito-identitypool-alpha';
import { Effect, Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export interface AuthProps {
  selfSignUpEnabled: boolean;
  allowedIpV4AddressRanges?: string[];
  allowedIpV6AddressRanges?: string[];
}

export class Auth extends Construct {
  readonly userPool: UserPool;
  readonly client: UserPoolClient;
  readonly idPool: IdentityPool;

  constructor(scope: Construct, id: string, props: AuthProps) {
    super(scope, id);

    const { selfSignUpEnabled, allowedIpV4AddressRanges, allowedIpV6AddressRanges } = props

    this.userPool = new UserPool(this, 'UserPool', {
      selfSignUpEnabled: selfSignUpEnabled,
      signInAliases: {
        username: false,
        email: true,
      },
      passwordPolicy: {
        requireUppercase: true,
        requireSymbols: true,
        requireDigits: true,
        minLength: 8,
        requireLowercase: true,
        passwordHistorySize: 5,
        tempPasswordValidity: Duration.days(1),
      },
    });

    this.client = this.userPool.addClient('client', {
      idTokenValidity: Duration.days(1),
    });

    this.idPool = new IdentityPool(this, 'IdentityPool', {
      authenticationProviders: {
        userPools: [
          new UserPoolAuthenticationProvider({
            userPool: this.userPool,
            userPoolClient: this.client,
          }),
        ],
      },
    });

    if (props.allowedIpV4AddressRanges || props.allowedIpV6AddressRanges) {
      const ipRanges = [
        ...(allowedIpV4AddressRanges || []),
        ...(allowedIpV6AddressRanges || []),
      ];

      this.idPool.authenticatedRole.attachInlinePolicy(
        new Policy(this, 'SourceIpPolicy', {
          statements: [
            new PolicyStatement({
              effect: Effect.DENY,
              resources: ['*'],
              actions: ['*'],
              conditions: {
                NotIpAddress: {
                  'aws:SourceIp': ipRanges,
                },
              },
            }),
          ],
        })
      );
    }

    // transcribe
    this.idPool.authenticatedRole.attachInlinePolicy(
      new Policy(this, 'GrantAccessTranscribeStream', {
        statements: [
          new PolicyStatement({
            actions: [
              'transcribe:StartStreamTranscriptionWebSocket',
              'translate:TranslateText'
            ],
            resources: ['*'],
          }),
        ],
      })
    );

    this.idPool.authenticatedRole.attachInlinePolicy(
      new Policy(this, 'GrantAccessBedrock', {
        statements: [
          new PolicyStatement({
            actions: [
              "bedrock:InvokeModel",
              "bedrock:InvokeModelWithResponseStream"
            ],
            resources: [
              "arn:aws:bedrock:*::foundation-model/*"
            ],
          }),
        ],
      })
    )
  }
}
