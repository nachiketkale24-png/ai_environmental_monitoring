import React from 'react';

export default function FeedbackButtons({ alertId }) {
  const handleFeedback = async (verdict, e) => {
    e.stopPropagation(); // Don't trigger card click
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alert_id: alertId, verdict }),
      });
    } catch (err) {
      console.error('Feedback failed:', err);
    }
  };

  return (
    <div className="feedback-btns" id={`feedback-${alertId}`}>
      <button
        className="feedback-btn feedback-btn--validate"
        onClick={(e) => handleFeedback('validated', e)}
        title="Mark as validated"
      >
        ✓
      </button>
      <button
        className="feedback-btn feedback-btn--dismiss"
        onClick={(e) => handleFeedback('false_positive', e)}
        title="Mark as false positive"
      >
        ✗
      </button>

      <style>{`
        .feedback-btns {
          display: flex;
          gap: 0.35rem;
        }
        .feedback-btn {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-color);
          border-radius: 50%;
          background: transparent;
          font-size: 0.7rem;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .feedback-btn--validate {
          color: var(--alert-green);
        }
        .feedback-btn--validate:hover {
          background: rgba(34, 197, 94, 0.15);
          border-color: var(--alert-green);
        }
        .feedback-btn--dismiss {
          color: var(--alert-red);
        }
        .feedback-btn--dismiss:hover {
          background: rgba(239, 68, 68, 0.15);
          border-color: var(--alert-red);
        }
      `}</style>
    </div>
  );
}
