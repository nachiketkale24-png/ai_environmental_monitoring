import { ShieldCheck, Target, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { useState } from 'react';

const API_BASE = "http://localhost:8000";

export default function AlertFeed({ alerts, refreshAlerts }) {
  
  if (!alerts || alerts.length === 0) {
    return (
      <div className="feed-area" style={styles.emptyState}>
        <ShieldCheck size={48} color="var(--green)" style={{ marginBottom: 16 }} />
        <h2 style={{ margin: 0, color: 'var(--text)' }}>All Zones Nominal</h2>
        <p style={{ color: 'var(--text-dim)' }}>No active risks detected across monitored regions.</p>
      </div>
    );
  }

  return (
    <div className="feed-area" style={{ padding: '24px' }}>
      <div style={styles.header}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={20} color="var(--accent)" />
          ACTIVE ALERTS
        </h3>
        <span style={styles.badge}>{alerts.length}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {alerts.map(alert => (
          <AlertCard key={alert.id} alert={alert} refreshAlerts={refreshAlerts} />
        ))}
      </div>
    </div>
  );
}

function AlertCard({ alert, refreshAlerts }) {
  const [loading, setLoading] = useState(false);
  const [confirmedMessage, setConfirmedMessage] = useState('');

  const handleFeedback = async (verdict) => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/feedback`, {
        alert_id: alert.id,
        verdict: verdict // 'validated' | 'false_positive'
      });
      setConfirmedMessage(`Marked as ${verdict.replace('_', ' ')}`);
      // Wait a moment then refresh parent
      setTimeout(() => {
        refreshAlerts();
      }, 1500);
    } catch(e) {
      console.error(e);
      setLoading(false);
    }
  };

  if (confirmedMessage) {
    return (
      <div style={{...styles.card, justifyContent: 'center', alignItems: 'center', minHeight: '120px'}}>
        <ShieldCheck color="var(--green)" size={24} style={{marginBottom: '8px'}} />
        <span style={{color: 'var(--green)', fontSize: '0.9rem'}}>{confirmedMessage}</span>
      </div>
    );
  }

  let color = 'var(--green)';
  if (alert.score >= 60) color = 'var(--red)';
  else if (alert.score >= 35) color = 'var(--amber)';

  const parsedSignals = typeof alert.signals === 'string' ? JSON.parse(alert.signals) : alert.signals;
  const parsedZ = typeof alert.z_scores === 'string' ? JSON.parse(alert.z_scores) : alert.z_scores;

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          <div style={{...styles.scoreBadge, backgroundColor: `${color}20`, color: color, border: `1px solid ${color}50`}}>
            {alert.score.toFixed(0)}
          </div>
          <div>
            <strong style={{ fontSize: '1.05rem' }}>Zone: {alert.zone_id.toUpperCase()}</strong>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              {new Date(alert.created_at).toLocaleString()}
            </div>
          </div>
        </div>
        {alert.score >= 60 && <AlertTriangle color="var(--red)" size={20} />}
      </div>

      <p style={styles.narrative}>{alert.narrative}</p>

      <div style={styles.chipContainer}>
        {(parsedSignals || []).map(sig => {
          const zval = (parsedZ && parsedZ[sig]) ? parsedZ[sig].toFixed(1) : '?';
          return (
            <div key={sig} style={styles.chip}>
              {sig.toUpperCase()} 
              <span style={{marginLeft: '6px', color: 'var(--text)', opacity: 0.8}}>
                {zval > 0 ? `+${zval}σ` : `${zval}σ`}
              </span>
            </div>
          )
        })}
      </div>

      <div style={styles.actions}>
        <button 
          style={{...styles.btn, color: 'var(--green)', borderColor: 'var(--green)'}}
          onClick={() => handleFeedback('validated')}
          disabled={loading}
        >
          ✓ Validated
        </button>
        <button 
          style={{...styles.btn, color: 'var(--text-dim)', borderColor: 'var(--border)'}}
          onClick={() => handleFeedback('false_positive')}
          disabled={loading}
        >
          ✗ False Positive
        </button>
      </div>
    </div>
  );
}

const styles = {
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '2rem'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '12px'
  },
  badge: {
    backgroundColor: 'var(--border)',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: 'bold'
  },
  card: {
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  scoreBadge: {
    width: '42px',
    height: '42px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1.2rem'
  },
  narrative: {
    margin: 0,
    fontSize: '0.95rem',
    lineHeight: '1.5',
    color: 'var(--text)'
  },
  chipContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  chip: {
    backgroundColor: 'var(--bg)',
    border: '1px solid var(--border)',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'var(--accent)'
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: '4px'
  },
  btn: {
    flex: 1,
    background: 'none',
    borderWidth: '1px',
    borderStyle: 'solid',
    padding: '8px 0',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'opacity 0.2s',
  }
};
