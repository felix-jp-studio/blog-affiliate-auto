# GSC インデックス・表示ベースライン取得手順

sim-hikari-guide.com の Search Console 計測起点を記録するためのチェックリストです。  
**初回ベースライン日**: 2026-07-21

| 項目             | 値                                                   |
| ---------------- | ---------------------------------------------------- |
| プロパティ       | `https://sim-hikari-guide.com`（URL プレフィックス） |
| Search Console   | https://search.google.com/search-console             |
| サイトマップ     | https://sim-hikari-guide.com/sitemap-index.xml       |
| 公開記事数       | 36 本（2026-07-21 時点）                             |
| 週次トラッキング | `docs/operations/gsc-baseline-template.json`         |

---

## ⚠️ ユーザー作業が必要（手動ログイン）

GSC には **Google アカウントでの手動ログイン** が必要です。エージェントはログイン・数値取得を代行できません。

1. https://search.google.com/search-console を開く
2. **sim-hikari-guide.com** にアクセス権のある Google アカウントでログイン
3. 左メニューから対象プロパティ `https://sim-hikari-guide.com` を選択
4. 本手順書の各ステップで数値を取得し、下記 **ベースラインスナップショット** 表に記入
5. 記入後、`gsc-baseline-template.json` の `snapshots[0]` も更新（任意）
6. 完了したら Agent に「GSC ベースライン記入済み」と連絡 → `config/roadmap-progress.json` の `gsc-indexing-baseline` を完了に更新

---

## ステップ 1: プロパティ確認

- [ ] Search Console にログイン済み
- [ ] プロパティ `https://sim-hikari-guide.com` が選択されている
- [ ] 所有権: GA4 連携済み（`ga4-gsc-env` タスク完了済み）
- [ ] サイトマップ: `sitemap-index.xml` が「成功」状態（**インデックス作成 → サイトマップ**）

---

## ステップ 2: インデックス登録数

**メニュー**: インデックス作成 → **ページ**

| 指標                                 | 記入欄 | 取得方法                                           |
| ------------------------------------ | ------ | -------------------------------------------------- |
| Google に登録されているページ数      |        | 上部サマリー「Google に登録されているページ」      |
| インデックス登録されていないページ数 |        | 上部サマリー「インデックス登録されていないページ」 |
| インデックス登録率（%）              |        | 登録数 ÷ 公開記事数（36）× 100                     |

**目標（Week 3–4）**: インデックス 15 本以上（`docs/revenue-roadmap.md` KPI 参照）

---

## ステップ 3: 検索パフォーマンス（直近 28 日）

**メニュー**: 検索結果のパフォーマンス → **28 日間** を選択

| 指標           | 記入欄 | 取得方法                   |
| -------------- | ------ | -------------------------- |
| 合計クリック数 |        | 上部「クリック数」         |
| 合計表示回数   |        | 上部「表示回数」           |
| 平均 CTR（%）  |        | 上部「CTR」                |
| 平均掲載順位   |        | 上部「掲載順位」（参考値） |

**期間メモ**: データが少ない場合は **7 日間** も併記し、比較用に残す。

---

## ステップ 4: 上位クエリ TOP 10

**メニュー**: 検索結果のパフォーマンス → タブ **クエリ** → 行数を 10 件表示

| 順位 | クエリ | クリック | 表示回数 | CTR | 平均掲載順位 |
| ---- | ------ | -------- | -------- | --- | ------------ |
| 1    |        |          |          |     |              |
| 2    |        |          |          |     |              |
| 3    |        |          |          |     |              |
| 4    |        |          |          |     |              |
| 5    |        |          |          |     |              |
| 6    |        |          |          |     |              |
| 7    |        |          |          |     |              |
| 8    |        |          |          |     |              |
| 9    |        |          |          |     |              |
| 10   |        |          |          |     |              |

**エクスポート（任意）**: 右上 **エクスポート → CSV ダウンロード** → `data/gsc-performance-YYYYMMDD.csv` として保存（将来のリライトキュー v1 で使用）

---

## ステップ 5: ベースラインスナップショット（2026-07-21）

初回計測の正本。記入後、この表を更新してください。

| 指標                  | 値（記入） | 備考           |
| --------------------- | ---------- | -------------- |
| 計測日                | 2026-07-21 |                |
| インデックス登録数    |            |                |
| 未インデックス数      |            |                |
| インデックス登録率    |            | %              |
| 表示回数（28 日）     |            |                |
| クリック数（28 日）   |            |                |
| CTR（28 日）          |            | %              |
| 平均掲載順位（28 日） |            |                |
| 公開記事数            | 36         | サイト側固定値 |

---

## ステップ 6: 未インデックス記事の URL 検査

**メニュー**: 上部検索バー **URL 検査**（または インデックス作成 → ページ → 未登録 URL をクリック）

### 手順

1. 未インデックスと判明した記事 URL を 1 件ずつ入力
2. 「URL は Google に登録されていません」と表示された場合:
   - **インデックス登録をリクエスト** をクリック
   - 1 日あたりのリクエスト上限に注意（急ぎすぎない）
3. 「クロール済み - インデックス未登録」の場合: 品質・重複・canonical を確認し、1 週間後に再検査
4. 結果を下記チェックリストに記録

### 記事 URL 一覧（36 本）

ベース URL: `https://sim-hikari-guide.com/articles/{slug}/`

| slug                                  | インデックス状態 | URL 検査日 | リクエスト済み |
| ------------------------------------- | ---------------- | ---------- | -------------- |
| ahamo-povo-hikaku                     |                  |            |                |
| au-denki-setwari                      |                  |            |                |
| docomo-hikari-hikari-collab-hikaku    |                  |            |                |
| family-2-lines-cheap                  |                  |            |                |
| hikari-1gbps-yasui                    |                  |            |                |
| hikari-kodate-osusume                 |                  |            |                |
| hikari-mansion-osusume                |                  |            |                |
| hikari-provider-chigai                |                  |            |                |
| hikari-switch-osusume                 |                  |            |                |
| home-router-hikari-hikaku             |                  |            |                |
| home-router-hitorigurashi             |                  |            |                |
| iijmio-hyoban-fee                     |                  |            |                |
| kouji-fuyou-hikari                    |                  |            |                |
| linemo-ahamo-hikaku                   |                  |            |                |
| linemo-hyoban-demerit                 |                  |            |                |
| mineo-hyoban-demerit                  |                  |            |                |
| mnp-reservation-number                |                  |            |                |
| mobareco-air-wimax-hikaku             |                  |            |                |
| nihon-tsushin-sim-hyoban              |                  |            |                |
| nuro-hikari-au-hikari-hikaku          |                  |            |                |
| nuro-hikari-campaign                  |                  |            |                |
| rakuten-mobile-switch                 |                  |            |                |
| rakuten-mobile-uq-mobile-hikaku       |                  |            |                |
| sim-20gb-osusume                      |                  |            |                |
| sim-carrier-hikaku                    |                  |            |                |
| sim-gakusei-osusume                   |                  |            |                |
| sim-houjin-osusume                    |                  |            |                |
| sim-kakehoudai-yasui                  |                  |            |                |
| sim-osusume-hikaku-2026               |                  |            |                |
| sim-speed-slow-fix                    |                  |            |                |
| sim-tethering-osusume                 |                  |            |                |
| sim-tuuwa-teigaku-hikaku              |                  |            |                |
| sim-unlimited-data                    |                  |            |                |
| smartphone-setwari-hikaku             |                  |            |                |
| softbank-hikari-biglobe-hikari-hikaku |                  |            |                |
| wimax-fee-hikaku-2026                 |                  |            |                |

### ハブページ（記事以外）

| URL                                   | インデックス状態 | 備考         |
| ------------------------------------- | ---------------- | ------------ |
| https://sim-hikari-guide.com/         |                  | トップ       |
| https://sim-hikari-guide.com/sim/     |                  | SIM ハブ     |
| https://sim-hikari-guide.com/hikari/  |                  | 光回線ハブ   |
| https://sim-hikari-guide.com/trouble/ |                  | お困り系ハブ |
| https://sim-hikari-guide.com/cost/    |                  | 固定費ハブ   |

---

## ステップ 7: 週次フォローアップ

毎週日曜（または月曜）に 5 分で再計測:

1. ステップ 2〜4 の数値を `gsc-baseline-template.json` に追記
2. インデックス登録率が前週比 +3 本以上か確認
3. 表示回数が 0 のまま 4 週続く場合 → 内部リンク v1・リライトキュー検討

---

## 完了条件

- [ ] ベースラインスナップショット表（ステップ 5）に実数記入済み
- [ ] 未インデックス記事に URL 検査実施（優先: 公開 2 週以内の記事）
- [ ] `config/roadmap-progress.json` の `gsc-indexing-baseline` を `completed` に移動（Agent が更新）

---

## 関連ドキュメント

- 収益 KPI: `docs/revenue-roadmap.md`（Week 3–4 目標: インデックス 15+）
- GSC 設定: `blog-affiliate-pipeline/docs/analytics-setup.md`
- 進捗正本: `config/roadmap-progress.json`
