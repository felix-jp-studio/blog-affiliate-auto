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

| PR 種別          | CI   | レビュー                           | マージ方法                                           |
| ---------------- | ---- | ---------------------------------- | ---------------------------------------------------- |
| `rules/weekly-*` | 必須 | 不要（自動）                       | CI 成功後 `auto-merge-weekly-pr` が `--admin` で実行 |
| 通常 PR          | 必須 | **セルフレビュー**（マージ前確認） | `./scripts/merge-pr.sh <番号>` または UI からマージ  |

### 通常 PR のセルフレビュー（マージ前）

- [ ] CI（`validate`）が green
- [ ] diff を自分で確認した
- [ ] 関連ドキュメントを更新した（必要な場合）

### 通常 PR のマージ方法

CI 通過後、どちらかでマージできます。

```bash
# 推奨: ヘルパースクリプト
./scripts/merge-pr.sh 8
```

```bash
# または gh 直接（--admin は一人運用時の保険。count=0 なら通常マージでも可）
gh pr merge 8 --merge --delete-branch
```

GitHub UI からも、CI 通過後に **Merge pull request** が使えます。

## 週次 PR の承認スキップ

個人リポジトリでは GitHub Actions をレビュー bypass に登録できないため、**オーナー PAT** で週次 workflow のみ `--admin` マージします（ブランチ保護の将来変更にも備えた保険）。

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

## 将来コラボレーターが増えたとき

`scripts/apply-branch-protection.sh` の `required_approving_review_count` を `1` に戻し、再実行する。

```bash
./scripts/apply-branch-protection.sh
```

## 保護ルールの再適用

```bash
./scripts/apply-branch-protection.sh
```

## 変更履歴

| 日付       | 内容                                                 |
| ---------- | ---------------------------------------------------- |
| 2026-07-12 | 初版                                                 |
| 2026-07-12 | 週次 PR は WEEKLY_MERGE_PAT + --admin で承認スキップ |
| 2026-07-12 | 一人運用のため必須レビューを 0 に変更                |
