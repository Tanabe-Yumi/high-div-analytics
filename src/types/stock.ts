export interface EvaluationMetrics {
  sales: number; // 売上 (百万円)
  operatingProfitMargin: number; // 営業利益率 (%)
  eps: number; // EPS (円)
  equityRatio: number; // 自己資本比率 (%)
  operatingCashFlow: number; // 営業キャッシュフロー (百万円)
  cash: number; // 現金同等物 (百万円)
  dividendPerShare: number; // 一株配当 (円)
  payoutRatio: number; // 配当性向 (%)
}

export interface Score {
  sales: number;
  operatingProfitMargin: number;
  eps: number;
  equityRatio: number;
  operatingCashFlow: number;
  cash: number;
  dividendPerShare: number;
  payoutRatio: number;
  total: number;
}

export interface Stock {
  code: string;
  name: string;
  currentPrice: number;
  dividendYield: number; // 配当利回り (%)
  industry: string; // 業種
  metrics: EvaluationMetrics;
  score?: Score; // Calculated score
}

export interface FinancialHistory {
  id: string;
  code: string;
  year: number;
  period: string; // 'FY', '1Q', etc.
  sales: number;
  operating_profit: number;
  eps: number;
  dividends: number;
  payout_ratio: number;
  equity_ratio: number;
  operating_cash_flow: number;
  cash_equivalents: number;
}
