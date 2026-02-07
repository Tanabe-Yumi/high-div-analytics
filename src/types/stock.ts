// TODO: 重複した interface が多いので簡素化する

export interface EvaluationMetrics {
  sales: number;
  operatingProfit: number;
  eps: number;
  equityRatio: number;
  operatingCF: number;
  cash: number;
  dividend: number;
  payoutRatio: number;
}

export interface Score extends EvaluationMetrics {
  total: number;
}

export interface Stock {
  code: string;
  name: string;
  price: number;
  dividendYield: number; // 配当利回り (%)
  industry: string; // 業種
  metrics: EvaluationMetrics;
  score?: Score; // Calculated score
  updatedAt?: string; // 株価更新日時
}

export interface FinancialHistory {
  id: string;
  code: string;
  year: number;
  period: string;
  sales: number;
  operating_profit: number;
  eps: number;
  equity_ratio: number;
  operating_cf: number;
  cash: number;
  dividend: number;
  payout_ratio: number;
}
