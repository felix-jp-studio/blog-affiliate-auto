# GSC API 週次レポート — 運用メモ

pipeline スケルトン: `blog-affiliate-pipeline/docs/gsc-api-weekly-report.md`  
Workflow: `gsc-weekly-report.yml`（月曜 schedule。**secrets 未設定時は exit 0 でスキップ**）

## User 設定（任意・API 自動化したい場合）

1. GCP で Search Console API を有効化
2. サービスアカウント作成 → GSC プロパティにユーザー追加  
   **または** OAuth クライアント + refresh token
3. GitHub Actions Secrets に登録（値はチャットに貼らない）:
   - `GSC_SERVICE_ACCOUNT_JSON`
   - または `GSC_OAUTH_CLIENT_ID` / `GSC_OAUTH_CLIENT_SECRET` / `GSC_OAUTH_REFRESH_TOKEN`
4. 任意 Variable: `GSC_SITE_URL=https://sim-hikari-guide.com/`
5. 「GSC secrets 設定した」と Agent に連絡 → API 配線 PR

## 現状

- レポート Markdown 生成の枠のみ
- 手動ベースラインは引き続き `gsc-baseline.md`
- `gsc-rewrite-queue-v1` は **User の 28 日 CSV 未共有**で別途ブロック
