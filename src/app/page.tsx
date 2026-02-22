"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { StockDashboard } from "@/components/StockDashboard";
import { StockWithTotalScore } from "@/types/stock";

const Home = () => {
  const endpoint = "/api/stocks";
  const pageSize = 20;
  const currentPage = 0;

  const [stocks, setStocks] = useState<StockWithTotalScore[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const searchParams = useSearchParams();

  // クエリパラメーターが変更されるたびにデータ更新
  useEffect(() => {
    const allQueryParameters = searchParams.toString();
    console.log(allQueryParameters);
    fetch(`${endpoint}?${allQueryParameters}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setStocks(data.stocks);
        setTotalCount(data.totalCount);
      });
  }, [searchParams]);

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl inline-block bg-linear-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
          高配当株スコアリング
        </h1>
        <p className="text-foreground max-w-2xl text-lg">
          配当利回り3.5%以上の優良銘柄を8つの指標で厳選分析。スコアが高いほど健全な財務と高い還元期待を持てます。
        </p>
      </section>

      <StockDashboard
        stocks={stocks}
        total={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
      />
    </div>
  );
};

export default Home;
