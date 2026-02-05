# 株価・配当利回り取得スクリプト

Yahoo FinanceからリアルタイムデータをSupabaseに保存するPythonスクリプトです。

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

プロジェクトルートの `.env.local` に以下を設定してください:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 実行方法

### ローカル実行

```bash
cd python
source venv/bin/activate
python fetchStockPrices.py
```

### GitHub Actionsで自動実行

`.github/workflows/fetch-stock-prices.yml` で定期実行されます。

## 処理内容

1. Supabaseの`stocks`テーブルから銘柄リストを取得
2. 各銘柄についてYahoo Financeから株価・配当利回りを取得
3. `stocks`テーブルの`current_price`, `dividend_yield`, `updated_at`を更新

## 注意事項

- Yahoo Finance APIは非公式のため、仕様変更の可能性があります
- API制限対策として各リクエスト間に2秒の待機時間を設けています
