// スコア
export interface Score {
  total?: number;
  sales?: number;
  operatingProfitMargin?: number;
  eps?: number;
  operatingCF?: number;
  dividendPerShare?: number;
  payoutRatio?: number;
  equityRatio?: number;
  cash?: number;
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
  score?: Score;
  updatedAt: string;
}
