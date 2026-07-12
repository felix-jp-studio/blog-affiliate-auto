# ブランチ保護（main）

`main` ブランチのマージ条件。

## 必須条件

| 項目                    | 設定                                     |
| ----------------------- | ---------------------------------------- |
| 必須 CI                 | `validate`（`.github/workflows/ci.yml`） |
| 必須レビュー            | **なし**（一人運用のため。下記参照）     |
| Conversation resolution | 必須                                     |
| force push              | 禁止                                     |
| branch 削除             | 禁止                                     |
| up-to-date              | 必須（`strict: true`）                   |

## 一人運用で必須レビューを外している理由

GitHub では **PR 作成者は自分の PR に Approve を出せない**。別アカウントのレビュアーがいない一人運用では「承認 1 件必須」を満たせず、通常のマージボタンが使えません。

代わりに次の運用で品質を担保します。

| PR 種別          | CI   | 自動レビュー（Cursor） | マージ方法                                           |
| ---------------- | ---- | ---------------------- | ---------------------------------------------------- |
| `rules/weekly-*` | 必須 | コメントのみ           | CI 成功後 `auto-merge-weekly-pr` が `--admin` で実行 |
| 通常 PR          | 必須 | コメントのみ           | セルフレビュー後に UI または `merge-pr.sh` でマージ  |

Cursor PR Review は **マージをブロックしません**。

### 通常 PR のセルフレビュー（マージ前）

- [ ] CI（`validate`）が green
- [ ] **Cursor PR Review** のコメントを確認した
- [ ] diff を自分で確認した
- [ ] 関連ドキュメントを更新した（必要な場合）

### 通常 PR のマージ方法

CI 通過後、どちらかでマージできます。

```bash
./scripts/merge-pr.sh <番号>
```

```bash
gh pr merge <番号> --merge --delete-branch
```

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

## 週次 PR の承認スキップ

個人リポジトリでは GitHub Actions をレビュー bypass に登録できないため、**オーナー PAT** で週次 workflow のみ `--admin` マージします。

### WEEKLY_MERGE_PAT の登録

| Name               | Value                                             |
| ------------------ | ------------------------------------------------- |
| `WEEKLY_MERGE_PAT` | Fine-grained PAT（PR / Contents: Read and write） |

## セットアップ後の動作確認

1. `CURSOR_API_KEY` を登録し、テスト PR でレビューコメントが付くこと
2. `WEEKLY_MERGE_PAT` を登録し、`rules/weekly-*` PR が CI 後に自動マージされること

## 将来コラボレーターが増えたとき

`scripts/apply-branch-protection.sh` の `required_approving_review_count` を `1` に戻し、再実行する。

## 保護ルールの再適用

```bash
./scripts/apply-branch-protection.sh
```

初回は `validate` が GitHub に登録された後（main で CI が 1 回成功後）に実行してください。

## 変更履歴

| 日付       | 内容                                                 |
| ---------- | ---------------------------------------------------- |
| 2026-07-12 | 初版                                                 |
| 2026-07-12 | 週次 PR は WEEKLY_MERGE_PAT + --admin で承認スキップ |
| 2026-07-12 | 一人運用のため必須レビューを 0 に変更                |
| 2026-07-12 | Cursor PR Review workflow（GitHub Actions）を追加    |
