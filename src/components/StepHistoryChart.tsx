import React from 'react';

interface StepPoint {
  label: string;
  value: number;
}

interface StepHistoryChartProps {
  data: StepPoint[];
  className?: string;
}

const StepHistoryChart: React.FC<StepHistoryChartProps> = ({ data, className = '' }) => {
  if (data.length === 0) {
    return (
      <div className={className}>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Aucune donnée</p>
      </div>
    );
  }

  const width = 260;
  const height = 100;
  const maxVal = Math.max(...data.map(d => d.value));
  const barWidth = width / data.length;
  const avg = data.reduce((sum, d) => sum + d.value, 0) / data.length;

  return (
    <div className={className}>
      <svg width={width} height={height + 20} className="mx-auto">
        {data.map((d, i) => {
          const barHeight = (d.value / maxVal) * height;
          const x = i * barWidth + barWidth * 0.1;
          const y = height - barHeight;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth * 0.8}
                height={barHeight}
                className="fill-teal-500"
              />
              <text
                x={x + barWidth * 0.4}
                y={height + 12}
                textAnchor="middle"
                className="text-[10px] fill-current"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="text-right text-sm text-gray-600 dark:text-gray-400 mt-1">
        Moyenne {Math.round(avg)}
      </p>
    </div>
  );
};

export default StepHistoryChart;
