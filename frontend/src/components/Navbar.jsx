import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Sun, Moon, Search, PlayCircle } from 'lucide-react';
import QueryPanel from './QueryPanel';
import '../styles/theme.css';

const API_BASE = "http://localhost:8000";

export default function Navbar({ darkMode, setDarkMode, onZoneSelect, triggerDemoMode }) {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Focus on '/' press, prevent default to avoid typing '/'
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && showPanel) {
        setShowPanel(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPanel]);

  const handleQuery = async (e) => {
    if (e.key === 'Enter' && query.trim()) {
      setShowPanel(true);
      setLoading(true);
      try {
        const res = await axios.post(`${API_BASE}/query`, { query });
        setResponse(res.data.response);
      } catch (err) {
        setResponse("System offline or cannot connect to local AI node.");
      }
      setLoading(false);
    }
  };

  return (
    <>
      <div style={styles.nav}>
        <div style={styles.left}>
          <span style={styles.logo}>🌊 NEREID</span>
        </div>

        <div style={styles.center}>
          <div style={styles.searchContainer}>
            <Search size={18} color="var(--text-dim)" style={{marginLeft: 12}} />
            <input 
              ref={inputRef}
              type="text" 
              placeholder="What needs attention right now? (Press /)" 
              style={styles.input}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleQuery}
              onFocus={() => { if(response) setShowPanel(true); }}
            />
          </div>
        </div>

        <div style={styles.right}>
          <button 
            onClick={triggerDemoMode}
            style={styles.demoBtn}
            title="Start automated presentation sequence"
          >
            <PlayCircle size={16} style={{marginRight: '6px'}} />
            DEMO
          </button>
          
          <button 
            onClick={() => setDarkMode(!darkMode)}
            style={styles.themeToggle}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      {showPanel && (
        <QueryPanel 
          loading={loading}
          queryResponse={response}
          onClose={() => setShowPanel(false)}
          onZoneChipClick={(zoneId) => {
            onZoneSelect(zoneId);
            setShowPanel(false);
          }}
        />
      )}
    </>
  );
}

const styles = {
  nav: {
    gridArea: 'nav',
    position: 'relative',
    height: '56px',
    backgroundColor: 'var(--surface)',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    zIndex: 1000,
  },
  left: { width: '25%' },
  logo: { color: 'var(--accent)', fontFamily: '"Syne", sans-serif', fontSize: '1.25rem', fontWeight: 'bold' },
  center: { width: '50%', display: 'flex', justifyContent: 'center' },
  searchContainer: {
    display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg)',
    borderRadius: '8px', border: '1px solid var(--border)', width: '100%', maxWidth: '500px', height: '36px'
  },
  input: { flex: 1, background: 'none', border: 'none', color: 'var(--text)', padding: '0 12px', fontSize: '0.9rem', outline: 'none' },
  right: { width: '25%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' },
  themeToggle: { background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', padding: '4px' },
  demoBtn: {
    display: 'flex', alignItems: 'center', backgroundColor: 'var(--accent)', color: '#000', border: 'none',
    padding: '6px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer'
  }
};
