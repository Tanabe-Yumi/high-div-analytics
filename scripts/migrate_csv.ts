import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

const csvFilePath = path.join(__dirname, "../data/financial_data.csv");

if (!fs.existsSync(csvFilePath)) {
  console.error("CSV file not found");
  process.exit(1);
}

const fileContent = fs.readFileSync(csvFilePath, "utf-8");
const records = parse(fileContent, {
  columns: true,
  skip_empty_lines: true,
});

const newRecords = records.map((record: any) => {
  const eps = parseFloat(record.eps);
  const dividend = parseFloat(record.dividend);
  let payout_ratio = 0;

  if (eps && dividend) {
    // Calculate Payout Ratio: (Dividend / EPS) * 100
    // Handle negative EPS or zero case if needed, but for now simple math
    payout_ratio = (dividend / eps) * 100;
    // Round to 1 decimal place
    payout_ratio = Math.round(payout_ratio * 10) / 10;

    // Handle unreasonable values if needed (e.g. infinite)
    if (!isFinite(payout_ratio)) payout_ratio = 0;
  }

  // Return new record order with payout_ratio
  return {
    code: record.code,
    name: record.name,
    year: record.year,
    period: record.period,
    sales: record.sales,
    operating_profit: record.operating_profit,
    eps: record.eps,
    equity_ratio: record.equity_ratio,
    operating_cash_flow: record.operating_cash_flow,
    cash: record.cash,
    dividend: record.dividend,
    payout_ratio: payout_ratio.toFixed(1), // Add new column
    industry: record.industry,
  };
});

const output = stringify(newRecords, {
  header: true,
});

fs.writeFileSync(csvFilePath, output);
console.log(
  `Updated CSV with payout_ratio. Processed ${newRecords.length} records.`,
);
