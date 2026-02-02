import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use Service Role Key if available (for scripts/admin), otherwise Anon Key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key in .env.local');
    process.exit(1);
}

console.log(`Using credentials: ${supabaseUrl} (Key length: ${supabaseKey.length})`);

const supabase = createClient(supabaseUrl, supabaseKey);

interface CSVRecord {
    code: string;
    name: string;
    industry: string;
    year: string;
    period: string;
    sales: string;
    operating_profit: string;
    eps: string;
    equity_ratio: string;
    operating_cash_flow: string;
    cash: string;
    dividend: string;
    payout_ratio: string;
}

async function importData() {
    const csvFilePath = path.join(__dirname, '../data/financial_data.csv');
    const fileContent = fs.readFileSync(csvFilePath, 'utf-8');

    const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true
    });

    console.log(`Found ${records.length} records. Starting import...`);

    for (const rawRecord of records) {
        const record = rawRecord as CSVRecord; // Type assertion

        // 1. Upsert Stock Master (unchanged)
        const { error: stockError } = await supabase
            .from('stocks')
            .upsert({
                code: record.code,
                name: record.name,
                industry: record.industry || 'Unknown',
            }, { onConflict: 'code' });

        if (stockError) {
            console.error(`Error upserting stock ${record.code}:`, stockError);
            continue;
        }

        // 2. Insert Financial History
        const { error: historyError } = await supabase
            .from('financial_history')
            .upsert({
                code: record.code,
                year: parseInt(record.year),
                period: record.period,
                sales: parseFloat(record.sales) || 0,
                operating_profit: parseFloat(record.operating_profit) || 0,
                eps: parseFloat(record.eps) || 0,
                equity_ratio: parseFloat(record.equity_ratio) || 0,
                operating_cash_flow: parseFloat(record.operating_cash_flow) || 0,
                cash_equivalents: parseFloat(record.cash) || 0,
                dividends: parseFloat(record.dividend) || 0,
                payout_ratio: parseFloat(record.payout_ratio) || 0, // Added
            }, { onConflict: 'code,year,period' });

        if (historyError) {
            console.error(`Error upserting history for ${record.code} ${record.year}:`, historyError);
        } else {
            process.stdout.write('.');
        }
    }

    console.log('\nImport complete!');
}

importData();
