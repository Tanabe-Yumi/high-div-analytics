import { supabase } from "@/lib/supabase";
import { Stock, FinancialHistory, EvaluationMetrics } from "@/types/stock";
import { calculateScore } from "@/lib/scoring";

function mapToMetrics(history: FinancialHistory): EvaluationMetrics {
	return {
		sales: history.sales ?? 0,
		operatingProfitMargin: history.operating_profit_margin ?? 0,
		eps: history.earnings_per_share ?? 0,
		equityRatio: history.equity_ratio ?? 0,
		operatingCF: history.operating_cash_flow ?? 0,
		cash: history.cash ?? 0,
		dividendPerShare: history.dividend_per_share ?? 0,
		payoutRatio: history.payout_ratio ?? 0,
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
      market: s.market,
      price: s.price ?? 0,
      dividendYield: s.dividend_yield ?? 0,
      metrics,
      score: calculateScore(metrics),
      updatedAt: s.updated_at,
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
    market: data[0].market,
    price: data[0].price ?? 0,
    dividendYield: data[0].dividend_yield ?? 0,
    metrics,
    score: calculateScore(metrics),
    updatedAt: data[0].updated_at,
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
