import Link from "next/link";
import { Stock } from "@/types/stock";
import { ScoreChart } from "@/components/ScoreChart";
import { Badge } from "lucide-react"; // Wait, Badge is not in lucide. I'll use div or install shadcn badge if I had it. 
// I'll generic badge.

export function StockCard({ stock }: { stock: Stock }) {
    const { score } = stock;
    if (!score) return null;

    return (
        <div className="group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-lg hover:border-emerald-500/50">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">{stock.code}</span>
                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                {stock.industry}
                            </span>
                        </div>
                        <Link href={`/stocks/${stock.code}`} className="group-hover:underline decoration-emerald-500/50 underline-offset-4 decoration-2">
                            <h3 className="text-xl font-bold tracking-tight mt-1 group-hover:text-emerald-600 transition-colors">
                                {stock.name}
                            </h3>
                        </Link>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-600">{stock.dividendYield.toFixed(2)}%</div>
                        <p className="text-xs text-muted-foreground">配当利回り</p>
                    </div>
                </div>

                <div className="flex items-end justify-between mb-4">
                    <div>
                        <p className="text-sm text-muted-foreground">現在値</p>
                        <p className="text-lg font-semibold">¥{stock.currentPrice.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground">総合スコア</p>
                        <div className="flex items-baseline gap-1 justify-end">
                            <span className="text-3xl font-black text-foreground">{score.total}</span>
                            <span className="text-sm text-muted-foreground">/ 40</span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                    {/* Chart Section - simplified for card */}
                    <div className="h-[200px] -ml-4">
                        <ScoreChart score={score} />
                    </div>
                </div>

                {/* Detail view link/overlay could go here */}
            </div>
        </div>
    );
}
