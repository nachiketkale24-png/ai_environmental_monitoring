import React from 'react';

export default function ZonePopup({ zone, signals }) {
  return (
    <div className="zone-popup glass-card" id="zone-popup">
      <h3 className="zone-popup__title">{zone?.name || zone?.zone_id}</h3>
      <div className="zone-popup__signals">
        {signals && Object.entries(signals).map(([key, data]) => (
          <div key={key} className="zone-popup__signal">
            <span className="zone-popup__label">{key.toUpperCase()}</span>
            <span className="zone-popup__value">
              {data.values?.[data.values.length - 1]?.toFixed(2) || '—'}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        .zone-popup {
          padding: 1rem;
          min-width: 200px;
        }
        .zone-popup__title {
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }
        .zone-popup__signals {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .zone-popup__signal {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
        }
        .zone-popup__label {
          color: var(--text-muted);
          font-weight: 500;
        }
        .zone-popup__value {
          color: var(--accent-cyan);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
