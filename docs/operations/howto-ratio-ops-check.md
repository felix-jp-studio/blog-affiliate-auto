# 記事タイプ比率 — 週次オペメモ

## 目的

公開記事の `comparison / howto / troubleshoot / crosssell` 比率を監視し、howto・troubleshoot の不足を早期に検知する。

## 自動化（pipeline）

| 項目       | 内容                                                                   |
| ---------- | ---------------------------------------------------------------------- |
| スクリプト | `blog-affiliate-pipeline`: `npm run report:article-type-ratio`         |
| Workflow   | `.github/workflows/article-type-ratio.yml`（日曜 schedule + dispatch） |
| 閾値       | howto / troubleshoot の目標ギャップが **20pt 超**で warning            |

## 週次チェック（5 分）

1. [ ] Actions → **Article type ratio** の最新 run の Job Summary を見る
2. [ ] howto / troubleshoot が目標（目安 25% 前後）から大きく下なら KW 補充を検討
3. [ ] 必要なら `data/keywords.seed.csv` に howto/troubleshoot を追加（別 PR）

## 目標比率（Visitability）

| タイプ       | 目標 |
| ------------ | ---- |
| comparison   | 40%  |
| howto        | 25%  |
| troubleshoot | 25%  |
| crosssell    | 10%  |

スケジュール自体は週 7 本で均衡（comp×2 / howto×2 / trouble×2 / crosssell×1）。偏りは **既公開ストック**由来。

## 関連

- pipeline: `scripts/report-article-type-ratio.mjs`
- `docs/visitability-roadmap.md`
