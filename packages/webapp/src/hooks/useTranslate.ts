import {
  TranslateTextCommand,
  TranslateClient,
} from "@aws-sdk/client-translate"
import { useState, useLayoutEffect } from "react";
import update from "immutability-helper";
import { Auth } from 'aws-amplify';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';

const region = import.meta.env.VITE_APP_REGION;
const cognito = new CognitoIdentityClient({ region });
const userPoolId = import.meta.env.VITE_APP_USER_POOL_ID;
const idPoolId = import.meta.env.VITE_APP_IDENTITY_POOL_ID;
const providerName = `cognito-idp.${region}.amazonaws.com/${userPoolId}`;

interface item {
  isPartial: boolean;
  transcript: string;
}

const useTranslate = () => {
  const [translateClient, setTranslateClient] = useState<TranslateClient>();
  const [translated, setTranslated] = useState<
    {
      isPartial: boolean;
      translated: string;
    }[]
  >([]);

  useLayoutEffect(() => {
    if (translateClient) return
    Auth.currentSession().then(data => {
      const translate = new TranslateClient({
        region,
        credentials: fromCognitoIdentityPool({
          client: cognito,
          identityPoolId: idPoolId,
          logins: {
            [providerName]: data.getIdToken().getJwtToken(),
          },
        }),
      });
      setTranslateClient(translate)
    })
  }, [translateClient]);

  const startTranslate = async (item: item, SourceLanguageCode: string, TargetLanguageCode: string) => {
    const command = new TranslateTextCommand({
      SourceLanguageCode: SourceLanguageCode,
      TargetLanguageCode: TargetLanguageCode,
      Text: item.transcript
    });

    if (!translateClient) return
    const res = await translateClient.send(command)

    if (res) {
      setTranslated((prev) => {

        const index = prev.length - 1;
        if (prev.length === 0 || !prev[prev.length - 1].isPartial) {

          const translated: string = res.TranslatedText!
          // segment is complete
          const tmp = update(prev, {
            $push: [
              {
                isPartial: item.isPartial ?? false,
                translated: translated,
              },
            ],
          });
          return tmp;
        }else{
          const translated: string = res.TranslatedText!
          const tmp = update(prev, {
            $splice: [
              [
                index,
                1,
                {
                  isPartial: item.isPartial ?? false,
                  translated: translated,
                },
              ],
            ],
          });
          return tmp;
        }
      });
    }
  }

  const clearTranslate = () => {
    setTranslated([])
  }
  return {
    translated,
    startTranslate,
    clearTranslate,
  };
};

export default useTranslate