import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from 'react-router-dom';
import debounce from 'lodash.debounce';

import { create } from 'zustand';
import {
  Button,
  Box,
  Container,
  Grid,
  Header,
  Select,
  SelectProps,
  SpaceBetween,
  TextContent,
  BoxProps
} from '@cloudscape-design/components';
import {
  LanguageCode
} from "@aws-sdk/client-transcribe-streaming";
import useTranscribe from "../../hooks/useTranscribe";
import useTranslate from "../../hooks/useTranslate";

interface Language {
  label: string;
  translateCode?: string;
  transcribeCode?: LanguageCode;
}

type StateType = {
  sourceLanguage: Language;
  setSourceLanguage: (label: string) => void;
  destLanguage: Language;
  setDestLanguage: (label: string) => void;

  // summarizedSentence: string;
  // setSummarizedSentence: (s: string) => void;
  clear: () => void;
};

const languages: Language[] = [
  { label: '英語', translateCode: 'en', transcribeCode: 'en-US' },
  { label: '日本語', translateCode: 'ja', transcribeCode: 'ja-JP' },
  { label: '中国語', translateCode: 'zh', transcribeCode: 'zh-CN' },
  { label: '韓国語', translateCode: 'ko', transcribeCode: 'ko-KR' },
  { label: 'フランス語', translateCode: 'fr', transcribeCode: 'fr-FR' },
  { label: 'ドイツ語', translateCode: 'de', transcribeCode: 'de-DE' },
];

const fontSizes = [
  "body-s",
  "body-m",
  "heading-xs",
  "heading-s",
  "heading-m",
  "heading-l",
  "heading-xl",
  "display-l"
]

const useTranslatePageState = create<StateType>((set) => {
  const INIT_STATE = {
    sourceLanguage: languages[0],
    destLanguage: languages[1],

    // summarizedSentence: '',
  };
  return {
    ...INIT_STATE,
    setSourceLanguage: (label: string) => {
      set(() => ({
        // languagesからlabelに一致するものを探す
        sourceLanguage: languages.find((language) => language.label === label) || INIT_STATE.sourceLanguage,
      }))
    },
    setDestLanguage: (label: string) => {
      set(() => ({
        // languagesからlabelに一致するものを探す
        destLanguage: languages.find((language) => language.label === label) || INIT_STATE.destLanguage,
      }));
    },

    // setSummarizedSentence: (s: string) => {
    //   set(() => ({
    //     summarizedSentence: s,
    //   }));
    // },
    clear: () => {
      set(INIT_STATE);
    },
  };
});

export default function App() {
  const { state } = useLocation();
  const { 
    startTranscription,
    stopTranscription,
    transcripts,
    recording,
    clearTranscripts,
  } = useTranscribe();
  const {
    translated, 
    startTranslate, 
    clearTranslate
  } = useTranslate();

  const [fontSize, setFontSize] = useState<SelectProps.Option>({ label: "body-s", value: "body-s" });

  const reversedTranscripts = [...transcripts].reverse()
  const reversedTranslated = [...translated].reverse()

  const {
    sourceLanguage,
    setSourceLanguage,
    destLanguage,
    setDestLanguage,

    // summarizedSentence,
    // setSummarizedSentence,
    // clear
  } = useTranslatePageState();

  // const { pathname, search } = useLocation();

  // const {
  //   getModelId,
  //   setModelId,
  //   loading,
  //   messages,
  //   postChat,
  //   clear: clearChat,
  // } = useChat(pathname);
  // const { modelIds: availableModels } = MODELS;
  // const modelId = getModelId();
  // const prompter = useMemo(() => {
  //   return getPrompter(modelId);
  // }, [modelId]);
  

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onTranslateTextChange = useCallback(
    debounce(
      (
        _item: {isPartial: boolean, transcript: string},
        _sourceLanguage: string,
        _destLanguage: string,
      ) => {
        startTranslate(_item, _sourceLanguage || 'ja' , _destLanguage || 'en')
      }, 1000
    ),
    [startTranslate]
  )
  const transcriptsRef = useRef(transcripts); 
  useEffect(() => {
    // 要素が追加された時の処理
    const added = transcripts.filter(item => !transcriptsRef.current.includes(item));
    // 追加要素のみ出力
    added.forEach((item) => {
      onTranslateTextChange(item, sourceLanguage.translateCode || 'ja' ,destLanguage.translateCode || 'en')
    });
    transcriptsRef.current = transcripts;
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcripts]);

  useEffect(() => {
    if (state !== null) {
      setDestLanguage(
        state.destLanguage.label || languages[0].label
    )}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // useEffect(() => {
  //   const _modelId = !modelId ? availableModels[0] : modelId;
  //   if (search !== '') {
  //     const params = queryString.parse(search) as SummarizePageQueryParams;
  //     setModelId(
  //       availableModels.includes(params.modelId ?? '')
  //         ? params.modelId!
  //         : _modelId
  //     );
  //   } else {
  //     setModelId(_modelId);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [modelId, availableModels, search]);

  // const getSummary = (sentence: string, context: string) => {
  //   postChat(
  //     prompter.summarizePrompt({
  //       sentence,
  //       context,
  //     }),
  //     true
  //   );
  // };

  // useEffect(() => {
  //   if (messages.length === 0) return;
  //   const _lastMessage = messages[messages.length - 1];
  //   if (_lastMessage.role !== 'assistant') return;
  //   const _response = messages[messages.length - 1].content;
  //   setSummarizedSentence(_response.trim());
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [messages]);

  const onCliclClear = async () => {
    clearTranslate()
    clearTranscripts()
    // clearChat();
    // clear();
  }

  const _startTranscription = () => {
    startTranscription(sourceLanguage.transcribeCode || 'en-US')
  }

  const exportHistory = () => {
    const transcriptsText = transcripts.map(t => t.transcript).join('\n'); 
    const translatedText = translated.map(t => t.translated).join('\n'); 
    const blob = new Blob([transcriptsText,'\n\n', translatedText], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'history.txt'; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // const onClickSummarizeExec = useCallback(() => {
  //   if (loading) return;
  //   const sentence = transcripts.map(t => t.transcript).join('\n'); 
    
  //   getSummary(sentence, '');
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [transcripts, loading]);

  return (
    <SpaceBetween size="s">
      <Container
        header={
          <Header variant="h2" description="言語設定とか">
            操作パネル
          </Header>
        }
      >
        <Grid
          gridDefinition={
            [
              { colspan: 4 }, { colspan: 4 }, { colspan: 4 }, 
              { colspan: 12 }
            ]
          }
        >
          <div>
            <TextContent>
              <p>入力言語</p>
            </TextContent>
            <Select
              selectedOption={sourceLanguage}
              options={languages.map((language) => (
                { label: language.label, value: language.label }
              ))}
              onChange={(value) => setSourceLanguage(
                value.detail.selectedOption.label ?? ''
              )}
            />
          </div>
          
          <div>
            <TextContent>
              <p>出力言語</p>
            </TextContent>
            <Select
              selectedOption={destLanguage}
              options={languages.map((language) => (
                { label: language.label, value: language.label }
              ))}
              onChange={(value) => setDestLanguage(
                value.detail.selectedOption.label ?? ''
              )}
            />
          </div>

          <div>
            <TextContent>
              <p>フォントサイズ</p>
            </TextContent>
            <Select
              selectedOption={fontSize ?? null}
              options={fontSizes.map((fontSize) => (
                { label: fontSize, value: fontSize }
              ))}
              onChange={(value) => setFontSize(
                value.detail.selectedOption ?? null
              )}
            />
          </div>

          <Box
            float="right"
          >
            <SpaceBetween 
              direction="horizontal"
              alignItems="end"
              size="xs"
            >
              <Button
                onClick={recording ? stopTranscription : _startTranscription}
                variant={recording ? 'primary' : 'normal'}                
              >
                {recording ? 'Recording' : 'Start'}
              </Button>

              <Button 
                onClick={onCliclClear}
              >
                Clear
              </Button>

              <Button onClick={exportHistory}>
                Export
              </Button>

              {/* <Button onClick={onClickSummarizeExec}>
                 Summary
              </Button> */}
            </SpaceBetween>
          </Box>
          
        </Grid>


      </Container>
      
      <Container
        header={
          <Header
            variant="h2"
            description={sourceLanguage.label + 'から' + destLanguage.label + 'への翻訳'}
          >
            翻訳結果
          </Header>
        }
      >
        <Grid
          gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}
        >
          <div
            key="transcribe"
          >
            <SpaceBetween 
              alignItems="start"
              size="xs"
            >
              {reversedTranscripts.length === 0 && 
                <Container>
                  <Box 
                    variant="p"
                    fontSize={
                      fontSize?.value as BoxProps.FontSize 
                    }
                  >
                    Transcript text will be appear here
                  </Box>
                </Container>
              }
              {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
              {reversedTranscripts.map((t, i) => (
                <Container
                  key={i}
                >
                  <Box 
                    variant="p"
                    fontSize={
                      fontSize?.value as BoxProps.FontSize 
                    }
                  >
                    {t.transcript}
                  </Box>
                  
                </Container>
              ))}
            </SpaceBetween>
          </div>
          
          <div
            key="translate"
          >
            <SpaceBetween 
              alignItems="start"
              size="xs"
            >
              {reversedTranslated.length === 0 && 
                <Container>
                  <Box 
                    variant="p"
                    fontSize={
                      fontSize?.value as BoxProps.FontSize 
                    }
                    key={"reversedTranslated.length"}
                  >
                    Translated text will be appear here  
                  </Box>
                </Container>
              }

              {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
              {reversedTranslated.map((t, i) => (
                <Container
                  key={i}
                >
                  <Box 
                    variant="p"
                    fontSize={
                      fontSize?.value as BoxProps.FontSize 
                    } 
                  >
                    {t.translated}
                  </Box>
                </Container>
                
              ))}
            </SpaceBetween>
          </div>
        </Grid>
      </Container>
    </SpaceBetween>
    

  );
}