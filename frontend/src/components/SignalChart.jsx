import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';

export default function SignalChart({ title, dates, values, threshold }) {
  const data = dates?.map((d, i) => ({ date: d, value: values?.[i] })) || [];

  return (
    <div className="signal-chart glass-card" id={`chart-${title}`}>
      <h4 className="signal-chart__title">{title}</h4>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 15, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: 'rgba(148,163,184,0.2)' }}
          />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: 'rgba(148,163,184,0.2)' }}
          />
          <Tooltip
            contentStyle={{
              background: '#111827',
              border: '1px solid rgba(56,189,248,0.2)',
              borderRadius: '8px',
              color: '#f1f5f9',
              fontSize: '0.8rem',
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#38bdf8"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#2dd4bf' }}
          />
          {threshold && (
            <ReferenceLine
              y={threshold}
              stroke="#ef4444"
              strokeDasharray="5 5"
              label={{ value: 'Threshold', fill: '#ef4444', fontSize: 10 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      <style>{`
        .signal-chart {
          padding: 1rem;
        }
        .signal-chart__title {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  );
}
