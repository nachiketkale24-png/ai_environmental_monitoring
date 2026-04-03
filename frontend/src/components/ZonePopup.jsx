import { useState } from 'react';
import SignalChart from './SignalChart';
import TimeSlider from './TimeSlider';
import { X, MessageSquareWarning } from 'lucide-react';

export default function ZonePopup({ zoneId, alerts, onClose }) {
  // We keep a 'days' state controlled by TimeSlider
  // Because it goes "days ago", we map 0 -> 30 days, 29 -> 1 day for charting?
  // User asked: html range input min=0 max=29 (days ago), default=0.
  // We feed `days` prop to SignalChart. If slider is 0 (Today), show 30 days? 
  // Let's interpret slider value as an absolute bounded slice, or just keep 'days=30', 
  // actually Recharts will handle 30 days. The prompt says:
  // "Below slider: ← 30 days ago | Today →" -> So if value is e.g. 0, we can just pass (30 - value) as 'days' array limit.
  const [sliderVal, setSliderVal] = useState(0); // 0 = Today
  
  // Actually, standardizing the slice:
  // If sliderVal = 0, we show 30 days. If sliderVal = 29, we show 1 day.
  const chartDays = 30 - sliderVal;

  // Find latest narrative if available in contextual alerts
  const zoneAlerts = alerts?.filter(a => a.zone_id === zoneId) || [];
  const latestAlert = zoneAlerts.length > 0 ? zoneAlerts[0] : null;

  let statusColor = 'var(--green)';
  if (latestAlert) {
    if (latestAlert.score >= 60) statusColor = 'var(--red)';
    else if (latestAlert.score >= 35) statusColor = 'var(--amber)';
  }

  return (
    <div className="zone-popup-backdrop" onClick={onClose}>
      <div className="zone-popup-panel" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
              ZONE {zoneId.toUpperCase()}
              {latestAlert && (
                <div style={{...styles.badge, backgroundColor: `${statusColor}20`, color: statusColor, border: `1px solid ${statusColor}50`}}>
                  {latestAlert.score.toFixed(0)} SCORE
                </div>
              )}
            </h2>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Telemetry Charts */}
        <div style={styles.chartsContainer}>
          <SignalChart zoneId={zoneId} signal="sst" days={chartDays} />
          <SignalChart zoneId={zoneId} signal="chl" days={chartDays} />
        </div>

        {/* Time Scrubber */}
        <TimeSlider value={sliderVal} onChange={setSliderVal} />

        {/* AI Narrative Callout */}
        {latestAlert && (
          <div style={{...styles.callout, borderColor: `${statusColor}50`, backgroundColor: `${statusColor}10`}}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', color: statusColor }}>
              <MessageSquareWarning size={18} />
              <strong style={{ fontSize: '0.85rem', textTransform: 'uppercase' }}>Explainer Narrative</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text)' }}>
              {latestAlert.narrative}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: '16px',
    borderBottom: '1px solid var(--border)',
    marginBottom: '24px'
  },
  badge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: 'bold'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-dim)',
    cursor: 'pointer',
    padding: 0
  },
  chartsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    marginBottom: '24px'
  },
  callout: {
    marginTop: '24px',
    padding: '16px',
    border: '1px solid',
    borderRadius: '8px'
  }
};
