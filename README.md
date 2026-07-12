# blog-affiliate-auto

ブログアフィリエイトの全自動化（AI 生成 → 投稿）と 12 ヶ月での収益化を目指すプロジェクトの**計画・リサーチ・プロンプト手順**を管理するリポジトリです。

実装コード（パイプライン、WordPress 連携など）は別リポジトリまたは今後このリポジトリに追加する想定です。現時点ではドキュメントと手順書が中心です。

## 目標（確定条件）

| 項目 | 内容 |
|------|------|
| 目標期間 | 12 ヶ月 |
| 目標月収 | 最低 5 万円 / ベスト 10 万円 |
| 作業時間 | 平日 1 時間/日（休日は要調整） |
| 技術 | TypeScript / Python（API 連携・自動化可） |
| 記事作成 | 全自動（AI 生成 → 投稿まで。リスクは承知） |
| 対象市場 | 日本国内（Google 日本向け SEO） |
| ジャンル | 未決定 → [ニッチ事前リサーチ](docs/research/niche-pre-research.md) を参照 |

## ドキュメント構成

### リサーチ（`docs/research/`）

市場・ジャンル・競合などの調査結果。

| ファイル | 内容 |
|----------|------|
| [niche-pre-research.md](docs/research/niche-pre-research.md) | ニッチ 3 案比較・推奨・収益逆算 |

### 手順書（`docs/procedures/`）

AI に投げるプロンプトや、人間が実行する手順。番号順に進める想定。

| ファイル | 内容 |
|----------|------|
| [README.md](docs/procedures/README.md) | 手順書一覧と使い方 |
| [01-roadmap-prompt-template.md](docs/procedures/01-roadmap-prompt-template.md) | ロードマップ生成プロンプト（テンプレート・変数付き） |
| [02-roadmap-prompt-customized.md](docs/procedures/02-roadmap-prompt-customized.md) | ロードマップ生成プロンプト（確定条件を埋め込み済み） |
| [03-niche-research-procedure.md](docs/procedures/03-niche-research-procedure.md) | ニッチ選定リサーチの実施手順 |

## 推奨ワークフロー

1. [03-niche-research-procedure.md](docs/procedures/03-niche-research-procedure.md) でニッチを確定（または [niche-pre-research.md](docs/research/niche-pre-research.md) の推奨案 1 を採用）
2. [02-roadmap-prompt-customized.md](docs/procedures/02-roadmap-prompt-customized.md) を AI に投入し、12 ヶ月ロードマップを生成
3. ロードマップに沿って自動化パイプラインを実装（今後）

## Cursor ルール（`.cursor/rules/`）

このリポジトリを Cursor で開くと、エージェントに毎回読み込まれるルールが適用されます。

| ルール | alwaysApply | 役割 |
|--------|:-----------:|------|
| [project-context.mdc](.cursor/rules/project-context.mdc) | ✓ | 目標・制約・ドキュメント地図 |
| [agent-workflows.mdc](.cursor/rules/agent-workflows.mdc) | ✓ | タスク発火条件と**プロンプト要約カーネル** |
| [docs-editing.mdc](.cursor/rules/docs-editing.mdc) | `docs/**` 編集時 | 手順書・リサーチの編集規約 |

**プロンプトの二層構成**: 全文は `docs/procedures/` に置き、ルールには要約と「いつ何を読むか」だけを載せる（コンテキスト節約・重複管理を避けるため）。

## 関連リポジトリ

- [article-auto-post](../article-auto-post/) — Markdown 原稿の note / Qiita 自動投稿（Groq + Playwright）
