import { supabase } from "@/lib/supabase";
import { Stock, FinancialHistory, EvaluationMetrics } from "@/types/stock";
import { calculateScore } from "@/lib/scoring";

function mapToMetrics(history: FinancialHistory): EvaluationMetrics {
  return {
    sales: history.sales || 0,
    operatingProfit: history.operating_profit || 0,
    eps: history.eps || 0,
    equityRatio: history.equity_ratio || 0,
    operatingCF: history.operating_cf || 0,
    cash: history.cash || 0,
    dividend: history.dividend || 0,
    payoutRatio: history.payout_ratio || 0,
  };
}

// TODO: スコア計算をフロントでやるのか計算したものをDBに入れておくのか

// stocks テーブルから全銘柄を取得
export async function getStocks(): Promise<Stock[]> {
  // stocks テーブルから全銘柄を取得
  const { data: stocksData, error: stocksError } = await supabase
    .from("stocks")
    .select("*");

  if (stocksError || !stocksData) {
    console.error("Error fetching stocks:", stocksError);
    return [];
  }

  // 最新の決算情報を取得 (レーダーチャート用)
  const { data: historyData, error: historyError } = await supabase
    .from("financial_history")
    .select("*")
    .order("year", { ascending: false });

  if (historyError || !historyData) {
    console.error("Error fetching history:", historyError);
    return [];
  }

  // Stock 型にマッピング
  const stocks: Stock[] = stocksData.map((s) => {
    // 最新の決算レコードを取得
    const history = historyData.find((h) => h.code === s.code);

    // 各評価項目の最新値
    const metrics = mapToMetrics(history);

    return {
      code: s.code,
      name: s.name,
      industry: s.industry,
      price: s.price,
      dividendYield: s.dividend_yield,
      metrics,
      score: calculateScore(metrics),
    };
  });

  return stocks;
}

export async function getStockByCode(code: string): Promise<Stock | null> {
  // stocks テーブルから銘柄情報を取得
  const { data, error } = await supabase
    .from("stocks")
    .select("*")
    .eq("code", code);

  if (error) {
    console.error("Error fetching stock:", error);
    return null;
  }

  // 最新の決算レコードを取得
  const { data: historyData, error: historyError } = await supabase
    .from("financial_history")
    .select("*")
    .eq("code", code)
    .order("year", { ascending: false });

  if (historyError || !historyData) {
    console.error("Error fetching history:", historyError);
    return null;
  }

  const metrics = mapToMetrics(historyData[0]);

  return {
    code: data[0].code,
    name: data[0].name,
    industry: data[0].industry,
    price: data[0].price,
    dividendYield: data[0].dividend_yield,
    metrics,
    score: calculateScore(metrics),
  };
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
