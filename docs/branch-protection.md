# ブランチ保護（main）

`main` ブランチのマージ条件。

## 必須条件

| 項目                    | 設定                                     |
| ----------------------- | ---------------------------------------- |
| 必須 CI                 | `validate`（`.github/workflows/ci.yml`） |
| 必須レビュー            | 承認 1 件以上                            |
| stale review            | 新規 push で既存承認を無効化             |
| Conversation resolution | 必須                                     |
| force push              | 禁止                                     |
| branch 削除             | 禁止                                     |
| up-to-date              | 必須（`strict: true`）                   |

## マージ方針

| PR 種別          | CI   | レビュー     | マージ方法                                           |
| ---------------- | ---- | ------------ | ---------------------------------------------------- |
| `rules/weekly-*` | 必須 | **スキップ** | CI 成功後 `auto-merge-weekly-pr` が `--admin` で実行 |
| 通常 PR          | 必須 | **1 件必要** | 手動マージ（承認後）                                 |

## 週次 PR だけ承認をスキップする理由

個人リポジトリでは GitHub Actions をレビュー bypass リストに追加できないため、**オーナー PAT** で週次 workflow のみ `--admin` マージします。

通常 PR は `gh pr merge` を人間が実行するため、引き続き **承認 1 件** が必要です。

## セットアップ（初回のみ）

### 1. Fine-grained PAT を作成

GitHub → Settings → Developer settings → Fine-grained tokens

| 項目              | 値                                                      |
| ----------------- | ------------------------------------------------------- |
| Repository access | `blog-affiliate-auto` のみ                              |
| Permissions       | Pull requests: Read and write, Contents: Read and write |

### 2. リポジトリ Secret に登録

Settings → Secrets and variables → Actions → New repository secret

| Name               | Value        |
| ------------------ | ------------ |
| `WEEKLY_MERGE_PAT` | 作成した PAT |

### 3. 動作確認

`rules/weekly-*` ブランチで PR を作成し、CI 成功後に自動マージされることを確認。

## 保護ルールの再適用

```bash
./scripts/apply-branch-protection.sh
```

## 変更履歴

| 日付       | 内容                                                 |
| ---------- | ---------------------------------------------------- |
| 2026-07-12 | 初版                                                 |
| 2026-07-12 | 週次 PR は WEEKLY_MERGE_PAT + --admin で承認スキップ |
