import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SignalChart from '../components/SignalChart';

export default function ZoneDetail() {
  const { zoneId } = useParams();
  const [signals, setSignals] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sigRes, alertRes] = await Promise.all([
          fetch(`/api/signals/${zoneId}?days=90`),
          fetch(`/api/alerts?zone_id=${zoneId}&limit=20`),
        ]);
        if (sigRes.ok) {
          const sigData = await sigRes.json();
          setSignals(sigData.signals);
        }
        if (alertRes.ok) {
          const alertData = await alertRes.json();
          setAlerts(alertData.alerts || []);
        }
      } catch (err) {
        console.error('Failed to load zone data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [zoneId]);

  if (loading) return <div className="zone-detail__loading">Loading…</div>;

  return (
    <div className="zone-detail" id="zone-detail-page">
      <div className="zone-detail__header">
        <Link to="/" className="zone-detail__back">← Back</Link>
        <h2>Zone: {zoneId.toUpperCase()}</h2>
      </div>

      <div className="zone-detail__charts">
        {signals && Object.entries(signals).map(([key, data]) => (
          <SignalChart
            key={key}
            title={key.toUpperCase()}
            dates={data.dates}
            values={data.values}
          />
        ))}
        {!signals && <p>No signal data available for this zone.</p>}
      </div>

      <div className="zone-detail__alerts glass-card">
        <h3>Alert History</h3>
        {alerts.length === 0 ? (
          <p className="zone-detail__empty">No alerts for this zone.</p>
        ) : (
          <table className="zone-detail__table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Score</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map(a => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.score?.toFixed(2)}</td>
                  <td>{a.status}</td>
                  <td>{a.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style>{`
        .zone-detail {
          padding: 1.5rem;
          max-width: 1000px;
          margin: 0 auto;
        }
        .zone-detail__header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .zone-detail__header h2 {
          font-size: 1.3rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .zone-detail__back {
          font-size: 0.85rem;
          color: var(--accent-cyan);
        }
        .zone-detail__charts {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .zone-detail__alerts {
          padding: 1rem;
        }
        .zone-detail__alerts h3 {
          font-size: 1rem;
          margin-bottom: 0.75rem;
        }
        .zone-detail__table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8rem;
        }
        .zone-detail__table th,
        .zone-detail__table td {
          text-align: left;
          padding: 0.5rem 0.75rem;
          border-bottom: 1px solid var(--border-color);
        }
        .zone-detail__table th {
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.7rem;
          letter-spacing: 0.05em;
        }
        .zone-detail__empty {
          color: var(--text-muted);
          font-size: 0.85rem;
        }
        .zone-detail__loading {
          text-align: center;
          padding: 3rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
