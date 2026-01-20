import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Cell } from 'recharts';
import { FeatureSuggestion } from '../types';

interface Props {
  features: FeatureSuggestion[];
}

const FeatureMatrix: React.FC<Props> = ({ features }) => {
  
  const data = features.map(f => ({
    x: f.effortScore,
    y: f.impactScore,
    z: 1,
    name: f.title,
    priority: f.priority,
    fullData: f
  }));

  const getColor = (priority: string) => {
    switch (priority) {
      case 'High': return '#8b5cf6'; // Violet 500
      case 'Medium': return '#3b82f6'; // Blue 500
      case 'Low': return '#64748b'; // Slate 500
      default: return '#94a3b8';
    }
  };

  return (
    <div className="h-80 w-full bg-slate-900/50 rounded-lg p-4 border border-slate-800">
      <h3 className="text-slate-400 text-sm font-semibold mb-4 uppercase tracking-wider">Impact vs. Effort Matrix</h3>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            type="number" 
            dataKey="x" 
            name="Effort" 
            domain={[0, 10]} 
            tick={{ fill: '#94a3b8' }}
            label={{ value: 'Effort (Low → High)', position: 'bottom', fill: '#94a3b8', dy: 10, fontSize: 12 }}
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            name="Impact" 
            domain={[0, 10]} 
            tick={{ fill: '#94a3b8' }}
            label={{ value: 'Impact (Low → High)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }}
          />
          <ZAxis type="number" dataKey="z" range={[60, 400]} />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-slate-800 border border-slate-700 p-3 rounded shadow-xl">
                    <p className="font-bold text-white mb-1">{data.name}</p>
                    <p className="text-xs text-slate-300">Priority: <span style={{ color: getColor(data.priority)}}>{data.priority}</span></p>
                    <p className="text-xs text-slate-400">Impact: {data.y} / Effort: {data.x}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter name="Features" data={data}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.priority)} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FeatureMatrix;
