"use client";

// TODO: 表示がおかしい
// TODO: サーバーコンポーネントにできるか？？

import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Tables } from "@/types/database.types";

type HistoricalChartProps = {
  history: Tables<"financial_history">[];
};

export const HistoricalChart = ({ history }: HistoricalChartProps) => {
  // Filter for FY only for cleaner chart, or use all? Usually FY trends are best.
  // TODO: 3月決算以外も考慮した表示に変更
  const data = history.filter((h) => h.month === 3);

  return (
    <div className="w-full h-100">
      <h3 className="text-lg font-bold mb-4">過去10年の業績推移</h3>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="year" scale="band" />
          {/* YAxis for Sales (Bar) */}
          <YAxis
            yAxisId="left"
            orientation="left"
            stroke="#8884d8"
            label={{
              value: "売上 (百万円)",
              angle: -90,
              position: "insideLeft",
            }}
          />
          {/* YAxis for EPS/Dividend (Line) */}
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#82ca9d"
            label={{ value: "円", angle: 90, position: "insideRight" }}
          />
          <YAxis
            yAxisId="right2"
            orientation="right"
            stroke="#ff7300"
            label={{ value: "%", angle: 90, position: "insideRight" }}
          />

          <Tooltip
            formatter={(value: any) =>
              value !== undefined ? Number(value).toLocaleString() : ""
            }
            labelStyle={{ color: "black" }}
          />
          <Legend />

          <Bar
            yAxisId="left"
            dataKey="sales"
            name="売上高"
            barSize={20}
            fill="#413ea0"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="dividend_per_share"
            name="配当金"
            stroke="#82ca9d"
            strokeWidth={2}
          />
          <Line
            yAxisId="right2"
            type="monotone"
            dataKey="operating_profit_margin"
            name="営業利益率"
            stroke="#ff7300"
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
