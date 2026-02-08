# 高配当株データ処理スクリプト (Python)

Supabase と連携し、株価データの取得およびスコアリングを行う Python スクリプト群です。

## スクリプト構成

1.  **`fetchStockPrices.py`**: Yahoo Finance から最新の株価と配当利回りを取得し、`stocks` テーブルを更新します。
2.  **`calculateScores.py`**: `financial_history` テーブルの過去データに基づき、銘柄のスコアリングを行い、`scores` テーブルを更新します。

## セットアップ

### 1. Python環境構築

```bash
cd python
python -m venv venv
source venv/bin/activate  # macOS/Linux
# または
venv\Scripts\activate  # Windows

pip install -r requirements.txt
```

### 2. 環境変数設定

プロジェクトルートの `.env.local` に以下を設定して、このディレクトリ（`python`）から参照できるようにしてください。

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 実行方法

### ローカル実行

```bash
cd python
source venv/bin/activate

# 1. 最新の株価と配当利回りを更新
python fetchStockPrices.py

# 2. 過去データからスコアを計算・保存
python calculateScores.py
```

### GitHub Actionsでの自動実行

`.github/workflows/fetch-stock-prices.yml` によって定期的に自動実行されます。現状は株価取得のみが設定されています（必要に応じてスコア計算も追加可能です）。

## 処理内容詳細

### 株価取得 (`fetchStockPrices.py`)
- `stocks` テーブルから銘柄リストを取得
- 各銘柄について `yfinance` を使用して現在の株価・配当利回りを取得
- `stocks` テーブルの `price`, `dividend_yield`, `updated_at` を更新

### スコア計算 (`calculateScores.py`)
- `financial_history` テーブルから全年度の財務情報を取得
- `pandas` や `scipy` を使用して、売上成長性（傾き）や営業利益率（EWMA）などを分析
- 8つの指標（売上、営利、EPS、営業CF、一株配当、配当性向、自己資本、現金）を 5段階評価（計40点満点）
- 結果を `scores` テーブルに保存（UPSERT）

## 注意事項

- API 制限を避けるため、株価取得リクエストの間に待機時間を設けています
- 財務データが不足している銘柄については、デフォルトスコアが適用されます
