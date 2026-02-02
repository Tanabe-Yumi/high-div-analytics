import { supabase } from "@/lib/supabase";
import { Stock, FinancialHistory, EvaluationMetrics } from "@/types/stock";
import { calculateScore } from "@/lib/scoring";

// Helper to calculate derived metrics not in DB directly
function mapToMetrics(history: FinancialHistory): EvaluationMetrics {
  // Operating Profit Margin = (Operating Profit / Sales) * 100
  const operatingProfitMargin = history.sales
    ? (history.operating_profit / history.sales) * 100
    : 0;

  return {
    sales: history.sales, // Already in 'millions' if CSV is correct, or raw. Let's assume raw in DB, code needs to handle unit based on display.
    // Actually import script maps directly.
    operatingProfitMargin: parseFloat(operatingProfitMargin.toFixed(1)),
    eps: history.eps,
    equityRatio: history.equity_ratio,
    operatingCashFlow: history.operating_cash_flow,
    cash: history.cash_equivalents,
    dividendPerShare: history.dividends,
    payoutRatio: history.payout_ratio,
  };
}

// Fetch all stocks with their LATEST FY financial data
export async function getStocks(): Promise<Stock[]> {
  // 1. Get all stocks
  const { data: stocksData, error: stocksError } = await supabase
    .from("stocks")
    .select("*");

  if (stocksError || !stocksData) {
    console.error("Error fetching stocks:", stocksError);
    return [];
  }

  // 2. Get latest FY data for each stock
  // Optimally efficiently: Select distinct on code order by year desc
  // For now simple loop or getting all history and filtering in JS (dataset is small)
  const { data: historyData, error: historyError } = await supabase
    .from("financial_history")
    .select("*")
    .eq("period", "FY")
    .order("year", { ascending: false });

  if (historyError || !historyData) {
    console.error("Error fetching history:", historyError);
    return [];
  }

  // Map to Stock objects
  const stocks: Stock[] = stocksData.map((s) => {
    // Find latest FY record for this stock
    const history = historyData.find((h) => h.code === s.code);

    // Default metrics if no history
    let metrics: EvaluationMetrics = {
      sales: 0,
      operatingProfitMargin: 0,
      eps: 0,
      equityRatio: 0,
      operatingCashFlow: 0,
      cash: 0,
      dividendPerShare: 0,
      payoutRatio: 0,
    };

    let currentPrice = 0;
    let dividendYield = 0;

    if (history) {
      metrics = mapToMetrics(history);
      // Mocking current price logic based on dividend yield for demo
      // In real app, we need a 'prices' table or API for current price.
      // For now, let's reverse calculate price from yield if we had it, or just use mock fixed values or fetch from real API if possible.
      // Since we dropped mockStocks.ts, we need a price source.
      // Let's assume Price ~ Dividend / 0.04 (4% yield assumption for fallback)
      // OR, retrieve 'currentPrice' if we added it to stocks table (we didn't).
      // Let's use a mock mapping or random for demo purposes if not in DB.

      // Actually, looking at sample CSV, it doesn't have price.
      // I will implement a simpler fallback:
      currentPrice = history.dividends * 25; // approx 4% yield
      dividendYield = (history.dividends / currentPrice) * 100;
    }

    return {
      code: s.code,
      name: s.name,
      industry: s.industry,
      currentPrice,
      dividendYield,
      metrics,
      score: calculateScore(metrics),
    };
  });

  return stocks;
}

export async function getStock(code: string): Promise<Stock | null> {
  const all = await getStocks();
  return all.find((s) => s.code === code) || null;
}

export async function getFinancialHistory(
  code: string,
): Promise<FinancialHistory[]> {
  const { data, error } = await supabase
    .from("financial_history")
    .select("*")
    .eq("code", code)
    .order("year", { ascending: true }); // Ascending for charts

  if (error) {
    console.error("Error fetching history:", error);
    return [];
  }

  return data || [];
}
