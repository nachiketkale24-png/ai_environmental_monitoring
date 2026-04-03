import React from 'react';

export default function TimeSlider({ value, onChange, min = 7, max = 90 }) {
  return (
    <div className="time-slider" id="time-slider">
      <label className="time-slider__label">
        📅 Time Range: <strong>{value} days</strong>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="time-slider__input"
      />
      <div className="time-slider__ticks">
        <span>7d</span>
        <span>30d</span>
        <span>60d</span>
        <span>90d</span>
      </div>

      <style>{`
        .time-slider {
          padding: 0.75rem 0;
        }
        .time-slider__label {
          font-size: 0.8rem;
          color: var(--text-secondary);
          display: block;
          margin-bottom: 0.5rem;
        }
        .time-slider__input {
          width: 100%;
          -webkit-appearance: none;
          height: 4px;
          background: var(--border-color);
          border-radius: 2px;
          outline: none;
        }
        .time-slider__input::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--accent-cyan);
          cursor: pointer;
          box-shadow: 0 0 8px rgba(56, 189, 248, 0.4);
        }
        .time-slider__ticks {
          display: flex;
          justify-content: space-between;
          font-size: 0.65rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
}
