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
import { useEffect, useRef, useState } from "react";
import { useLocation } from 'react-router-dom';

import { create } from 'zustand';
import {
  AppLayout,
  Button,
  Box,
  Container,
  Grid,
  Header,
  Select,
  SelectProps,
  SpaceBetween,
  SplitPanel,
  TextContent,
  BoxProps
} from '@cloudscape-design/components';
import {
  LanguageCode
} from "@aws-sdk/client-transcribe-streaming";
import useTranscribe from "../../hooks/useTranscribe";
import useTranslate from "../../hooks/useTranslate";
import { useDebounce } from "../../hooks/useDebounce";
import SummaryContainer from "../../components/summaryContainer";

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
  clear: () => void;
};

const languages: Language[] = [
  { label: 'English', translateCode: 'en', transcribeCode: 'en-US' },
  { label: 'Japanese', translateCode: 'ja', transcribeCode: 'ja-JP' },
  { label: 'Chinese (Siomplified)', translateCode: 'zh', transcribeCode: 'zh-CN' },
  { label: 'Korean', translateCode: 'ko', transcribeCode: 'ko-KR' },
  { label: 'French', translateCode: 'fr', transcribeCode: 'fr-FR' },
  { label: 'German', translateCode: 'de', transcribeCode: 'de-DE' },
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
        sourceLanguage: languages.find((language) => language.label === label) || INIT_STATE.sourceLanguage,
      }))
    },
    setDestLanguage: (label: string) => {
      set(() => ({
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

  const debounce = useDebounce(300);

  const [fontSize, setFontSize] = useState<SelectProps.Option>({ label: "body-s", value: "body-s" });

  const reversedTranscripts = [...transcripts].reverse()
  const reversedTranslated = [...translated].reverse()

  const {
    sourceLanguage,
    setSourceLanguage,
    destLanguage,
    setDestLanguage,
  } = useTranslatePageState();

  const handleChange = (_item: {isPartial: boolean, transcript: string}) => {
    debounce(() => {
      startTranslate(
        _item, 
        sourceLanguage.translateCode || 'ja',
        destLanguage.translateCode || 'en'
      )
    });
  };

  const transcriptsRef = useRef(transcripts); 
  useEffect(() => {
    const added = transcripts.filter(item => !transcriptsRef.current.includes(item));
    added.forEach((item) => {
      handleChange(item)
    });
    transcriptsRef.current = transcripts;
    
  }, [transcripts]);

  useEffect(() => {
    if (state !== null) {
      setDestLanguage(
        state.destLanguage.label || languages[0].label
    )}
  }, [state]);

  const onCliclClear = async () => {
    clearTranslate()
    clearTranscripts()
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

  return (
    <AppLayout
      maxContentWidth={Number.MAX_VALUE}
      toolsHide={true}
      navigationHide={true}
      content={
        <SpaceBetween size="s">
          <Container
            header={
              <Header 
              variant="h2" 
              actions={
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
              }
            >
                Language Selection
              </Header>
            }
          >
            <Grid
              gridDefinition={
                [
                  { colspan: 4 }, { colspan: 4 }, { colspan: 4 }
                ]
              }
            >
              <div>
                <TextContent>
                  <p>From</p>
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
                  <p>To</p>
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
                  <p>Font Size</p>
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
            </Grid>


          </Container>
          
          <Container
            header={
              <Header
                variant="h2"
              >
                Transcription
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
      }
      splitPanelOpen={true}
      splitPanel={
        <SplitPanel 
          header="Summarization"
          hidePreferencesButton={true}
        >
            <SpaceBetween size="s">
              <Container>
                <SummaryContainer 
                  transcripts={transcripts}
                  destLanguage={destLanguage}
                  fontSize={fontSize}
                  activeFlag={recording}
                />

              </Container>
            </SpaceBetween>
        </SplitPanel>
      }
    />
    
    
  );
}