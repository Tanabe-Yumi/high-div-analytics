-- financial_history テーブルの period カラムを month カラムに変更
-- 注意: このマイグレーションは既存データがないことを前提としています

-- 既存の unique 制約を削除
alter table financial_history drop constraint if exists financial_history_code_year_period_key;

-- period カラムを削除
alter table financial_history drop column if exists period;

-- month カラムを追加
alter table financial_history add column month integer not null;

-- 新しい unique 制約を追加
alter table financial_history add constraint financial_history_code_year_month_key unique (code, year, month);
