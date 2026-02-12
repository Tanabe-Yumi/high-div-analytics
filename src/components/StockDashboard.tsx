"use client";

import { useEffect, useState } from "react";
import { Stock } from "@/types/stock";
import { StockCard } from "@/components/StockCard";
import { DataTable } from "@/components/DataTable";
import { columns } from "@/components/StockTableColumns";
import { DividendFilter } from "@/components/DividendFilter";
import { InfiniteStockCards } from "@/components/InfiniteStockCards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, Table as TableIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface StockDashboardProps {
  stocks: Stock[];
  total: number;
  minYield: number;
  currentPage: number;
  pageSize: number;
}

export function StockDashboard({
  stocks,
  total,
  minYield,
  currentPage,
  pageSize = 20,
}: StockDashboardProps) {
  const [view, setView] = useState("card");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // マウント時に localStorage から表示設定を読み込む
  useEffect(() => {
    const savedView = localStorage.getItem("stockViewMode");
    if (savedView) {
      setView(savedView);
    }
  }, []);

  // 表示切り替え時に localStorage に保存する
  const handleViewChange = (newView: string) => {
    setView(newView);
    localStorage.setItem("stockViewMode", newView);
  };

  // テーブルのページ変更ハンドラ
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());

    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <Tabs value={view} onValueChange={handleViewChange} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">銘柄一覧</h2>
        
        <div className="flex items-center space-x-4">
          <DividendFilter />
          {/* 表示方法の切り替え(カード表示/テーブル表示) */}
          <TabsList>
            <TabsTrigger value="card" className="px-4">
              <LayoutGrid className="mr-2 h-4 w-4" />
              カード
            </TabsTrigger>
            <TabsTrigger value="table" className="px-4">
              <TableIcon className="mr-2 h-4 w-4" />
              テーブル
            </TabsTrigger>
          </TabsList>
        </div>
      </div>
      {/* カード表示 */}
      <TabsContent value="card" className="space-y-4">
        <InfiniteStockCards
          initialStocks={stocks}
          initialTotal={total}
          minYield={minYield}
          pageSize={pageSize}
        />
      </TabsContent>
      {/* テーブル表示 */}
      <TabsContent value="table">
        <DataTable
          columns={columns}
          data={stocks}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </TabsContent>
    </Tabs>
  );
}
