interface CircleScoreGageProps {
  score: number;
  maxScore: number;
}

export const CircleScoreGage = ({ score, maxScore }: CircleScoreGageProps) => {
  const r = 70;
  const stroke = 2 * Math.PI * r;
  const strokeOffset = stroke * ((40 - score) / 40);

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-40 h-40">
        <circle
          className="text-white opacity-20"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={r}
          cx="80"
          cy="80"
        />
        <circle
          className="text-white"
          strokeWidth="10"
          strokeDasharray={stroke}
          strokeDashoffset={strokeOffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={r}
          cx="80"
          cy="80"
          style={{
            position: "relative",
            transformOrigin: "50% 50%",
            transform: "rotate(-90deg)",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-black">{score}</span>
        <span className="text-sm font-medium text-white">/ {maxScore}点</span>
      </div>
    </div>
  );
};
