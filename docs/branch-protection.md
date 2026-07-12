# ブランチ保護（main）

`main` ブランチのマージ条件。

## 必須条件

| 項目                    | 設定                                          |
| ----------------------- | --------------------------------------------- |
| 必須 CI                 | `CI / validate`（`.github/workflows/ci.yml`） |
| 必須レビュー            | 承認 1 件以上                                 |
| stale review            | 新規 push で既存承認を無効化                  |
| Conversation resolution | 必須                                          |
| force push              | 禁止                                          |
| branch 削除             | 禁止                                          |
| up-to-date              | 必須（`strict: true`）                        |

## auto-merge との関係

| PR 種別          | CI   | 自動レビュー（Cursor） | マージ                    |
| ---------------- | ---- | ---------------------- | ------------------------- |
| `rules/weekly-*` | 必須 | コメントのみ           | auto-merge（CI + 承認後） |
| 通常 PR          | 必須 | コメントのみ           | 手動（CI + 承認後）       |

Cursor PR Review は **マージをブロックしません**。人間の承認とは別系統です。

## Cursor PR 自動レビュー（GitHub Actions）

PR 作成・更新時に `.github/workflows/cursor-pr-review.yml` が Cursor CLI で diff をレビューし、**PR にコメント**します。

| 項目     | 内容                                                                        |
| -------- | --------------------------------------------------------------------------- |
| トリガー | PR opened / synchronize / reopened / ready_for_review                       |
| 除外     | ドラフト PR、fork 由来 PR                                                   |
| Secret   | `CURSOR_API_KEY`（[Cursor Dashboard](https://cursor.com/dashboard) で発行） |
| 未設定時 | レビュー job はスキップ（CI は継続）                                        |

### CURSOR_API_KEY の登録

Settings → Secrets and variables → Actions → New repository secret

| Name             | Value                               |
| ---------------- | ----------------------------------- |
| `CURSOR_API_KEY` | Cursor Dashboard で発行した API Key |

### 動作確認

1. `CURSOR_API_KEY` を登録
2. テスト PR を作成
3. Actions の `Cursor PR Review` が成功し、PR にコメントが付くことを確認

## 保護ルールの再適用

管理者が API で設定する場合:

```bash
./scripts/apply-branch-protection.sh
```

初回は `CI / validate` が GitHub に登録された後（main で CI が 1 回成功後）に実行してください。

## 変更履歴

| 日付       | 内容                                              |
| ---------- | ------------------------------------------------- |
| 2026-07-12 | 初版                                              |
| 2026-07-12 | Cursor PR Review workflow（GitHub Actions）を追加 |
