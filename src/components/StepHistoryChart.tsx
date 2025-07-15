import React from 'react';

interface StepPoint {
  date: string;
  steps: number;
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
  const height = 80;
  const maxSteps = Math.max(...data.map(d => d.steps));
  const barWidth = width / data.length;
  const avg = data.reduce((sum, d) => sum + d.steps, 0) / data.length;
  const avgY = height - (avg / maxSteps) * height;

  return (
    <div className={className}>
      <svg width={width} height={height} className="mx-auto">
        {data.map((d, i) => {
          const barHeight = (d.steps / maxSteps) * height;
          const x = i * barWidth + barWidth * 0.1;
          const y = height - barHeight;
          return (
            <rect
              key={d.date}
              x={x}
              y={y}
              width={barWidth * 0.8}
              height={barHeight}
              className="fill-teal-500"
            />
          );
        })}
        <line
          x1={0}
          x2={width}
          y1={avgY}
          y2={avgY}
          className="stroke-red-500"
          strokeDasharray="4 2"
        />
      </svg>
    </div>
  );
};

export default StepHistoryChart;
