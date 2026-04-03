export default function QueryPanel({ queryResponse, loading, onClose, onZoneChipClick }) {
  // Regex to find zone patterns like MH-07, mh07, gj-03, etc.
  const zoneRegex = /\b(mh-?07|mh-?12|mh-?15|gj-?03|gj-?08|ka-?02)\b/gi;

  const renderTextWithChips = (text) => {
    if (!text) return null;
    const parts = text.split(zoneRegex);
    return parts.map((part, i) => {
      if (part.match(zoneRegex)) {
        const cleanZone = part.replace('-', '').toLowerCase();
        return (
          <button 
            key={i} 
            style={styles.chip} 
            onClick={() => onZoneChipClick(cleanZone)}
          >
            {part.toUpperCase()}
          </button>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.panel} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <strong style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Ask NEREID
          </strong>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>
        
        <div style={styles.content}>
          {loading ? (
            <div style={styles.loadingContainer}>
              <span className="typing-dots">Analyzing all zones...</span>
            </div>
          ) : (
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '0.95rem' }}>
              {renderTextWithChips(queryResponse)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'absolute',
    top: '56px',
    left: 0,
    width: '100%',
    height: 'calc(100vh - 56px)',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 999,
  },
  panel: {
    width: '100%',
    backgroundColor: 'var(--surface)',
    borderBottom: '1px solid var(--border)',
    padding: '24px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    maxHeight: '400px',
    overflowY: 'auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-dim)',
    cursor: 'pointer',
    fontSize: '1.2rem'
  },
  content: {
    color: 'var(--text)'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100px',
    color: 'var(--accent)',
    fontStyle: 'italic'
  },
  chip: {
    background: 'var(--accent)',
    color: 'var(--bg)',
    border: 'none',
    borderRadius: '12px',
    padding: '2px 8px',
    margin: '0 4px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};
