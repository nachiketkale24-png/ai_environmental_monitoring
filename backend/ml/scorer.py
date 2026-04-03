"""
NEREID — ML Priority Scorer
Composite score = severity × trend × recency, weighted by zone sensitivity.
"""

import numpy as np
from datetime import datetime, timedelta


def compute_priority_score(
    z_scores: dict[str, float],
    trend_slopes: dict[str, float] | None = None,
    event_time: datetime | None = None,
    sensitivity_weight: float = 1.0,
) -> float:
    """
    Compute a composite priority score for an alert.

    score = magnitude_z × trend_factor × recency_weight × sensitivity_weight

    Args:
        z_scores: Dict mapping signal name → latest z-score.
        trend_slopes: Optional dict mapping signal → slope of z-score trend.
        event_time: Timestamp of the anomaly detection.
        sensitivity_weight: Zone-specific Bayesian weight (default 1.0).

    Returns:
        Composite priority score (higher = more urgent).
    """
    if not z_scores:
        return 0.0

    # ── Magnitude component: RMS of all signal z-scores ──
    z_vals = np.array(list(z_scores.values()))
    magnitude = float(np.sqrt(np.mean(z_vals ** 2)))

    # ── Trend component: are anomalies getting worse? ──
    trend_factor = 1.0
    if trend_slopes:
        avg_slope = np.mean(list(trend_slopes.values()))
        # Amplify score if trend is worsening (positive slope = increasing deviance)
        trend_factor = 1.0 + max(0, avg_slope) * 0.5

    # ── Recency component: exponential decay over 7 days ──
    recency_weight = 1.0
    if event_time:
        age_hours = (datetime.utcnow() - event_time).total_seconds() / 3600
        recency_weight = float(np.exp(-age_hours / (7 * 24)))  # τ = 7 days

    score = magnitude * trend_factor * recency_weight * sensitivity_weight
    return round(score, 4)


def rank_alerts(alerts: list[dict]) -> list[dict]:
    """Sort alert dicts by 'score' descending."""
    return sorted(alerts, key=lambda a: a.get("score", 0), reverse=True)
