import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getPriorityColor, getPriorityLabel } from '../utils/colorScale';
import FeedbackButtons from './FeedbackButtons';

export default function AlertCard({ alert }) {
  const navigate = useNavigate();
  const color = getPriorityColor(alert.score);
  const label = getPriorityLabel(alert.score);

  return (
    <div
      className="alert-card glass-card"
      id={`alert-card-${alert.id}`}
      onClick={() => navigate(`/zone/${alert.zone_id}`)}
    >
      <div className="alert-card__header">
        <span className={`badge badge--${color}`}>{label}</span>
        <span className="alert-card__score">{alert.score?.toFixed(2)}</span>
      </div>
      <div className="alert-card__zone">{alert.zone_id}</div>
      <p className="alert-card__narrative">
        {alert.narrative || 'Anomaly detected — click for details'}
      </p>
      <div className="alert-card__footer">
        <span className="alert-card__time">{alert.created_at}</span>
        <FeedbackButtons alertId={alert.id} />
      </div>

      <style>{`
        .alert-card {
          padding: 0.75rem 1rem;
          cursor: pointer;
          transition: transform var(--transition-fast), box-shadow var(--transition-fast);
        }
        .alert-card:hover {
          transform: translateY(-2px);
        }
        .alert-card__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.25rem;
        }
        .alert-card__score {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .alert-card__zone {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }
        .alert-card__narrative {
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.4;
          margin-bottom: 0.5rem;
        }
        .alert-card__footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .alert-card__time {
          font-size: 0.7rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
