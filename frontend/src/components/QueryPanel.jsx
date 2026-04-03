import React, { useState } from 'react';
import useQuery from '../hooks/useQuery';

export default function QueryPanel() {
  const [question, setQuestion] = useState('');
  const { response, loading, submitQuery } = useQuery();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      submitQuery(question);
    }
  };

  return (
    <div className="query-panel glass-card" id="query-panel">
      <h3 className="query-panel__title">🤖 Ask NEREID</h3>
      <form className="query-panel__form" onSubmit={handleSubmit}>
        <input
          id="query-input"
          type="text"
          placeholder="What needs attention?"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          className="query-panel__input"
          disabled={loading}
        />
        <button
          id="query-submit"
          type="submit"
          className="query-panel__btn"
          disabled={loading || !question.trim()}
        >
          {loading ? '⏳' : '→'}
        </button>
      </form>
      {response && (
        <div className="query-panel__response">
          <p>{response.answer}</p>
          {response.referenced_alerts?.length > 0 && (
            <span className="query-panel__refs">
              Refs: {response.referenced_alerts.join(', ')}
            </span>
          )}
        </div>
      )}

      <style>{`
        .query-panel {
          padding: 1rem;
        }
        .query-panel__title {
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }
        .query-panel__form {
          display: flex;
          gap: 0.5rem;
        }
        .query-panel__input {
          flex: 1;
          padding: 0.5rem 0.75rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          font-family: inherit;
          font-size: 0.85rem;
          outline: none;
          transition: border-color var(--transition-fast);
        }
        .query-panel__input:focus { border-color: var(--accent-cyan); }
        .query-panel__input::placeholder { color: var(--text-muted); }
        .query-panel__btn {
          padding: 0.5rem 1rem;
          background: linear-gradient(135deg, var(--accent-cyan), var(--accent-teal));
          border: none;
          border-radius: var(--radius-sm);
          color: #0a0f1c;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: opacity var(--transition-fast);
        }
        .query-panel__btn:hover { opacity: 0.9; }
        .query-panel__btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .query-panel__response {
          margin-top: 0.75rem;
          padding: 0.75rem;
          background: var(--gradient-card);
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        .query-panel__refs {
          display: block;
          margin-top: 0.5rem;
          font-size: 0.7rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
