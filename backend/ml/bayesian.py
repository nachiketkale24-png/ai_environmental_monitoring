"""
NEREID — ML Bayesian Sensitivity Updater
Updates per-zone sensitivity weights based on operator feedback.
"""

from db.database import get_db


# Prior parameters for Beta distribution approximation
_ALPHA_INIT = 1.0  # prior hits
_BETA_INIT = 1.0   # prior misses


async def get_sensitivity(zone_id: str) -> float:
    """Get the current sensitivity weight for a zone."""
    db = await get_db()
    cursor = await db.execute(
        "SELECT weight FROM zone_sensitivity WHERE zone_id = ?", [zone_id]
    )
    row = await cursor.fetchone()
    return float(row["weight"]) if row else 1.0


async def update_sensitivity(zone_id: str, verdict: str) -> float:
    """
    Update zone sensitivity weight based on feedback.

    Logic (simplified Bayesian update):
      - 'validated' feedback  → increase weight (zone is genuinely sensitive)
      - 'false_positive'      → decrease weight (zone signals are noisy)

    The weight is maintained as a ratio:
        weight = validated_count / (validated_count + false_positive_count)
    scaled so that a 50/50 zone stays at 1.0.

    Returns:
        New sensitivity weight.
    """
    db = await get_db()

    # Count historical feedback for this zone
    cursor = await db.execute("""
        SELECT
            SUM(CASE WHEN f.verdict = 'validated' THEN 1 ELSE 0 END) AS hits,
            SUM(CASE WHEN f.verdict = 'false_positive' THEN 1 ELSE 0 END) AS misses
        FROM feedback f
        JOIN alerts a ON f.alert_id = a.id
        WHERE a.zone_id = ?
    """, [zone_id])
    row = await cursor.fetchone()

    hits = (row["hits"] or 0) + _ALPHA_INIT
    misses = (row["misses"] or 0) + _BETA_INIT

    # Bayesian posterior mean of Beta(α, β) = α / (α + β)
    # Scale to [0.2, 2.0] so weights never collapse to zero
    raw_weight = hits / (hits + misses)
    weight = round(0.2 + raw_weight * 1.8, 4)  # maps [0,1] → [0.2, 2.0]

    # Upsert
    await db.execute("""
        INSERT INTO zone_sensitivity (zone_id, weight) VALUES (?, ?)
        ON CONFLICT(zone_id) DO UPDATE SET weight = excluded.weight
    """, [zone_id, weight])
    await db.commit()

    return weight
