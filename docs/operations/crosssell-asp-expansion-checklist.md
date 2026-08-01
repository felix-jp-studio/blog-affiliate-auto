# crosssell ASP 化調査チェックリスト（User）

**状態**: ブロック中（Agent 実装側プレースホルダのみ完了）

pipeline 側: `blog-affiliate-pipeline/docs/crosssell-asp-expansion-prep.md`  
候補 JSON: `blog-affiliate-pipeline/config/crosssell-asp-candidates.json`（trackingUrl はすべて null）

## User がやること

1. [ ] https://pub.a8.net/ にログイン（アカウント: 運用中の A8）
2. [ ] 「でんき / 電気 / 電力」で案件検索 → 提携可能なものをメモ
3. [ ] https://aff.valuecommerce.ne.jp/ で同様に検索
4. [ ] https://af.moshimo.com/af/s/ で電気・クレカ（非通信）を確認
5. [ ] クレカは **具体的な案件名** が決まってから trackingUrl を控える
6. [ ] Agent に共有: `programId` / `trackingUrl` / ASP 名（スクショ可）
7. [ ] 共有後「ASP 調査結果送った」とチャットで合図

## 禁止（Agent / User 共通）

- 未確認のアフィリエイト tracking URL を `asp-urls.json` に書かない
- 公式ページ URL を trackingUrl として偽らない

## Agent が調査結果受領後にやること

1. `asp-urls.json` に `status: active` 追加
2. candidates JSON の `researchStatus` を `done` に
3. crosssell プロンプト / 記事の `{AFFILIATE:…}` 有効化 PR
