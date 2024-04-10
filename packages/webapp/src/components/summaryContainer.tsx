import { useEffect, useMemo, useState } from 'react';
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
}

const modelId = import.meta.env.VITE_APP_MODEL_ID;

const SummaryContainer: React.FC<Props> = (props) => {
  
  const { invokeBedrock } = useBedrock()
  const [summarizedText, setSummarizedText] = useState<string>();

  const prompter = useMemo(() => {
    return getPrompter(modelId);
  }, []);

  useEffect(() => {
    const interval = setInterval(async() => {
      // プロンプト生成
      const prompt = prompter.summarizePrompt({
        sentence: props.transcripts.map(({ transcript }) => transcript).join(''),
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
      if (!response) return () => clearInterval(interval)
      
      let completion = "";
      if (response.body) {
        const textDecoder = new TextDecoder("utf-8");
      
        for await (const stream of response.body) {
          const chunk = textDecoder.decode(stream.chunk?.bytes);
          completion = completion + JSON.parse(chunk)["completion"];
          setSummarizedText(completion)
        }
      }
      }, 1000 * 30);
      return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <SpaceBetween size="s">
      <Box 
        variant="p"
        fontSize={
          props.fontSize?.value as BoxProps.FontSize 
        }
      >
        {summarizedText ? summarizedText : "ここに要約結果を表示します"}
      </Box>
    </SpaceBetween>
    
  );
}

export default SummaryContainer