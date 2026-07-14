# ASP 登録手順（審査用）

格安 SIM × 光回線アフィリエイト向け。サイト審査に必要な情報をまとめています。

## 登録前チェックリスト

| 項目                 | URL                                  | 状態             |
| -------------------- | ------------------------------------ | ---------------- |
| トップ               | https://sim-hikari-guide.com         | 公開済み         |
| 運営者情報           | https://sim-hikari-guide.com/about   | 公開済み         |
| プライバシーポリシー | https://sim-hikari-guide.com/privacy | 公開済み         |
| お問い合わせ         | https://sim-hikari-guide.com/contact | フォーム実装済み |
| アフィリエイト表記   | フッター                             | 実装済み         |

## 登録時に入力するサイト情報

| 項目       | 値                              |
| ---------- | ------------------------------- |
| サイト名   | SIM・光回線ガイド               |
| URL        | https://sim-hikari-guide.com    |
| サイト種別 | 情報メディア / 比較・手順ガイド |
| ジャンル   | 通信・格安SIM・光回線           |
| 運営形態   | 個人                            |

## 登録先（優先順）

### 1. A8.net

- 登録: https://www.a8.net/
- サイト審査: マイページ → サイト登録
- 狙い案件: NURO光、auひかり、ソフトバンク光、WiMAX 等

### 2. もしもアフィリエイト

- 登録: https://af.moshimo.com/af/shop/login/entry
- サイト審査: パートナー管理 → メディア登録
- 狙い案件: 楽天モバイル（W報酬）、LINEMO 等

### 3. Link-AG

- 登録: https://www.link-ag.net/
- サイト審査: マイページ → サイト登録
- 狙い案件: 格安SIM 単価案件

## 審査却下時の対処

1. オリジナル記事を 3〜5 本公開（手動でも可）
2. プライバシーポリシー・アフィリエイト表記を再確認
3. お問い合わせフォームが動作するか確認
4. 1 週間後に再申請

## 登録完了後

`config/roadmap-progress.json` の `asp-register` を `completed` に移動し、取得した ASP ID を `config/affiliate-accounts.json`（今後作成）に記録する。
