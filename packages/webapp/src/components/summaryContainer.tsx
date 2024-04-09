import { useCallback, useEffect, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import {
  Box,
  Container,
  SpaceBetween,
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
}

const modelId = import.meta.env.VITE_APP_MODEL_ID;
const context = "あなたは日英同時通訳の支援をするエージェントです。現在進行中の会話の履歴を使用して、直近の会話について要約してください。日本語で回答してください。"

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
        context,
      })

      const payload = {
        max_tokens_to_sample: 1000,
        temperature: 0.5,
        top_k: 250,
        top_p: 1,
        stop_sequences: ["\n\nHuman:"],
        prompt: `\n\nHuman: ${prompt}\n\nAssistant:`,
      }

      const response = await invokeBedrock(JSON.stringify(payload))
      let completion = "";
      if (response.body) {
        const textDecoder = new TextDecoder("utf-8");
      
        for await (const stream of response.body) {
          const chunk = textDecoder.decode(stream.chunk?.bytes);
          completion = completion + JSON.parse(chunk)["completion"];
          console.log(completion)
          setSummarizedText(completion)
        }
      }
      }, 1000 * 60);
      return () => clearInterval(interval);
  }, []);
  
  return (
    <SpaceBetween size="s">
      <Container>
      <Box 
        variant="p"
      >
        {/* props.transcripts[*].transcriptの文字列を結合する */}
        {summarizedText}
      </Box>
        
      </Container>
    </SpaceBetween>
    
  );
}

export default SummaryContainer