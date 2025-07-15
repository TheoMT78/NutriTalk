import React from 'react';

interface StepPoint {
  label: string;
  value: number;
}

interface StepHistoryChartProps {
  data: StepPoint[];
  className?: string;
  ticks?: { index: number; label: string }[];
}

const StepHistoryChart: React.FC<StepHistoryChartProps> = ({ data, className = '', ticks }) => {
  if (data.length === 0) {
    return (
      <div className={className}>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Aucune donnée</p>
      </div>
    );
  }

  const width = 260;
  const height = 100;
  const marginLeft = 30;
  const innerWidth = width - marginLeft;
  const maxVal = Math.max(...data.map(d => d.value));
  const barWidth = innerWidth / data.length;
  const avg = data.reduce((sum, d) => sum + d.value, 0) / data.length;

  const yTicks = [0, maxVal / 2, maxVal];

  return (
    <div className={className}>
      <svg width={width} height={height + 20} className="mx-auto">
        {/* axes */}
        <line
          x1={marginLeft}
          y1={height}
          x2={width}
          y2={height}
          className="stroke-gray-300 dark:stroke-gray-600"
        />
        {yTicks.map((val, i) => (
          <g key={i}>
            <line
              x1={marginLeft}
              y1={height - (val / maxVal) * height}
              x2={width}
              y2={height - (val / maxVal) * height}
              className="stroke-gray-200 dark:stroke-gray-700"
              strokeWidth={0.5}
            />
            <text
              x={marginLeft - 2}
              y={height - (val / maxVal) * height}
              textAnchor="end"
              dominantBaseline="central"
              className="text-[10px] fill-current"
            >
              {Math.round(val)}
            </text>
          </g>
        ))}

        {data.map((d, i) => {
          const barHeight = (d.value / maxVal) * height;
          const x = marginLeft + i * barWidth + barWidth * 0.1;
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
            </g>
          );
        })}
        {/* x-axis ticks */}
        {(ticks || data.map((d, i) => ({ index: i, label: d.label }))).map(t => (
          <g key={t.index}>
            <line
              x1={marginLeft + (t.index + 0.5) * barWidth}
              y1={height}
              x2={marginLeft + (t.index + 0.5) * barWidth}
              y2={height + 4}
              className="stroke-gray-400"
              strokeWidth={0.5}
            />
            <text
              x={marginLeft + (t.index + 0.5) * barWidth}
              y={height + 12}
              textAnchor="middle"
              className="text-[10px] fill-current"
            >
              {t.label}
            </text>
          </g>
        ))}
      </svg>
      <p className="text-right text-sm text-gray-600 dark:text-gray-400 mt-1">
        Moyenne {Math.round(avg)}
      </p>
    </div>
  );
};

export default StepHistoryChart;
