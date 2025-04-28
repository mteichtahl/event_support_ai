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
import { Prompter, SummarizeParams } from './index';

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
