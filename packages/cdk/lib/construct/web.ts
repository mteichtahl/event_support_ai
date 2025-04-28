import { Stack, CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CloudFrontToS3 } from '@aws-solutions-constructs/aws-cloudfront-s3';
import { CfnDistribution, Distribution } from 'aws-cdk-lib/aws-cloudfront';
import { NodejsBuild } from 'deploy-time-build';
import * as s3 from 'aws-cdk-lib/aws-s3';

export interface WebProps {
  apiEndpointUrl: string;
  userPoolId: string;
  userPoolClientId: string;
  idPoolId: string;
  selfSignUpEnabled: boolean;
  webAclId?: string;
  modelRegion: string;
  modelId: string;
  multiModalModelIds: string[];
  imageGenerationModelIds: string[];
}

export class Web extends Construct {
  public readonly distribution: Distribution;

  constructor(scope: Construct, id: string, props: WebProps) {
    super(scope, id);
 
    const { webAclId } = props;

    const commonBucketProps: s3.BucketProps = {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
      objectOwnership: s3.ObjectOwnership.OBJECT_WRITER,
      enforceSSL: true,
    };

    const { cloudFrontWebDistribution, s3BucketInterface } = new CloudFrontToS3(
      this,
      'Web',
      {
        insertHttpSecurityHeaders: false,
        loggingBucketProps: commonBucketProps,
        bucketProps: commonBucketProps,
        cloudFrontLoggingBucketProps: commonBucketProps,
        cloudFrontDistributionProps: {
          errorResponses: [
            {
              httpStatus: 403,
              responseHttpStatus: 200,
              responsePagePath: '/index.html',
            },
            {
              httpStatus: 404,
              responseHttpStatus: 200,
              responsePagePath: '/index.html',
            },
          ],
        },
      }
    );

    if (webAclId) {
      const existingCloudFrontWebDistribution = cloudFrontWebDistribution.node.defaultChild as CfnDistribution;
      existingCloudFrontWebDistribution.addPropertyOverride('DistributionConfig.WebACLId',webAclId);
    }

    new NodejsBuild(this, 'BuildWeb', {
      assets: [
        {
          path: '../../',
          exclude: [
            '.git',
            '.github',
            '.gitignore',
            '.prettierignore',
            '.prettierrc.json',
            '*.md',
            'LICENSE',
            'docs',
            'imgs',
            'setup-env.sh',
            'node_modules',
            'prompt-templates',
            'packages/cdk/**/*',
            '!packages/cdk/cdk.json',
            'packages/web/dist',
            'packages/web/node_modules',
          ],
        },
      ],
      nodejsVersion: 20,
      destinationBucket: s3BucketInterface,
      distribution: cloudFrontWebDistribution,
      outputSourceDirectory: './packages/webapp/dist',
      buildCommands: ['npm ci', 'NODE_OPTIONS="--max-old-space-size=8192" npm run web:build'],

      buildEnvironment: {
        VITE_APP_API_ENDPOINT: props.apiEndpointUrl,
        VITE_APP_REGION: Stack.of(this).region,
        VITE_APP_USER_POOL_ID: props.userPoolId,
        VITE_APP_USER_POOL_CLIENT_ID: props.userPoolClientId,
        VITE_APP_IDENTITY_POOL_ID: props.idPoolId,
        VITE_APP_SELF_SIGN_UP_ENABLED: props.selfSignUpEnabled.toString(),
        VITE_APP_MODEL_REGION: props.modelRegion,
        VITE_APP_MODEL_ID: JSON.stringify(props.modelId),
        VITE_APP_MULTI_MODAL_MODEL_IDS: JSON.stringify(
          props.multiModalModelIds
        ),
      },
    });

    new CfnOutput(this, 'WebUrl', {
      value: `https://${cloudFrontWebDistribution.domainName}`,
    });

    this.distribution = cloudFrontWebDistribution;
  }

}
