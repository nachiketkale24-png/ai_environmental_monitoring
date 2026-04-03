import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [theme, setTheme] = useState('dark');
  const [query, setQuery] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <nav className="navbar glass-card" id="main-navbar">
      <div className="navbar__brand">
        <span className="navbar__logo">🌊</span>
        <h1 className="navbar__title">NEREID</h1>
        <span className="navbar__subtitle">Environmental Monitor</span>
      </div>
      <div className="navbar__search">
        <input
          id="navbar-search"
          type="text"
          placeholder="What needs attention?"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="navbar__input"
        />
      </div>
      <div className="navbar__actions">
        <button
          id="theme-toggle"
          className="navbar__btn"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      <style>{`
        .navbar {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 0.75rem 1.5rem;
          position: sticky;
          top: 0;
          z-index: 1000;
          border-radius: 0;
          border-top: none;
          border-left: none;
          border-right: none;
        }
        .navbar__brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .navbar__logo { font-size: 1.5rem; }
        .navbar__title {
          font-size: 1.25rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--accent-cyan), var(--accent-teal));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .navbar__subtitle {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 400;
        }
        .navbar__search { flex: 1; max-width: 500px; }
        .navbar__input {
          width: 100%;
          padding: 0.5rem 1rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          color: var(--text-primary);
          font-family: inherit;
          font-size: 0.875rem;
          outline: none;
          transition: border-color var(--transition-fast);
        }
        .navbar__input:focus {
          border-color: var(--accent-cyan);
        }
        .navbar__input::placeholder {
          color: var(--text-muted);
        }
        .navbar__btn {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 0.5rem 0.75rem;
          cursor: pointer;
          font-size: 1.1rem;
          transition: all var(--transition-fast);
        }
        .navbar__btn:hover {
          border-color: var(--accent-cyan);
          box-shadow: var(--shadow-glow);
        }
      `}</style>
    </nav>
  );
}
