# 週次リライト workflow（オペレーション）

Search Console のクエリ CSV から抽出したリライト候補を、パイプライン側の週次 workflow で処理するためのオペメモです。

| 項目         | 値                                                             |
| ------------ | -------------------------------------------------------------- |
| 実装リポ     | `blog-affiliate-pipeline`                                      |
| キュー正本   | `blog-affiliate-pipeline/data/rewrite-queue.csv`               |
| workflow     | `blog-affiliate-pipeline/.github/workflows/rewrite-weekly.yml` |
| 設計 doc     | `blog-affiliate-pipeline/docs/rewrite-weekly-workflow.md`      |
| スケジュール | 毎週月曜 10:00 JST + 手動 `workflow_dispatch`                  |

## 現状（スケルトン）

- キューが **空（ヘッダーのみ）でも CI は成功**（exit 0）
- 記事の自動リライト PR 作成は **未実装**（`gsc-rewrite-queue-v1` 完了後に拡張）
- GSC CSV は workflow 実行時には **不要**

## User アクション（将来）

1. GSC → 28 日クエリ CSV をエクスポート（[gsc-baseline.md](./gsc-baseline.md) 参照）
2. Agent に共有 → `rewrite-queue.csv` を更新（11–30 位クエリ等）
3. 月曜 workflow または手動 dispatch で週 1 本リライト候補を処理

## 手動確認

```bash
cd blog-affiliate-pipeline
node scripts/rewrite-weekly.mjs
```

GitHub → **blog-affiliate-pipeline** → Actions → **Rewrite weekly** → Run workflow

## 関連タスク

- `gsc-rewrite-queue-v1` — CSV からキュー生成（User CSV 依存）
- `meta-title-optimization-v1` — リライト時のタイトル改善テンプレ
