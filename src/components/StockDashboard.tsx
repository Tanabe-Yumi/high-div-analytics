"use client";

import { useEffect, useState } from "react";
import { Stock } from "@/types/stock";
import { StockCard } from "@/components/StockCard";
import { DataTable } from "@/components/DataTable";
import { columns } from "@/components/StockTableColumns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, Table as TableIcon } from "lucide-react";

export function StockDashboard({ stocks }: { stocks: Stock[] }) {
  const [view, setView] = useState("card");

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

  return (
    <Tabs value={view} onValueChange={handleViewChange} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">銘柄一覧</h2>
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
      {/* カード表示 */}
      <TabsContent value="card" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stocks.map((stock) => (
            <StockCard key={stock.code} stock={stock} />
          ))}
        </div>
      </TabsContent>
      {/* テーブル表示 */}
      <TabsContent value="table">
        <DataTable columns={columns} data={stocks} />
      </TabsContent>
    </Tabs>
  );
}
