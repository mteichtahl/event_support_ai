/* 
  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
  
  Licensed under the Apache License, Version 2.0 (the "License").
  You may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  
      http://www.apache.org/licenses/LICENSE-2.0
  
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
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
