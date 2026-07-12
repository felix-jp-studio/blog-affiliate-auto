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

## auto-merge との関係

| PR 種別          | CI   | レビュー                      | auto-merge |
| ---------------- | ---- | ----------------------------- | :--------: |
| `rules/weekly-*` | 必須 | **1 件必要** → 承認後にマージ | キュー待ち |
| 通常 PR          | 必須 | 1 件必要                      |    手動    |

週次 PR も **あなたの承認 1 件** が必要です。auto-merge は CI + 承認が揃った時点で実行されます。

## 保護ルールの再適用

管理者が API で設定する場合:

```bash
./scripts/apply-branch-protection.sh
```

初回は `validate` が GitHub に登録された後（main で CI が 1 回成功後）に実行してください。

## 変更履歴

| 日付       | 内容 |
| ---------- | ---- |
| 2026-07-12 | 初版 |
