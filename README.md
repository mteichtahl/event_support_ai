# イベント開催を支援するAIツール集


## リアルタイム翻訳

- 日本語から英語、英語から日本語など、設定した言語でニアリアルタイムに翻訳をします。
Amazon Transcribeを使用して音声を文字起こしし、Amazon Translateで逐次翻訳をします。
`VB-CABLE Virtual Audio Device` などを使用することにより、パソコンの音声出力をブラウザの音声入力に渡すことができれば、Youtube等の音声に対して逐次翻訳することも可能

> 注意: 逐次翻訳のためAmazon TranslateのAPIを高頻度で実行します。

画面下部の要約画面では、文字起こしデータから直近の話題について要約を行います。




## 構築方法


- 依存パッケージのインストール
```bash
npm ci
```

- CDKの設定変更

`packages/cdk/cdk.json` を構築する環境に合わせて設定値を編集する。

|設定値| 意味 | デフォルト値|
|----|-----|-----|
|selfSignUpEnabled| Amazon Cognitoのセルフサインアップを有効化する| true|
|allowedSignUpEmailDomains|Amazon Cognitoにサインアップ可能なメールのドメインを設定する| amazon.co.jp|
|modelRegion| Amazon Bedrockのモデルを使用するリージョンを選択| us-east-1|
|modelIds| 要約で使用するAmazon Bedrockのモデルを設定する | anthropic.claude-3-sonnet-20240229-v1:0|
|allowedIpV4AddressRanges| AWS WAFに設定するIPアドレスによる制限。リスト形式で列挙する。無効化する場合はnullを設定する。|null|
|allowedIpV6AddressRanges| AWS WAFに設定するIPアドレスによる制限。リスト形式で列挙する。無効化する場合はnullを設定する。|null|
|allowedCountryCodes| AWS WAFに設定する地理的一致ルールステートメント| ["JP"]


- cdkのデプロイ
```bash
npm run cdk:deploy
```