import React from 'react';
import AlertCard from './AlertCard';

export default function AlertFeed({ alerts }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="alert-feed alert-feed--empty" id="alert-feed">
        <p>No active alerts</p>
      </div>
    );
  }

  return (
    <div className="alert-feed" id="alert-feed">
      <h2 className="alert-feed__title">🚨 Active Alerts</h2>
      <div className="alert-feed__list">
        {alerts.map(alert => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </div>

      <style>{`
        .alert-feed {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .alert-feed__title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border-color);
        }
        .alert-feed__list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-height: 450px;
          overflow-y: auto;
        }
        .alert-feed--empty {
          color: var(--text-muted);
          text-align: center;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
}
