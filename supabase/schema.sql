-- UUID を有効化
create extension if not exists "uuid-ossp";

-- stocks テーブル
create table if not exists stocks (
  code text primary key,
  name text not null,
  industry text,
  market text,
  price numeric,
  dividend_yield numeric,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- financial_history テーブル
create table if not exists financial_history (
  id uuid default uuid_generate_v4() primary key,
  code text references stocks(code) on delete cascade not null,
  -- 決算年度
  year integer not null,
  -- 通期(FY), 1Q, 2Q, 3Q
  period text not null,
  -- 売上 (百万円)
  sales numeric,
  -- 営業利益率 (%)
  operating_profit_margin numeric,
  -- EPS (円)
  earnings_per_share numeric,
  -- 営業CF (百万円)
  operating_cash_flow numeric,
  -- 一株配当 (円)
  dividend_per_share numeric,
  -- 配当性向 (%)
  payout_ratio numeric,
  -- 自己資本比率 (%)
  equity_ratio numeric,
  -- 現金等 (百万円)
  cash numeric,
  created_at timestamptz not null default now(),
  
  -- stock/year/period ごとにユニークなレコードとする
  unique(code, year, period)
);

-- updated_at を自動更新するトリガーを設定
create extension if not exists moddatetime schema extensions;
create trigger handle_updated_at before update on stocks
  for each row execute procedure moddatetime (updated_at);

-- Row Level Security (RLS) を有効化
alter table stocks enable row level security;
alter table financial_history enable row level security;

-- 誰でも読み取り可能にするポリシーを設定
create policy "Allow public read access on stocks"
  on stocks for select using (true);
create policy "Allow public read access on financial_history"
  on financial_history for select using (true);

-- 認証済み(service_role)、または匿名での insert/update を許可するポリシーを設定
-- 本番環境では、service_role に制限すべき
create policy "Allow anon insert/update for demo"
  on stocks for insert with check (true);
create policy "Allow anon insert/update for demo history"
  on financial_history for insert with check (true);
