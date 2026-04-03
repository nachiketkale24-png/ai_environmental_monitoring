import { useState } from 'react';
import axios from 'axios';
import { Sun, Moon, Search } from 'lucide-react';
import './theme.css';

const API_BASE = "http://localhost:8000";

export default function Navbar({ darkMode, setDarkMode }) {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleQuery = async (e) => {
    if (e.key === 'Enter' && query.trim()) {
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
    <div style={styles.nav}>
      <div style={styles.left}>
        <span style={styles.logo}>🌊 NEREID</span>
      </div>

      <div style={styles.center}>
        <div style={styles.searchContainer}>
          <Search size={18} color="var(--text-dim)" style={{marginLeft: 12}} />
          <input 
            type="text" 
            placeholder="What needs attention right now?" 
            style={styles.input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleQuery}
            disabled={loading}
          />
        </div>
        
        {/* Dropdown for response */}
        {response && (
          <div style={styles.responseDropdown}>
            <div style={styles.responseHeader}>
              <strong>Ask NEREID</strong>
              <button 
                onClick={() => setResponse(null)} 
                style={{background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer'}}
              >
                ✕
              </button>
            </div>
            <p style={{fontSize: '0.9rem', lineHeight: '1.5', margin: 0, whiteSpace: 'pre-wrap'}}>{response}</p>
          </div>
        )}
      </div>

      <div style={styles.right}>
        <button 
          onClick={() => setDarkMode(!darkMode)}
          style={styles.themeToggle}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </div>
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
  logo: {
    color: 'var(--accent)',
    fontFamily: '"Syne", sans-serif',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    letterSpacing: '1px'
  },
  center: { 
    width: '50%',
    display: 'flex',
    justifyContent: 'center',
    position: 'relative'
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'var(--bg)',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    width: '100%',
    maxWidth: '500px',
    height: '36px',
    transition: 'border 0.2s',
  },
  input: {
    flex: 1,
    background: 'none',
    border: 'none',
    color: 'var(--text)',
    padding: '0 12px',
    fontSize: '0.9rem',
    outline: 'none',
  },
  right: { 
    width: '25%', 
    display: 'flex', 
    justifyContent: 'flex-end' 
  },
  themeToggle: {
    background: 'none',
    border: 'none',
    color: 'var(--text)',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
  },
  responseDropdown: {
    position: 'absolute',
    top: '45px',
    width: '100%',
    maxWidth: '500px',
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
    zIndex: 1001,
  },
  responseHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    color: 'var(--accent)',
    fontSize: '0.85rem',
    textTransform: 'uppercase'
  }
};
