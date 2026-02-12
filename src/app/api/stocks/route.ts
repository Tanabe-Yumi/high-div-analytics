import { NextRequest, NextResponse } from "next/server";
import { getStocks } from "@/lib/api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const minYield = parseFloat(searchParams.get("min_yield") || "0");
  const page = parseInt(searchParams.get("page") || "0");
  const pageSize = parseInt(searchParams.get("pageSize") || "20");

  const result = await getStocks(minYield, page, pageSize);

  return NextResponse.json(result);
}
