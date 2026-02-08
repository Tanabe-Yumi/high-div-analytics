import { supabase } from "@/lib/supabase";
import { Tables } from "@/types/database.types";
import { Stock, EvaluationMetrics, Score } from "@/types/stock";

function mapToMetrics(history?: Tables<"financial_history">): EvaluationMetrics {
	return {
		sales: history?.sales ?? 0,
		operatingProfitMargin: history?.operating_profit_margin ?? 0,
		eps: history?.earnings_per_share ?? 0,
		equityRatio: history?.equity_ratio ?? 0,
		operatingCF: history?.operating_cash_flow ?? 0,
		cash: history?.cash ?? 0,
		dividendPerShare: history?.dividend_per_share ?? 0,
		payoutRatio: history?.payout_ratio ?? 0,
	};
}

function mapToScore(scores?: Tables<"scores">): Score {
	return {
    sales: scores?.sales ?? 0,
    operatingProfitMargin: scores?.operating_profit_margin ?? 0,
    eps: scores?.earnings_per_share ?? 0,
    equityRatio: scores?.equity_ratio ?? 0,
    operatingCF: scores?.operating_cash_flow ?? 0,
    cash: scores?.cash ?? 0,
    dividendPerShare: scores?.dividend_per_share ?? 0,
    payoutRatio: scores?.payout_ratio ?? 0,
    total: scores?.total ?? 0,
  };
}

// TODO: スコア計算をフロントでやるのか計算したものをDBに入れておくのか

// stocks テーブルから全銘柄を取得
export async function getStocks(): Promise<Stock[]> {
  // stocks join scores
  const { data: stocksData, error: stocksError } = await supabase
    .from('stocks')
    .select(`
      *,
      scores ( * )
    `);

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
    const history: Tables<"financial_history"> | undefined = historyData.find((h) => h.code === s.code);

    // 各評価項目の最新値
    const metrics = mapToMetrics(history);
    const score = mapToScore(s.scores ?? undefined);

    return {
      code: s.code,
      name: s.name,
      industry: s.industry ?? undefined,
      market: s.market ?? undefined,
      price: s.price ?? 0,
      dividendYield: s.dividend_yield ?? 0,
      metrics,
      score,
      updatedAt: s.updated_at,
    };
  });

  return stocks;
}

export async function getStockByCode(code: string): Promise<Stock | null> {
  const { data, error } = await supabase
    .from("stocks")
    .select(`
      *,
      scores (*)
    `)
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
  const score = mapToScore(data[0].scores ?? undefined);

  // TODO: scoresの型を正しくする
  return {
    code: data[0].code,
    name: data[0].name,
    industry: data[0].industry ?? undefined,
    market: data[0].market ?? undefined,
    price: data[0].price ?? 0,
    dividendYield: data[0].dividend_yield ?? 0,
    metrics,
    score,
    updatedAt: data[0].updated_at,
  };
}

export async function getFinancialHistory(
  code: string,
): Promise<Tables<"financial_history">[]> {
  const { data, error } = await supabase
    .from("financial_history")
    .select("*")
    .eq("code", code)
    .order("year", { ascending: true }); // Ascending for charts

  if (error) {
    console.error("Error fetching history:", error);
    return [];
  }

  return data ?? [];
}
