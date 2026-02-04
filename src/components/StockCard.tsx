import Link from "next/link";
import { Stock } from "@/types/stock";
import { ScoreChart } from "@/components/ScoreChart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const StockCard = ({ stock }: { stock: Stock }) => {
  const { score } = stock;
  if (!score) return null;

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg hover:border-emerald-500/50 gap-4 border-accent-foreground">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              {stock.code}
            </span>
            <Badge variant="secondary">{stock.industry}</Badge>
          </div>
          <Link
            href={`/stocks/${stock.code}`}
            className="group-hover:underline decoration-emerald-500/50 underline-offset-4 decoration-2 block"
          >
            <CardTitle className="text-xl group-hover:text-emerald-600 transition-colors">
              {stock.name}
            </CardTitle>
          </Link>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-emerald-600">
            {stock.dividendYield.toFixed(2)}%
          </div>
          <p className="text-xs text-muted-foreground">配当利回り</p>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">現在値</p>
            <p className="text-lg font-semibold">
              ¥{stock.currentPrice.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">総合スコア</p>
            <div className="flex items-baseline gap-1 justify-end">
              <span className="text-3xl font-black">{score.total}</span>
              <span className="text-sm text-muted-foreground">/ 40</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="h-50 -ml-4">
            <ScoreChart score={score} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
