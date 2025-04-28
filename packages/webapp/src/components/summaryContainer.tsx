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
import { useEffect, useMemo, useState, useRef } from 'react';
import {
  Box,
  BoxProps,
  SpaceBetween,
  SelectProps,
} from '@cloudscape-design/components';
import {
  LanguageCode
} from "@aws-sdk/client-transcribe-streaming";

import useBedrock from  '../hooks/useBedrock';
import { getPrompter } from '../prompts';


type transcript = {
  isPartial: boolean;
  transcript: string;
}

type destLanguage = {
  label: string;
  translateCode?: string;
  transcribeCode?: LanguageCode;
}

interface Props{
  transcripts: transcript[]
  destLanguage: destLanguage
  fontSize: SelectProps.Option
  activeFlag: boolean
}

const modelId = import.meta.env.VITE_APP_MODEL_ID;

const SummaryContainer: React.FC<Props> = (props) => {
  
  const { invokeBedrock } = useBedrock()
  const [summarizedText, setSummarizedText] = useState<string>();
  
  // props.transcripts 要素に入力された値を ref で持ち直す
  const inputVal = useRef("");
  const activeFlag = useRef(true);

  const prompter = useMemo(() => {
    return getPrompter(modelId);
  }, []);

  useEffect(() => {
    // props.transcriptsの値を逐次更新してuseRefに入れる
    inputVal.current = props.transcripts.map(({ transcript }) => transcript).join('')
  }, [props.transcripts])


  useEffect(() => {
    // props.activeFlagの値を逐次更新してuseRefに入れる
    activeFlag.current = props.activeFlag
  }, [props.activeFlag])

  useEffect(() => {
    const interval = setInterval(async() => {
      if (!activeFlag.current){
        return
      }

      // プロンプト生成
      const prompt = prompter.summarizePrompt({
        sentence: inputVal.current,
      })

      const payload = {
        max_tokens_to_sample: 2000,
        temperature: 0.999,
        top_k: 250,
        top_p: 1,
        stop_sequences: ["\n\nHuman:"],
        prompt: `\n\nHuman: ${prompt}`,
      }

      const response = await invokeBedrock(JSON.stringify(payload))
      if (!response){
        console.error("response is null")
        return
      }
      
      let completion = "";
      if (response.body) {
        const textDecoder = new TextDecoder("utf-8");
      
        for await (const stream of response.body) {
          const chunk = textDecoder.decode(stream.chunk?.bytes);
          completion = completion + JSON.parse(chunk)["completion"];
          // console.log(completion)
          setSummarizedText(completion)
        }
      }
      }, 1000 * 60);
      return () => clearInterval(interval);
   
  }, []);
  
  return (
    <SpaceBetween size="s">
      <Box 
        variant="p"
        fontSize={
          props.fontSize?.value as BoxProps.FontSize 
        }
      >
        {summarizedText ? summarizedText : "Summary"}
      </Box>
    </SpaceBetween>
    
  );
}

export default SummaryContainer