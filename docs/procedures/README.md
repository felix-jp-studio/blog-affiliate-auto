# 手順書一覧

ブログアフィリエイト全自動化プロジェクトの手順書です。上から順に実行する想定です。

## 一覧

| # | ファイル | 種別 | 説明 |
|---|----------|------|------|
| 01 | [01-roadmap-prompt-template.md](./01-roadmap-prompt-template.md) | プロンプト手順書 | ロードマップ生成用テンプレート（前提条件を編集して使う） |
| 02 | [02-roadmap-prompt-customized.md](./02-roadmap-prompt-customized.md) | プロンプト手順書 | 確定済み前提条件を埋め込んだロードマップ生成プロンプト |
| 03 | [03-niche-research-procedure.md](./03-niche-research-procedure.md) | 作業手順書 | ニッチ選定リサーチの実施方法 |

## リサーチ成果物

手順 03 の結果は `docs/research/` に格納します。

- [niche-pre-research.md](../research/niche-pre-research.md) — 2026-07 実施分（3 案比較・推奨 1 位）

## 使い方

### パターン A：ニッチから決める

1. `03-niche-research-procedure.md` を実行
2. 成果を `docs/research/niche-pre-research-YYYYMMDD.md` として保存
3. ニッチ確定後、`02-roadmap-prompt-customized.md` の「ニッチ」欄を更新
4. プロンプト全文を AI にコピペしてロードマップを生成

### パターン B：リサーチ済みでロードマップだけ生成

1. [niche-pre-research.md](../research/niche-pre-research.md) の推奨案を採用
2. `02-roadmap-prompt-customized.md` を AI に投入

### パターン C：別人・別条件で再計画

1. `01-roadmap-prompt-template.md` の【】内を書き換え
2. AI に投入

## プロンプト投入時の一行追記（任意）

```markdown
【重要】回答は日本語。実行可能な具体性を最優先。各月のKPIは数値必須。自動化は Make/Zapier/API連携まで具体化。
```
