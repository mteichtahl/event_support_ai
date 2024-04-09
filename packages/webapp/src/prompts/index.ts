import { claudePrompter } from './claude';

export const getPrompter = (modelId: string) => {
  if (modelId.startsWith('anthropic.claude-')) {
    return claudePrompter;
  }
  return claudePrompter;
};

export type SummarizeParams = {
  sentence: string;
  context?: string;
};


export interface Prompter {
  systemContext(pathname: string): string;
  summarizePrompt(params: SummarizeParams): string;
}
