import {
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  Cors,
  RestApi,
  ResponseType,
} from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

export interface BackendApiProps {}

export class Api extends Construct {
  readonly api: RestApi;
  readonly modelIds: string[];
  readonly multiModalModelIds: string[];
  readonly imageGenerationModelIds: string[];

  modelRegion: string;
  
  constructor(scope: Construct, id: string, props: BackendApiProps) {
    super(scope, id);

    // Model IDs
    const modelIds: string[] = this.node.tryGetContext('modelIds') || [
      'anthropic.claude-3-sonnet-20240229-v1:0',
    ];
    const imageGenerationModelIds: string[] = this.node.tryGetContext(
      'imageGenerationModelIds'
    ) || ['stability.stable-diffusion-xl-v1'];

    const multiModalModelIds = [
      'anthropic.claude-3-sonnet-20240229-v1:0',
      'anthropic.claude-3-haiku-20240307-v1:0',
    ];

    const api = new RestApi(this, 'Api', {
      deployOptions: {
        stageName: 'api',
      },
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
      cloudWatchRole: true,
    });

    api.addGatewayResponse('Api4XX', {
      type: ResponseType.DEFAULT_4XX,
      responseHeaders: {
        'Access-Control-Allow-Origin': "'*'",
      },
    });

    api.addGatewayResponse('Api5XX', {
      type: ResponseType.DEFAULT_5XX,
      responseHeaders: {
        'Access-Control-Allow-Origin': "'*'",
      },
    });
  
    this.api = api;
    this.modelIds = modelIds;
    this.multiModalModelIds = multiModalModelIds;
    this.imageGenerationModelIds = imageGenerationModelIds;
    
  }
}
