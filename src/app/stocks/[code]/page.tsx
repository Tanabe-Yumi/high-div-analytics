import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getStockByCode, getFinancialHistory, getStocks } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ScoreChart } from "@/components/ScoreChart";
import { HistoricalChart } from "@/components/HistoricalChart";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const generateStaticParams = async () => {
  const stocks = await getStocks();
  return stocks.map((stock) => ({
    code: stock.code,
  }));
};

const StockDetailPage = async ({
  params,
}: {
  params: Promise<{ code: string }>;
}) => {
  const { code } = await params;
  const stock = await getStockByCode(code);
  const history = await getFinancialHistory(code);

  if (!stock) {
    notFound();
  }

  const { metrics, score } = stock;

  const metricItems = [
    {
      label: "売上",
      value: `${(metrics.sales / 100).toLocaleString()}億円`,
      score: score?.sales,
    },
    {
      label: "営業利益率",
      value: `${metrics.operatingProfitMargin}%`,
      score: score?.operatingProfitMargin,
    },
    { label: "EPS", value: `${metrics.eps}円`, score: score?.eps },
    {
      label: "自己資本比率",
      value: `${metrics.equityRatio}%`,
      score: score?.equityRatio,
    },
    {
      label: "営業CF",
      value: `${(metrics.operatingCashFlow / 100).toLocaleString()}億円`,
      score: score?.operatingCashFlow,
    },
    {
      label: "現金等",
      value: `${(metrics.cash / 100).toLocaleString()}億円`,
      score: score?.cash,
    },
    {
      label: "一株配当",
      value: `${metrics.dividendPerShare}円`,
      score: score?.dividendPerShare,
    },
    {
      label: "配当性向",
      value: `${metrics.payoutRatio}%`,
      score: score?.payoutRatio,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link
        href="/"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        一覧に戻る
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 左側: ヘッダーとスコア */}
        <div className="md:col-span-1 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                {stock.code}
              </span>
              <Badge variant="secondary">{stock.industry}</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{stock.name}</h1>
          </div>

          <Card className="shadow-sm border-accent-foreground">
            <CardContent className="px-4">
              <p className="text-sm text-muted-foreground mb-1">総合スコア</p>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black text-emerald-600">
                  {score?.total ?? "?"}
                </span>
                <span className="text-lg font-bold mb-1">/ 40</span>
              </div>
              <div className="mt-6 h-60 border-t">
                {score && <ScoreChart score={score} />}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右側: 詳細 */}
        <div className="md:col-span-2 space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <Card className="py-4 bg-muted/50 border-muted">
              <CardContent className="px-4 py-2">
                <p className="text-sm text-muted-foreground">現在値 (推定)</p>
                <p className="text-2xl font-bold">
                  ¥{stock.currentPrice.toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card className="py-4 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900">
              <CardContent className="px-4 py-2">
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  配当利回り (推定)
                </p>
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                  {stock.dividendYield.toFixed(2)}%
                </p>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-xl font-bold">指標詳細 (最新期)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {metricItems.map((item) => (
              <Card
                key={item.label}
                className="group hover:bg-muted/50 transition-colors"
              >
                <CardContent className="px-4 flex flex-col h-full">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      {item.label}
                    </span>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "font-bold transition-colors",
                        item.score === 5 &&
                          "bg-emerald-600 text-white dark:bg-emerald-300 dark:text-emerald-950/20",
                      )}
                    >
                      {item.score}
                    </Badge>
                  </div>
                  <p className="text-lg font-semibold mt-auto">{item.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 右下: 推移グラフ */}
          <div className="pt-8 border-t">
            <HistoricalChart history={history} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetailPage;
