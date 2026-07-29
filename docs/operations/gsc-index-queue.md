# GSC インデックス検査キュー（新規記事）

記事 PR が main にマージされたあと、パイプライン CI が **未インデックス URL のキュー** を自動更新します。  
ユーザーは Search Console の **URL 検査** で、1 日 **5〜10 本** をインデックス登録リクエストします。

| 項目           | 値                                                                                   |
| -------------- | ------------------------------------------------------------------------------------ |
| プロパティ     | `https://sim-hikari-guide.com`（URL プレフィックス）                                 |
| Search Console | [https://search.google.com/search-console](https://search.google.com/search-console) |
| キュー正本     | `blog-affiliate-pipeline/data/gsc-index-queue.json`                                  |
| 自動更新 WF    | `blog-affiliate-pipeline/.github/workflows/post-publish-index-queue.yml`             |
| ベースライン   | [gsc-baseline.md](./gsc-baseline.md)                                                 |

---

## 🔴 今すぐ対応: 未インデックス 1 件（2026-07-29 更新）

`data/gsc-index-queue.json` に **`indexed: false` が 1 件** あります。GSC ログイン後、下記 URL を URL 検査してください。

| slug                         | URL                                                          | mergedAt   | indexed      |
| ---------------------------- | ------------------------------------------------------------ | ---------- | ------------ |
| **`wifi-speed-slow-kaizen`** | https://sim-hikari-guide.com/articles/wifi-speed-slow-kaizen | 2026-07-29 | ☐ **要検査** |

```bash
cd blog-affiliate-pipeline && npm run gsc:inspection-batch
# → 上記 1 URL を出力（コピー用）
```

**完了後**: Agent に「`wifi-speed-slow-kaizen` GSC 検査済み」と連絡 → `indexed: true` 更新 PR を依頼。

---

## ⏱️ ユーザー向け 10 分チェックリスト（URL 検査 1 本）

GSC には **手動ログイン必須**。エージェントは代行しません。

| #   | 手順                                                                                           | 目安  | 完了 |
| --- | ---------------------------------------------------------------------------------------------- | ----- | ---- |
| 1   | [Search Console](https://search.google.com/search-console) を開く                              | 1 分  | ☐    |
| 2   | sim-hikari-guide.com 権限のある Google アカウントでログイン                                    | 1 分  | ☐    |
| 3   | プロパティ `https://sim-hikari-guide.com` を選択                                               | 30 秒 | ☐    |
| 4   | 上部 **URL 検査** に `https://sim-hikari-guide.com/articles/wifi-speed-slow-kaizen` を貼り付け | 30 秒 | ☐    |
| 5   | 結果確認: **登録済み** → ✅ / **未登録** → **インデックス登録をリクエスト**                    | 2 分  | ☐    |
| 6   | 本ページ下部チェックリスト表の `wifi-speed-slow-kaizen` 行に GSC 実施日を記入                  | 1 分  | ☐    |
| 7   | Agent に「GSC 検査済み（wifi-speed-slow-kaizen）」と連絡                                       | 1 分  | ☐    |

**合計**: 約 7〜10 分（1 URL のみ）

---

## キューファイル形式

正本: [`blog-affiliate-pipeline/data/gsc-index-queue.json`](https://github.com/felix-jp-studio/blog-affiliate-pipeline/blob/main/data/gsc-index-queue.json)

```json
{
  "siteUrl": "https://sim-hikari-guide.com",
  "updatedAt": "2026-07-22T09:15:00.000Z",
  "entries": [
    {
      "slug": "example-article-slug",
      "url": "https://sim-hikari-guide.com/articles/example-article-slug",
      "mergedAt": "2026-07-22T09:15:00.000Z",
      "indexed": false
    }
  ]
}
```

| フィールド  | 型      | 説明                                           |
| ----------- | ------- | ---------------------------------------------- |
| `siteUrl`   | string  | 本番サイト URL（`config/e2e-smoke.json` 由来） |
| `updatedAt` | string  | キュー最終更新（ISO 8601）                     |
| `entries`   | array   | 検査対象 URL 一覧                              |
| `slug`      | string  | 記事 slug（ファイル名から `.md` 除去）         |
| `url`       | string  | 記事の完全 URL                                 |
| `mergedAt`  | string  | main マージ検知時刻（ISO 8601）                |
| `indexed`   | boolean | ユーザーが GSC でインデックス確認済みか        |

**追記タイミング**: `articles-auto-merge.yml` による記事 PR マージ → main への push → `post-publish-index-queue.yml` が diff から slug を解決し追記。

**手動追記（Agent / 緊急時）**:

```bash
cd blog-affiliate-pipeline
node scripts/append-index-queue.mjs --slugs=your-slug-here
```

GitHub Actions からは **workflow_dispatch**（`Post-publish index queue`）で `slugs` 入力も可能。

---

## ⚠️ ユーザー作業が必要（手動ログイン）

GSC には **Google アカウントでの手動ログイン** が必要です。エージェントはログイン・インデックスリクエストを代行できません。

1. [https://search.google.com/search-console](https://search.google.com/search-console) を開く
2. **sim-hikari-guide.com** にアクセス権のある Google アカウントでログイン
3. 左メニューからプロパティ `https://sim-hikari-guide.com` を選択
4. 本ページ下部の **チェックリスト表** と `data/gsc-index-queue.json` の `indexed: false` エントリを照合
5. 1 セッションあたり **5〜10 本** を URL 検査 → 「インデックス登録をリクエスト」
6. 確認できた行の `indexed` を `true` に更新（下記チェックリスト表 + 必要なら JSON も）

**1 日の上限目安**: 5〜10 本（Search Console のクォータ・サイト規模に依存。急ぎすぎない）

---

## ステップ 1: キュー確認（毎週 or 記事マージ後）

- [ ] `blog-affiliate-pipeline/data/gsc-index-queue.json` を開く（または GitHub 上で確認）
- [ ] `indexed: false` のエントリ数を数える
- [ ] 0 件なら本手順はスキップ可
- [ ] 5 件以上溜まっている場合は今週中に URL 検査を実施

---

## ステップ 2: URL 検査（1 本あたり 2〜3 分）

各 `indexed: false` の URL について:

1. GSC 上部の **URL 検査** に完全 URL を貼り付け（例: `https://sim-hikari-guide.com/articles/sim-20gb-osusume`）
2. 結果を確認:
   - **「URL は Google に登録されています」** → インデックス済み。チェックリストで ✅ にする
   - **「URL は Google に登録されていません」** → **「インデックス登録をリクエスト」** をクリック
3. リクエスト後、ステータスが「インデックス登録リクエスト済み」等になることを確認
4. 次の URL へ（**本日 5〜10 本で打ち切り**）

---

## ステップ 3: インデックス確認チェックリスト

`data/gsc-index-queue.json` の `entries` と同期して記入。古いエントリは JSON 側の `indexed: true` 更新を正とする。

| slug                           | URL                                                                | mergedAt   | indexed | GSC 実施日 | メモ             |
| ------------------------------ | ------------------------------------------------------------------ | ---------- | ------- | ---------- | ---------------- |
| `esim-norikae-sokujitsu`       | https://sim-hikari-guide.com/articles/esim-norikae-sokujitsu       | 2026-07-22 | ✅      | 2026-07-28 |                  |
| `hikari-kaituu-itsu`           | https://sim-hikari-guide.com/articles/hikari-kaituu-itsu           | 2026-07-23 | ✅      | 2026-07-28 |                  |
| `sim-5g-taiou-hikaku`          | https://sim-hikari-guide.com/articles/sim-5g-taiou-hikaku          | 2026-07-24 | ✅      | 2026-07-28 |                  |
| `iphone-sono-mama-sim`         | https://sim-hikari-guide.com/articles/iphone-sono-mama-sim         | 2026-07-25 | ✅      | 2026-07-28 |                  |
| `rakuten-denki-rakuten-mobile` | https://sim-hikari-guide.com/articles/rakuten-denki-rakuten-mobile | 2026-07-26 | ✅      | 2026-07-28 |                  |
| `sim-senior-osusume`           | https://sim-hikari-guide.com/articles/sim-senior-osusume           | 2026-07-27 | ✅      | 2026-07-28 |                  |
| `au-hikari-kaiyaku-houhou`     | https://sim-hikari-guide.com/articles/au-hikari-kaiyaku-houhou     | 2026-07-28 | ✅      | 2026-07-28 |                  |
| **`wifi-speed-slow-kaizen`**   | https://sim-hikari-guide.com/articles/wifi-speed-slow-kaizen       | 2026-07-29 | ☐       |            | **今週の未処理** |

**前週バッチ（2026-07-28 完了）**: 上記 7 件（`esim-norikae-sokujitsu` 〜 `au-hikari-kaiyaku-houhou`）GSC URL 検査完了（JSON `indexed: true` / `indexedAt: 2026-07-28`）。

**今週（2026-07-29）**: `wifi-speed-slow-kaizen` のみ pending（`indexed: false`）。IndexNow は 2026-07-29 インライン送信済み。

```bash
cd blog-affiliate-pipeline && npm run gsc:inspection-batch
```

**記入例**:

| slug              | URL                                                   | mergedAt   | indexed | GSC 実施日 | メモ         |
| ----------------- | ----------------------------------------------------- | ---------- | ------- | ---------- | ------------ |
| `sim-new-example` | https://sim-hikari-guide.com/articles/sim-new-example | 2026-07-22 | ☐ → ✅  | 2026-07-23 | リクエスト済 |

---

## ステップ 4: JSON の indexed 更新（任意）

チェックリストで ✅ にした slug は、パイプライン repo で JSON を更新:

```bash
cd blog-affiliate-pipeline
# 該当 entry の "indexed": false → true に編集
git add data/gsc-index-queue.json
git commit -m "chore: mark GSC indexed slugs"
git push
```

Agent に依頼しても可（slug リストを伝える）。

---

## 週次ルーティン（推奨: 毎週月曜 10〜15 分）

| 順  | タスク                                                           | 担当  | 参照                                                                        |
| --- | ---------------------------------------------------------------- | ----- | --------------------------------------------------------------------------- |
| 1   | キュー JSON で `indexed: false` を確認                           | User  | 本ページ上部 🔴 セクション                                                  |
| 2   | 未処理があれば 5〜10 本 URL 検査                                 | User  | ステップ 2                                                                  |
| 3   | GSC 週次ベースライン記入（インデックス数・表示・CTR）            | User  | [gsc-baseline.md § Week 4+](./gsc-baseline.md#週次ベースライン-week-4-以降) |
| 4   | 検索パフォーマンス CSV エクスポート（リライトキュー用）          | User  | gsc-baseline ステップ 4                                                     |
| 5   | `indexed: true` 更新 PR                                          | Agent | ユーザー確認後                                                              |
| 6   | 4 週以上リクエスト済みなのに未インデックスの URL を Agent に共有 | User  | 内部リンク・リライト検討                                                    |

**Cadence**: 毎週月曜（または記事マージ直後）。Week 4 起点: **2026-07-29**。

---

## 完了条件

- [ ] 新規記事マージ後、キュー JSON に slug が自動追記されることを 1 回確認
- [ ] ユーザーが URL 検査手順（1 日 5〜10 本）を理解している
- [ ] チェックリスト表で indexed 状態を追跡できる

---

## 関連ドキュメント

- GSC ベースライン: [gsc-baseline.md](./gsc-baseline.md)
- 記事公開スケジュール: `blog-affiliate-pipeline/docs/article-publish-schedule.md`
- 進捗正本: `config/roadmap-progress.json`（タスク `post-publish-index-queue`）
