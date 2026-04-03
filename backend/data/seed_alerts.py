"""
NEREID — Seed Alerts
Pre-computes initial alert set by running ML pipeline on signal CSVs.
Run this once after generating signal data:  python -m data.seed_alerts
"""

import asyncio
import json
import sys
from pathlib import Path

# Ensure backend root is on path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from db.database import get_db, close_db
from db.models import init_db
from ml.zscore import latest_zscore
from ml.convergence import check_convergence
from ml.scorer import compute_priority_score
from ai.narrate import _fallback_narrative
import pandas as pd

DATA_DIR = Path(__file__).resolve().parent
SIGNALS_DIR = DATA_DIR / "signals"

ZONES = ["mh07", "mh12", "mh15", "gj03", "gj08", "ka02"]
SIGNAL_TYPES = ["sst", "chl", "wind"]


async def seed():
    """Run ML pipeline on all zones and insert initial alerts."""
    await init_db()
    db = await get_db()

    # Clear existing alerts for re-seeding
    await db.execute("DELETE FROM alerts")
    await db.commit()

    alert_count = 0
    for zone in ZONES:
        z_scores: dict[str, float] = {}

        for sig in SIGNAL_TYPES:
            csv_path = SIGNALS_DIR / f"{zone}_{sig}.csv"
            if not csv_path.exists():
                print(f"  ⚠️  Missing {csv_path.name}, skipping")
                continue

            df = pd.read_csv(csv_path, parse_dates=["ds"])
            z = latest_zscore(df["y"].values)
            z_scores[sig] = round(z, 4)

        # Check convergence gate
        conv = check_convergence(z_scores)

        if conv["converged"]:
            score = compute_priority_score(z_scores)
            signals = conv["firing_signals"]

            alert = {
                "zone_id": zone,
                "score": score,
                "signals": signals,
                "z_scores": z_scores,
            }
            narrative = _fallback_narrative(alert)

            await db.execute(
                """INSERT INTO alerts (zone_id, score, signals, z_scores, narrative)
                   VALUES (?, ?, ?, ?, ?)""",
                [
                    zone,
                    score,
                    json.dumps(signals),
                    json.dumps(z_scores),
                    narrative,
                ],
            )
            alert_count += 1
            print(f"  🚨 Alert for {zone}: score={score:.4f}, "
                  f"signals={signals}, z={z_scores}")
        else:
            print(f"  ✅ {zone}: no convergence (z={z_scores})")

    # Initialise zone sensitivity weights
    for zone in ZONES:
        await db.execute(
            """INSERT OR IGNORE INTO zone_sensitivity (zone_id, weight)
               VALUES (?, 1.0)""",
            [zone],
        )

    await db.commit()
    await close_db()
    print(f"\n✅ Seeded {alert_count} alerts across {len(ZONES)} zones.")


if __name__ == "__main__":
    asyncio.run(seed())
