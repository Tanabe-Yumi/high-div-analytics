import { NextRequest, NextResponse } from "next/server";
import { getStocksWithTotalScore } from "@/lib/api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // パラメータ取り出し
  const marketParam = searchParams.get("market");
  const industryParam = searchParams.get("industry");
  const minYieldParam = searchParams.get("yield");
  const minScoreParam = searchParams.get("score");

  // 引数用の変数準備
  const markets = marketParam ? marketParam.split(",") : [];
  const industries = industryParam ? industryParam.split(",") : [];
  const minYield = minYieldParam ? parseFloat(minYieldParam) : 3.5;
  const minScore = minScoreParam ? parseFloat(minScoreParam) : 0;

  // ページネーション
  const page = parseInt(searchParams.get("page") || "0");
  const pageSize = parseInt(searchParams.get("pageSize") || "20");

  const result = await getStocksWithTotalScore(
    markets,
    industries,
    minYield,
    minScore,
    page,
    pageSize,
  );

  return NextResponse.json(result);
}
