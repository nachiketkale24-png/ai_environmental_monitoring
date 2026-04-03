export default function TimeSlider({ value, onChange }) {
  // value represents "days ago". 0 = Today, 29 = 30 days ago.
  
  const handleInput = (e) => {
    onChange(parseInt(e.target.value, 10));
  };

  const getLabel = () => {
    if (value === 0) return "Today";
    if (value === 1) return "1 Day Ago";
    return `${value} Days Ago`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h4 style={styles.title}>TIME SCRUBBER</h4>
        <span style={styles.currentVal}>{getLabel()}</span>
      </div>
      
      <input 
        type="range" 
        min="0" 
        max="29" 
        value={value} 
        onChange={handleInput}
        style={styles.slider}
        className="time-slider"
      />
      
      <div style={styles.footer}>
        <span>← 30 Days Ago</span>
        <span>Today →</span>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '16px 0',
    borderTop: '1px solid var(--border)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  title: {
    margin: 0,
    fontSize: '0.85rem',
    color: 'var(--text-dim)',
    letterSpacing: '1px'
  },
  currentVal: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    color: 'var(--accent)'
  },
  slider: {
    width: '100%',
    cursor: 'pointer',
    accentColor: 'var(--accent)'
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '8px',
    fontSize: '0.75rem',
    color: 'var(--text-dim)'
  }
};
