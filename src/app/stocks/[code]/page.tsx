import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { getStockByCode, getFinancialHistory } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ScoreChart } from "@/components/ScoreChart";
import { HistoricalChart } from "@/components/HistoricalChart";
import { ArrowLeft, InfoIcon } from "lucide-react";
import Link from "next/link";
import { evaluationIndex } from "@/constants/evaluations";

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
      value: `${metrics.sales.toLocaleString()}百万円`,
      score: score?.sales,
    },
    {
      label: "営業利益率",
      value: `${metrics.operatingProfitMargin.toLocaleString()}%`,
      score: score?.operatingProfitMargin,
    },
    { label: "EPS", value: `${metrics.eps}円`, score: score?.eps },
    {
      label: "営業CF",
      value: `${metrics.operatingCF.toLocaleString()}百万円`,
      score: score?.operatingCF,
    },
    {
      label: "一株配当",
      value: `${metrics.dividendPerShare.toLocaleString()}円`,
      score: score?.dividendPerShare,
    },
    {
      label: "配当性向",
      value: `${metrics.payoutRatio}%`,
      score: score?.payoutRatio,
    },
    {
      label: "自己資本比率",
      value: `${metrics.equityRatio}%`,
      score: score?.equityRatio,
    },
    {
      label: "現金等",
      value: `${metrics.cash.toLocaleString()}百万円`,
      score: score?.cash,
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
            <div className="flex flex-wrap items-center gap-1 mb-2">
              <Badge variant="secondary">{stock.code}</Badge>
              <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                {stock.industry}
              </Badge>
              <Badge className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                {stock.market}
              </Badge>
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
                <p className="text-sm text-muted-foreground">現在値</p>
                <p className="text-2xl font-bold">
                  ¥{stock.price?.toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card className="py-4 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900">
              <CardContent className="px-4 py-2">
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  配当利回り
                </p>
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                  {stock.dividendYield}%
                </p>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-xl font-bold">指標詳細 (最新期)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {metricItems.map((item) => (
              <Item key={item.label} variant="outline" asChild>
                <ItemContent>
                  <ItemTitle className="w-full flex justify-between items-center">
                    <div className="flex justify-center items-center gap-x-1">
                      <span className="text-sm font-medium text-muted-foreground">
                        {item.label}
                      </span>
                      {/* 評価項目の説明 */}
                      <HoverCard openDelay={100} closeDelay={100}>
                        <HoverCardTrigger asChild>
                          <InfoIcon className="size-4 stroke-muted-foreground" />
                        </HoverCardTrigger>
                        <HoverCardContent side="top" className="text-sm">
                          <div className="flex flex-col gap-1">
                            <h4 className="font-medium">
                              {
                                evaluationIndex.find(
                                  (e) => e.label === item.label,
                                )?.longLabel
                              }
                            </h4>
                            <p>
                              {
                                evaluationIndex.find(
                                  (e) => e.label === item.label,
                                )?.descliption
                              }
                            </p>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
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
                  </ItemTitle>
                  <ItemDescription className="w-full text-lg text-black font-semibold mt-auto">
                    {item.value}
                  </ItemDescription>
                </ItemContent>
              </Item>
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
