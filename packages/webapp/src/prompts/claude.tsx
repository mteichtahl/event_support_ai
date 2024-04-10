import {
  Prompter,
  SummarizeParams,
} from './index';

export const claudePrompter: Prompter = {  
  summarizePrompt(params: SummarizeParams): string {
    return `あなたは日英同時通訳の支援をするエージェントです。
現在進行中のイベントのスピーチの履歴が与えられます。
フィラーワードを取り除いてください。文字起こしに誤りがあります。これまでの会話から推測して修正してください。
その後、イベントに途中参加する人に対して、これまでのスピーチについて詳細に説明してください。

日本語で回答してください。

<スピーチの履歴>
${params.sentence}
</スピーチの履歴>

文章だけを出力してください。それ以外の文章は一切出力しないでください。
親切な挨拶や返答は不要です。


Assistant: 
`;
  },

};
