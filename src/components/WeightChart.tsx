import React from 'react';

interface WeightPoint {
  date: string;
  weight: number;
}

interface WeightChartProps {
  data: WeightPoint[];
  className?: string;
}

const WeightChart: React.FC<WeightChartProps> = ({ data, className = '' }) => {
  if (data.length === 0) {
    return (
      <div className={className}>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Aucune donnée poids</p>
      </div>
    );
  }

  const width = 260;
  const height = 80;
  const weights = data.map(d => d.weight);
  const minW = Math.min(...weights);
  const maxW = Math.max(...weights);
  const range = maxW - minW || 1;
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((d.weight - minW) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className={className}>
      <svg width={width} height={height} className="mx-auto">
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          points={points}
          className="text-blue-500"
        />
      </svg>
    </div>
  );
};

export default WeightChart;
