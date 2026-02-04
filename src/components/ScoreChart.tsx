"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { Score } from "@/types/stock";

type ScoreChartProps = {
  score: Score;
};

export const ScoreChart = ({ score }: ScoreChartProps) => {
  const data = [
    { subject: "売上", value: score.sales, fullMark: 5 },
    { subject: "営利", value: score.operatingProfitMargin, fullMark: 5 },
    { subject: "EPS", value: score.eps, fullMark: 5 },
    { subject: "自己資本", value: score.equityRatio, fullMark: 5 },
    { subject: "営業CF", value: score.operatingCashFlow, fullMark: 5 },
    { subject: "現金", value: score.cash, fullMark: 5 },
    { subject: "一株配当", value: score.dividendPerShare, fullMark: 5 },
    { subject: "配当性向", value: score.payoutRatio, fullMark: 5 },
  ];

  // TODO: チャートエリアの高さを柔軟にする。高さのみ合わせたら幅が合わない

  return (
    <div className="w-full h-60 flex justify-center items-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="45%" outerRadius="70%" data={data}>
          {/* レーダー */}
          <PolarGrid stroke="#e5e7eb" />
          {/* 凡例の文字 */}
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 5]}
            tick={false}
            axisLine={false}
          />
          {/* チャート */}
          <Radar
            name="Score"
            dataKey="value"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
