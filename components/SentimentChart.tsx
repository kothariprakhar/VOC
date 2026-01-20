import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface Props {
  stats: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

const SentimentChart: React.FC<Props> = ({ stats }) => {
  const data = [
    { name: 'Positive', value: stats.positive, color: '#10b981' }, // Emerald 500
    { name: 'Neutral', value: stats.neutral, color: '#94a3b8' },  // Slate 400
    { name: 'Negative', value: stats.negative, color: '#ef4444' }, // Red 500
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
            itemStyle={{ color: '#f1f5f9' }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SentimentChart;
