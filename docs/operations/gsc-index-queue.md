# GSC インデックス検査キュー（新規記事）

記事 PR が main にマージされたあと、パイプライン CI が **未インデックス URL のキュー** を自動更新します。  
ユーザーは Search Console の **URL 検査** で、1 日 **5〜10 本** をインデックス登録リクエストします。

| 項目           | 値                                                                                               |
| -------------- | ------------------------------------------------------------------------------------------------ |
| プロパティ     | `https://sim-hikari-guide.com`（URL プレフィックス）                                             |
| Search Console | [https://search.google.com/search-console](https://search.google.com/search-console)             |
| キュー正本     | `blog-affiliate-pipeline/data/gsc-index-queue.json`                                              |
| 自動更新 WF    | `blog-affiliate-pipeline/.github/workflows/post-publish-index-queue.yml`                         |
| ベースライン   | [gsc-baseline.md](./gsc-baseline.md)                                                             |

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

| フィールド   | 型      | 説明                                           |
| ------------ | ------- | ---------------------------------------------- |
| `siteUrl`    | string  | 本番サイト URL（`config/e2e-smoke.json` 由来） |
| `updatedAt`  | string  | キュー最終更新（ISO 8601）                     |
| `entries`    | array   | 検査対象 URL 一覧                              |
| `slug`       | string  | 記事 slug（ファイル名から `.md` 除去）         |
| `url`        | string  | 記事の完全 URL                                 |
| `mergedAt`   | string  | main マージ検知時刻（ISO 8601）                |
| `indexed`    | boolean | ユーザーが GSC でインデックス確認済みか        |

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

| slug | URL | mergedAt | indexed | GSC 実施日 | メモ |
| ---- | --- | -------- | ------- | ---------- | ---- |
| _（JSON から転記）_ | | | ☐ | | |

**記入例**:

| slug | URL | mergedAt | indexed | GSC 実施日 | メモ |
| ---- | --- | -------- | ------- | ---------- | ---- |
| `sim-new-example` | https://sim-hikari-guide.com/articles/sim-new-example | 2026-07-22 | ☐ → ✅ | 2026-07-23 | リクエスト済 |

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

## 週次ルーティン（推奨: 日曜 10 分）

1. キュー JSON で `indexed: false` を確認
2. 未処理があれば 5〜10 本 URL 検査
3. [gsc-baseline.md](./gsc-baseline.md) の週次フォローアップ（インデックス数・表示回数）と合わせて実施
4. 4 週以上リクエスト済みなのに未インデックスの URL があれば Agent に共有（内部リンク・リライト検討）

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
