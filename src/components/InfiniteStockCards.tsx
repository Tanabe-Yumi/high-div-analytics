"use client";

import { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { Stock } from "@/types/stock";
import { StockCard } from "@/components/StockCard";
import { Spinner } from "@/components/ui/spinner";
import { GetStocksResult } from "@/lib/api";

interface InfiniteStockCardsProps {
  initialStocks: Stock[];
  initialTotal: number;
  minYield: number;
  pageSize?: number;
}

export function InfiniteStockCards({
  initialStocks,
  initialTotal,
  minYield,
  pageSize = 20,
}: InfiniteStockCardsProps) {
  const [stocks, setStocks] = useState<Stock[]>(initialStocks);
  const [page, setPage] = useState(1); // 次に取得するページ
  const [hasMore, setHasMore] = useState(initialStocks.length < initialTotal);
  const [isLoading, setIsLoading] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  // minYieldが変更されたら状態をリセット
  useEffect(() => {
    setStocks(initialStocks);
    setPage(1);
    setHasMore(initialStocks.length < initialTotal);
  }, [minYield, initialStocks, initialTotal]);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/stocks?min_yield=${minYield}&page=${page}&pageSize=${pageSize}`
      );
      const data: GetStocksResult = await response.json();

      setStocks((prev) => [...prev, ...data.stocks]);
      setPage((prev) => prev + 1);
      setHasMore(stocks.length + data.stocks.length < data.total);
    } catch (error) {
      console.error("Failed to load more stocks:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, minYield, page, pageSize, stocks.length]);

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMore();
    }
  }, [inView, hasMore, isLoading, loadMore]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stocks.map((stock) => (
          <StockCard key={stock.code} stock={stock} />
        ))}
      </div>

      {hasMore && (
        <div ref={ref} className="flex justify-center py-8">
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Spinner />
              <span>読み込み中...</span>
            </div>
          )}
        </div>
      )}

      {!hasMore && stocks.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          全ての銘柄を表示しました
        </div>
      )}
    </>
  );
}
