import { notFound } from "next/navigation";
import { stocks } from "@/data/mockStocks";
import { ScoreChart } from "@/components/ScoreChart";
import { Badge, ArrowLeft } from "lucide-react"; // Generic icon
import Link from "next/link";

export function generateStaticParams() {
    return stocks.map((stock) => ({
        code: stock.code,
    }));
}

export default async function StockDetailPage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = await params;
    const stock = stocks.find((s) => s.code === code);

    if (!stock) {
        notFound();
    }

    const { metrics, score } = stock;

    const metricItems = [
        { label: "売上", value: `${metrics.sales.toLocaleString()}百万円`, score: score?.sales },
        { label: "営業利益率", value: `${metrics.operatingProfitMargin}%`, score: score?.operatingProfitMargin },
        { label: "EPS", value: `${metrics.eps}円`, score: score?.eps },
        { label: "自己資本比率", value: `${metrics.equityRatio}%`, score: score?.equityRatio },
        { label: "営業CF", value: `${metrics.operatingCashFlow.toLocaleString()}百万円`, score: score?.operatingCashFlow },
        { label: "現金等", value: `${metrics.cash.toLocaleString()}百万円`, score: score?.cash },
        { label: "一株配当", value: `${metrics.dividendPerShare}円`, score: score?.dividendPerShare },
        { label: "配当性向", value: `${metrics.payoutRatio}%`, score: score?.payoutRatio },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                一覧に戻る
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Col: Header & Score */}
                <div className="md:col-span-1 space-y-6">
                    <div>
                        <span className="inline-block px-2 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-md mb-2">
                            {stock.industry}
                        </span>
                        <h1 className="text-3xl font-bold tracking-tight">{stock.name}</h1>
                        <p className="text-muted-foreground font-mono text-lg">{stock.code}</p>
                    </div>

                    <div className="bg-card border rounded-lg p-6 shadow-sm">
                        <p className="text-sm text-muted-foreground mb-1">総合スコア</p>
                        <div className="flex items-end gap-2">
                            <span className="text-5xl font-black text-emerald-600">{score?.total}</span>
                            <span className="text-lg text-muted-foreground mb-1">/ 40</span>
                        </div>
                        <div className="mt-6 h-[250px] -ml-4">
                            {score && <ScoreChart score={score} />}
                        </div>
                    </div>
                </div>

                {/* Right Col: Details */}
                <div className="md:col-span-2">
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-4 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground">現在値</p>
                            <p className="text-2xl font-bold">¥{stock.currentPrice.toLocaleString()}</p>
                        </div>
                        <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-lg border border-emerald-100 dark:border-emerald-900">
                            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">配当利回り</p>
                            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{stock.dividendYield.toFixed(2)}%</p>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold mb-4">指標詳細</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {metricItems.map((item) => (
                            <div key={item.label} className="flex flex-col p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                                        {item.score}
                                    </span>
                                </div>
                                <p className="text-lg font-semibold mt-auto">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
