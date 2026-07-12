# 次週ルール案（ドラフト）

週次レビューで自動適用する Cursor ルールのドラフトをここに置く。

## ファイル名

| ドラフト              | 適用先                              |
| --------------------- | ----------------------------------- |
| `project-context.mdc` | `.cursor/rules/project-context.mdc` |
| `agent-workflows.mdc` | `.cursor/rules/agent-workflows.mdc` |
| `docs-editing.mdc`    | `.cursor/rules/docs-editing.mdc`    |

## 運用

1. 週次レビュー前に、変更したい `.mdc` だけをこのフォルダにコピー
2. `npm run rules:weekly-review` 実行
3. 評価で **rollback** と判定された場合、ドラフトは無視され archive から復元
4. 適用後はドラフトを削除するか、次週用に上書き

## 注意

- ドラフトが空でもレビューは実行される（スコア記録・アーカイブ更新のみ）
- 2 世代のみ保持（`archive/*.previous.mdc`）
