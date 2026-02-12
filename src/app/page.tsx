import { getStocks } from "@/lib/api";
import { StockDashboard } from "@/components/StockDashboard";
import { AlertCircleIcon } from "lucide-react";

interface SearchParams {
  min_yield?: string;
}

const Home = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const params = await searchParams;
  const minYieldParam = params.min_yield;
  const minYield = minYieldParam === undefined ? 3.5 : parseFloat(minYieldParam);
  const stocks = await getStocks(minYield);
  // total score の降順にソート
  // TODO: ソートはDB側で実行
  const sortedStocks = [...stocks].sort(
    (a, b) => (b.score?.total || 0) - (a.score?.total || 0),
  );

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

      {/* TODO: ページネーション */}

      {sortedStocks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border-2 border-dashed rounded-xl border-muted bg-muted/5">
          <div className="p-4 rounded-full bg-muted/20">
            <AlertCircleIcon className="w-10 h-10 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">
              データが見つかりませんでした
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              現在表示できる高配当株データがありません。しばらく経ってから再度アクセスしてください。
            </p>
          </div>
        </div>
      ) : (
        <StockDashboard stocks={sortedStocks} />
      )}
    </div>
  );
};

export default Home;
