import { EvaluationMetrics, Score } from "@/types/stock";

/**
 * Calculate score (1-5) for each metric
 * Total max score: 40
 */
export const calculateScore = (metrics: EvaluationMetrics): Score => {
  const score: Score = {
    sales: scoreSales(metrics.sales),
    operatingProfitMargin: scoreOperatingProfitMargin(
      metrics.operatingProfitMargin,
    ),
    eps: scoreEPS(metrics.eps),
    equityRatio: scoreEquityRatio(metrics.equityRatio),
    operatingCashFlow: scoreOperatingCashFlow(metrics.operatingCashFlow),
    cash: scoreCash(metrics.cash),
    dividendPerShare: scoreDividendPerShare(metrics.dividendPerShare),
    payoutRatio: scorePayoutRatio(metrics.payoutRatio),
    total: 0,
  };

  score.total =
    score.sales +
    score.operatingProfitMargin +
    score.eps +
    score.equityRatio +
    score.operatingCashFlow +
    score.cash +
    score.dividendPerShare +
    score.payoutRatio;

  return score;
};

// 1. 売上 (Sales) - Higher is better (Simplified thresholds for demo)
const scoreSales = (value: number): number => {
  if (value >= 1000000) return 5; // 1兆円以上
  if (value >= 500000) return 4;
  if (value >= 100000) return 3;
  if (value >= 50000) return 2;
  return 1;
};

// 2. 営業利益率 (Operating Profit Margin)
const scoreOperatingProfitMargin = (value: number): number => {
  if (value >= 15) return 5;
  if (value >= 10) return 4;
  if (value >= 8) return 3;
  if (value >= 5) return 2;
  return 1;
};

// 3. EPS - Absolute value (Simplified, ideally growth rate)
const scoreEPS = (value: number): number => {
  if (value >= 300) return 5;
  if (value >= 200) return 4;
  if (value >= 100) return 3;
  if (value >= 50) return 2;
  return 1;
};

// 4. 自己資本比率 (Equity Ratio)
const scoreEquityRatio = (value: number): number => {
  if (value >= 60) return 5;
  if (value >= 50) return 4;
  if (value >= 40) return 3;
  if (value >= 30) return 2;
  return 1;
};

// 5. 営業キャッシュフロー (Operating Cash Flow)
const scoreOperatingCashFlow = (value: number): number => {
  if (value >= 100000) return 5;
  if (value >= 50000) return 4;
  if (value >= 10000) return 3;
  if (value >= 0) return 2; // Positive is okay
  return 1; // Negative is bad
};

// 6. 現金 (Cash)
const scoreCash = (value: number): number => {
  if (value >= 100000) return 5;
  if (value >= 50000) return 4;
  if (value >= 10000) return 3;
  if (value >= 5000) return 2;
  return 1;
};

// 7. 一株配当 (Dividend Per Share)
const scoreDividendPerShare = (value: number): number => {
  if (value >= 150) return 5;
  if (value >= 100) return 4;
  if (value >= 70) return 3;
  if (value >= 40) return 2;
  return 1;
};

// 8. 配当性向 (Payout Ratio) - Healthy range (30-50%) is best
const scorePayoutRatio = (value: number): number => {
  if (value >= 30 && value <= 50) return 5;
  if (value > 50 && value <= 70) return 4;
  if (value > 70 && value <= 90) return 3; // Getting risky
  if (value > 0 && value < 30) return 3; // Low but safe
  if (value > 90) return 2; // Very risky
  return 1; // Negative or 0 without specific reason
};
