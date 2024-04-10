import { 
  BedrockRuntimeClient, 
  // InvokeModelCommand,
  InvokeModelWithResponseStreamCommand,
  InvokeModelWithResponseStreamCommandOutput,
  // InvokeModelCommandOutput,
} from "@aws-sdk/client-bedrock-runtime";

import { useState, useLayoutEffect } from "react";
import { Auth } from 'aws-amplify';
// import useHttp from '../hooks/useHttp';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';


const region = import.meta.env.VITE_APP_REGION;
const cognito = new CognitoIdentityClient({ region });
const userPoolId = import.meta.env.VITE_APP_USER_POOL_ID;
const idPoolId = import.meta.env.VITE_APP_IDENTITY_POOL_ID;
const providerName = `cognito-idp.${region}.amazonaws.com/${userPoolId}`;


const useBedrock = () => {
  // const http = useHttp();
  const [bedrockClient, setBedrockClient] = useState<BedrockRuntimeClient>();

  useLayoutEffect(() => {
    // break if already set
    if (bedrockClient) return

    Auth.currentSession().then(data => {
      const client = new BedrockRuntimeClient({
        region,
        credentials: fromCognitoIdentityPool({
          client: cognito,
          identityPoolId: idPoolId,
          logins: {
            [providerName]: data.getIdToken().getJwtToken(),
          },
        }),
      });
      setBedrockClient(client)
    })

  }, [bedrockClient]);
  
  const invokeBedrock = async (body: string): Promise<InvokeModelWithResponseStreamCommandOutput> => {
    if (!bedrockClient) {
      throw new Error("bedrockClient is not initialized");
    }

    const response:InvokeModelWithResponseStreamCommandOutput = await bedrockClient.send(new InvokeModelWithResponseStreamCommand({
      body: body,
      contentType: "application/json",
      modelId: "anthropic.claude-instant-v1"
    }))

    return response
  }


  return {
    invokeBedrock
  }
}

export default useBedrock;