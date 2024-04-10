import {
  Prompter,
  SummarizeParams,
} from './index';

export const claudePrompter: Prompter = {  
  summarizePrompt(params: SummarizeParams): string {
    return `あなたは日英同時通訳の支援をするエージェントです。
現在進行中のイベントのスピーチの履歴が与えられます。履歴は下に行くほど新しいです。
直近のスピーチの内容を詳細に説明してください。

日本語で回答してください。

<スピーチの履歴>
${params.sentence}
</スピーチの履歴>

親切な挨拶や返答は不要です。


\n\nAssistant: 
`;
  },

};
