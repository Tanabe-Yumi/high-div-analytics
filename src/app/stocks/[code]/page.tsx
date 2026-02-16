import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getStockByCode, getFinancialHistory } from "@/lib/api";
import { HistoricalChart } from "@/components/HistoricalChart";
import { CircleScoreGage } from "@/components/CircleScoreGage";
import { HoverInfoCard } from "@/components/HoverInfoCard";
import {
  ArrowLeft,
  BanknoteIcon,
  BarChart3Icon,
  Building2Icon,
  ChartColumnBigIcon,
  ChartLineIcon,
  ChartNoAxesCombinedIcon,
  ChartPieIcon,
  CoinsIcon,
  HandCoinsIcon,
  LandmarkIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
} from "lucide-react";
import Link from "next/link";
import { evaluationIndex } from "@/constants/evaluations";

const StockDetailPage = async ({
  params,
}: {
  params: Promise<{ code: string }>;
}) => {
  const { code } = await params;
  // TODO: getStockByCode() の戻り値を精査
  const stock = await getStockByCode(code);
  const history = await getFinancialHistory(code);

  if (!stock) {
    notFound();
  }

  const { metrics, score } = stock;
  // TODO: スコアの型定義と、undefinedの可能性排除

  const metricItems = [
    {
      label: "売上",
      value: `${metrics.sales.toLocaleString()}百万円`,
      score: score?.sales,
      icon: TrendingUpIcon,
    },
    {
      label: "営業利益率",
      value: `${metrics.operatingProfitMargin.toLocaleString()}%`,
      score: score?.operatingProfitMargin,
      icon: ChartLineIcon,
    },
    {
      label: "EPS",
      value: `${metrics.eps}円`,
      score: score?.eps,
      icon: ChartColumnBigIcon,
    },
    {
      label: "営業CF",
      value: `${metrics.operatingCF.toLocaleString()}百万円`,
      score: score?.operatingCF,
      icon: CoinsIcon,
    },
    {
      label: "一株配当",
      value: `${metrics.dividendPerShare.toLocaleString()}円`,
      score: score?.dividendPerShare,
      icon: HandCoinsIcon,
    },
    {
      label: "配当性向",
      value: `${metrics.payoutRatio}%`,
      score: score?.payoutRatio,
      icon: ChartPieIcon,
    },
    {
      label: "自己資本比率",
      value: `${metrics.equityRatio}%`,
      score: score?.equityRatio,
      icon: ShieldCheckIcon,
    },
    {
      label: "現金等",
      value: `${metrics.cash.toLocaleString()}百万円`,
      score: score?.cash,
      icon: BanknoteIcon,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 pt-0 md:p-8 md:pt-0 space-y-6">
      <Link
        href="/"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        一覧に戻る
      </Link>

      {/* 基本情報 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 p-6 md:p-8 bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
        <div className="flex flex-col gap-y-2">
          <div className="flex flex-wrap items-center gap-1">
            <Badge className="font-bold">{stock.code}</Badge>
            <Badge className="font-medium bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              <LandmarkIcon data-icon="inline-start" />
              {stock.market}
            </Badge>
            <Badge className="font-medium bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
              <Building2Icon data-icon="inline-start" />
              {stock.industry}
            </Badge>
          </div>
          <div className="flex gap-3">
            <h2 className="text-3xl font-bold">{stock.name}</h2>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-left">
            <p className="text-sm text-muted-foreground font-medium">現在値</p>
            <p className="text-2xl font-bold text-gray-900">¥{stock.price}</p>
          </div>
          <Separator orientation="vertical" />
          <div className="text-left">
            <p className="text-sm text-muted-foreground font-medium">
              配当利回り
            </p>
            <p className="text-2xl font-bold text-emerald-700">
              {stock.dividendYield}%
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 左側: 総合スコア */}
        <div className="md:col-span-1 bg-linear-to-br from-emerald-600 to-teal-500 rounded-2xl shadow-lg p-8 text-white flex flex-col items-center justify-center relative overflow-hidden group">
          {/* 背景装飾のサークル */}
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white opacity-20 rounded-full group-hover:scale-110 transition-transform duration-500"></div>

          <h3 className="text-lg font-bold mb-4 text-white uppercase tracking-widest">
            総合スコア
          </h3>
          <CircleScoreGage score={score?.total ?? 0} maxScore={40} />
        </div>

        {/* 右側: 項目ごとのスコア */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 md:p-8">
          <h3 className="text-lg font-bold text-neutral-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
            <BarChart3Icon className="text-emerald-600 w-5 h-5" />
            評価項目
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {metricItems.map((item, index) => (
              <div key={index} className="space-y-1.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium flex items-center gap-2">
                    <span className="p-1 bg-emerald-50 text-emerald-600 rounded">
                      {item.icon ? (
                        <item.icon className="size-4" />
                      ) : (
                        <TrendingUpIcon className="size-4" />
                      )}
                    </span>
                    {item.label}
                    {/* 項目の詳細（ホバー表示） */}
                    {evaluationIndex.find((e) => e.label === item.label) && (
                      <HoverInfoCard
                        title={
                          evaluationIndex.find((e) => e.label === item.label)
                            ?.longLabel ?? ""
                        }
                        description={
                          evaluationIndex.find((e) => e.label === item.label)
                            ?.description ?? ""
                        }
                      />
                    )}
                  </span>
                  <span className="font-bold text-neutral-800">
                    {item.score} / 5
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                    style={{
                      width: `${item.score ? (item.score / 5) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 業績グラフ */}
      <div className="p-6 md:p-8 bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
        <h3 className="text-lg font-bold text-neutral-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
          <ChartNoAxesCombinedIcon className="text-emerald-600 w-5 h-5" />
          業績推移
        </h3>
        <HistoricalChart history={history} />
      </div>

      {/* TODO: フッター */}
    </div>
  );
};

export default StockDetailPage;
