-- Enable UUID extension if needed (not strictly needed for this simple schema but good practice)
create extension if not exists "uuid-ossp";

-- 1. Stocks Master Table
create table if not exists stocks (
  code text primary key, -- Stock code (e.g., '72030')
  name text not null,
  industry text,
  market text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Financial History Table (Vertical data structure for 10+ years)
create table if not exists financial_history (
  id uuid default uuid_generate_v4() primary key,
  code text references stocks(code) on delete cascade not null,
  year integer not null, -- e.g., 2023
  period text not null, -- e.g., 'FY' (Full Year), '1Q', '2Q', '3Q'
  
  -- Financial Metrics (in millions of yen usually, or raw yen depending on import)
  sales numeric, -- 売上高
  operating_profit numeric, -- 営業利益
  eps numeric, -- EPS (円)
  dividends numeric, -- 一株配当 (円)
  payout_ratio numeric, -- 配当性向 (%)
  
  equity_ratio numeric, -- 自己資本比率 (%)
  operating_cash_flow numeric, -- 営業CF
  cash_equivalents numeric, -- 現金同等物
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Ensure unique record per stock/year/period
  unique(code, year, period)
);

-- 3. Row Level Security (RLS) - Optional for now but good for instruction
alter table stocks enable row level security;
alter table financial_history enable row level security;

-- Allow public read access (Select)
create policy "Allow public read access on stocks"
on stocks for select using (true);

create policy "Allow public read access on financial_history"
on financial_history for select using (true);

-- Allow authenticated (service_role) or anon insert/update for this MVP usage
-- In production, you'd lock this down to service_role only.
create policy "Allow anon insert/update for demo"
on stocks for insert with check (true);

create policy "Allow anon insert/update for demo history"
on financial_history for insert with check (true);
