import { stocks } from "@/data/mockStocks";
import { StockCard } from "@/components/StockCard";

export default function Home() {
  // Sort stocks by total score descending
  const sortedStocks = [...stocks].sort((a, b) => (b.score?.total || 0) - (a.score?.total || 0));

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl inline-block bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
          高配当株スコアリング
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg">
          配当利回り3.5%以上の優良銘柄を8つの指標で厳選分析。スコアが高いほど健全な財務と高い還元期待を持てます。
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedStocks.map((stock) => (
          <StockCard key={stock.code} stock={stock} />
        ))}
      </div>
    </div>
  );
}
