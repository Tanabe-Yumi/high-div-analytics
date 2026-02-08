// TODO: 重複した interface が多いので簡素化する

// 評価指標
export interface EvaluationMetrics {
  sales: number;
  operatingProfitMargin: number;
  eps: number;
  operatingCF: number;
  dividendPerShare: number;
  payoutRatio: number;
  equityRatio: number;
  cash: number;
}

// スコア
export interface Score extends EvaluationMetrics {
  total: number;
}

// 銘柄情報
export interface Stock {
  code: string;
  name: string;
  // 業種
  industry?: string;
  // 市場
  market?: string;
  // 株価
  price?: number;
  // 配当利回り (%)
  dividendYield?: number;
  metrics: EvaluationMetrics;
  score?: Score;
  updatedAt: string;
}
