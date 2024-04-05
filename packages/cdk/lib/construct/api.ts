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
  
  constructor(scope: Construct, id: string, props: BackendApiProps) {
    super(scope, id);

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
  }
}
