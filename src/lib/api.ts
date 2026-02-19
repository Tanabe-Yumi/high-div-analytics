import { supabase } from "@/lib/supabase";
import { Tables } from "@/types/database.types";
import { Stock, Score } from "@/types/stock";

// TODO: エラーハンドリング

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

export interface GetStocksResult {
  stocks: Stock[];
  total: number;
}

// stocks テーブルから全銘柄を取得
export async function getStocks(
  minDividendYield: number = 0,
  page: number = 0,
  pageSize: number = 20,
): Promise<GetStocksResult> {
  // stocks join scores
  let query = supabase.from("stocks").select(
    `
      *,
      scores ( * )
    `,
    { count: "exact" },
  );

  if (minDividendYield > 0) {
    query = query.gte("dividend_yield", minDividendYield);
  }

  // ページネーション
  const from = page * pageSize;
  const to = from + pageSize - 1;

  // ソート: scores.total の降順
  // TODO: ソートがうまく効いていない
  query = query
    .order("total", {
      foreignTable: "scores",
      ascending: false,
      nullsFirst: false,
    })
    .range(from, to);

  const { data: stocksData, error: stocksError, count } = await query;

  if (stocksError || !stocksData) {
    console.error("Error fetching stocks:", stocksError);
    return { stocks: [], total: 0 };
  }

  // 最新の決算情報を取得 (レーダーチャート用)
  const { data: historyData, error: historyError } = await supabase
    .from("financial_history")
    .select("*")
    .order("year", { ascending: false });

  if (historyError || !historyData) {
    console.error("Error fetching history:", historyError);
    return { stocks: [], total: 0 };
  }

  // Stock 型にマッピング
  const stocks: Stock[] = stocksData.map((s) => {
    // 各評価項目の最新値
    const score = mapToScore(s.scores ?? undefined);

    return {
      code: s.code,
      name: s.name,
      industry: s.industry ?? undefined,
      market: s.market ?? undefined,
      price: s.price ?? 0,
      dividendYield: s.dividend_yield ?? 0,
      score,
      updatedAt: s.updated_at,
    };
  });

  return { stocks, total: count ?? 0 };
}

export async function getStockByCode(code: string): Promise<Stock | null> {
  const { data, error } = await supabase
    .from("stocks")
    .select(
      `
      *,
      scores (*)
    `,
    )
    .eq("code", code);

  if (error) {
    console.error("Error fetching stock:", error);
    return null;
  }

  const score = mapToScore(data[0].scores ?? undefined);

  return {
    code: data[0].code,
    name: data[0].name,
    industry: data[0].industry ?? undefined,
    market: data[0].market ?? undefined,
    price: data[0].price ?? 0,
    dividendYield: data[0].dividend_yield ?? 0,
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
    .order("year", { ascending: true });

  if (error) {
    console.error("Error fetching history:", error);
    return [];
  }

  return data ?? [];
}
