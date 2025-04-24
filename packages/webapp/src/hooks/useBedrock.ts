import { 
  BedrockRuntimeClient, 
  InvokeModelWithResponseStreamCommand,
  InvokeModelWithResponseStreamCommandOutput,
} from "@aws-sdk/client-bedrock-runtime";

import { fetchAuthSession } from 'aws-amplify/auth';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';


const region = import.meta.env.VITE_APP_REGION;
const cognito = new CognitoIdentityClient({ region });
const userPoolId = import.meta.env.VITE_APP_USER_POOL_ID;
const idPoolId = import.meta.env.VITE_APP_IDENTITY_POOL_ID;
const providerName = `cognito-idp.${region}.amazonaws.com/${userPoolId}`;


const getBedrockClient = async () => {
  // Get the authentication session using the v6 API
  const { tokens } = await fetchAuthSession();
  
  if (!tokens || !tokens.idToken) {
    throw new Error('User is not authenticated');
  }
  
  return new BedrockRuntimeClient({
    region,
    credentials: fromCognitoIdentityPool({
      client: cognito,
      identityPoolId: idPoolId,
      logins: {
        [providerName]: tokens.idToken.toString(),
      },
    }),
  });
}

const useBedrock = () => {
  const invokeBedrock = async (body: string) => {
    console.log(body);
    try {
      const bedrockClient = await getBedrockClient();
      const response: InvokeModelWithResponseStreamCommandOutput = await bedrockClient.send(
        new InvokeModelWithResponseStreamCommand({
          body: body,
          contentType: "application/json",
          modelId: "anthropic.claude-instant-v1"
        })
      );
  
      return response;
    } catch (e) {
      console.error('Bedrock API error:', e);
      throw e; // Re-throw to allow proper error handling
    }
  }

  return {
    invokeBedrock
  }
}

export default useBedrock;
