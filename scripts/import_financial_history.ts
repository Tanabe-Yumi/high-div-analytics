import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import dotenv from "dotenv";

// 環境変数読み込み
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use Service Role Key if available (for scripts/admin), otherwise Anon Key
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(".env.local に Supabase の URL または Key が設定されていません。");
  process.exit(1);
}

console.log(
  `使用する認証情報: ${supabaseUrl} (Key length: ${supabaseKey.length})`,
);

const supabase = createClient(supabaseUrl, supabaseKey);

interface CSVRecord {
  code: string;
  year: string;
  period: string;
  sales: string;
  operating_profit: string;
  eps: string;
  equity_ratio: string;
  operating_cf: string;
  cash: string;
  dividend: string;
  payout_ratio: string;
}

async function importData() {
  const csvFilePath = path.join(__dirname, "../data/financial_history.csv");
  const fileContent = fs.readFileSync(csvFilePath, "utf-8");

  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });

  console.log(`${records.length}件のレコードをインポートします...`);

  for (const rawRecord of records) {
    const record = rawRecord as CSVRecord;
    // financial_history に upsert
    const { error: historyError } = await supabase
      .from("financial_history")
      .upsert(
        {
          code: record.code,
          year: parseInt(record.year),
          period: record.period,
          sales: parseFloat(record.sales) || null,
          operating_profit: parseFloat(record.operating_profit) || null,
          eps: parseFloat(record.eps) || null,
          equity_ratio: parseFloat(record.equity_ratio) || null,
          operating_cf: parseFloat(record.operating_cf) || null,
          cash: parseFloat(record.cash) || null,
          dividend: parseFloat(record.dividend) || null,
          payout_ratio: parseFloat(record.payout_ratio) || null,
        },
        { onConflict: "code,year,period" },
      );

    if (historyError) {
      console.error(`${record.code}/${record.year}/${record.period} のインポートに失敗しました:`, historyError);
    } else {
      process.stdout.write(".");
    }
  }

  console.log("\nインポート完了！");
}

importData();
