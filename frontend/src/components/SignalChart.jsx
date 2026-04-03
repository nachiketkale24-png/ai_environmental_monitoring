import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ComposedChart,
  Area,
  Line,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

const API_BASE = "http://localhost:8000";

export default function SignalChart({ zoneId, signal, days }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchSignal = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/signals/${zoneId}?signal=${signal}&days=${days}`);
        if (!active) return;
        
        // Transform backend arrays into Recharts object format
        const chartData = res.data.dates.map((date, idx) => {
          const val = res.data.values[idx];
          const base = res.data.baseline[idx];
          const z = res.data.z_scores[idx];
          
          return {
            date: new Date(date).toLocaleDateString(),
            value: val,
            baseline: base,
            z_score: z,
            // Only add anomaly point if |z_score| > 2.0
            anomalyContext: Math.abs(z) > 2.0 ? val : null
          };
        });
        
        setData(chartData);
      } catch (err) {
        console.error("Failed to fetch signal", err);
      } finally {
        if (active) setLoading(false);
      }
    };
    
    fetchSignal();
    return () => { active = false; };
  }, [zoneId, signal, days]);

  if (loading) {
    return (
      <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
        Fetching signal data...
      </div>
    );
  }

  // Calculate generic bounds for the dashed lines
  const baselineAv = data.length > 0 ? data[0].baseline : 0;
  const approxStdFromZ = data.length > 0 && Math.abs(data[0].z_score) > 0 
    ? Math.abs((data[0].value - data[0].baseline) / data[0].z_score) 
    : 1;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={styles.tooltip}>
          <p style={{margin: '0 0 8px 0', fontSize: '0.85rem', fontWeight: 'bold'}}>{label}</p>
          <p style={{margin: 0, color: 'var(--accent)', fontSize: '0.8rem'}}>Value: {payload[0].value?.toFixed(2)}</p>
          <p style={{margin: 0, color: 'var(--text-dim)', fontSize: '0.8rem'}}>Baseline: {payload[1].value?.toFixed(2)}</p>
          <p style={{margin: '4px 0 0 0', color: Math.abs(payload[0].payload.z_score) > 2 ? 'var(--red)' : 'var(--text)', fontSize: '0.8rem'}}>
            Z-Score: {payload[0].payload.z_score?.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ height: 200, width: '100%', marginBottom: '24px' }}>
      <h4 style={styles.title}>{signal.toUpperCase()} SIGNAL ({days} Days)</h4>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis dataKey="date" stroke="var(--border)" tick={{ fill: 'var(--text-dim)', fontSize: 10 }} />
          <YAxis stroke="var(--border)" tick={{ fill: 'var(--text-dim)', fontSize: 10 }} domain={['auto', 'auto']} />
          <Tooltip content={<CustomTooltip />} />
          
          <ReferenceLine y={baselineAv + (2 * approxStdFromZ)} stroke="var(--amber)" strokeDasharray="3 3" />
          <ReferenceLine y={baselineAv - (2 * approxStdFromZ)} stroke="var(--amber)" strokeDasharray="3 3" />
          
          <Area type="monotone" dataKey="baseline" fill="transparent" stroke="var(--text-dim)" strokeDasharray="5 5" strokeWidth={2} />
          <Line type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={2} dot={false} />
          
          <Scatter dataKey="anomalyContext" fill="var(--red)" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

const styles = {
  tooltip: {
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    padding: '12px',
    borderRadius: '6px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
  },
  title: {
    margin: '0 0 12px 0',
    fontSize: '0.85rem',
    color: 'var(--text-dim)',
    letterSpacing: '1px'
  }
};
