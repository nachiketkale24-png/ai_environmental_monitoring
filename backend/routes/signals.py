"""
NEREID — Signals Route
GET /signals/{zone_id}  →  time-series data for charts
"""

from pathlib import Path
from fastapi import APIRouter, Query, HTTPException
import pandas as pd
from config import DATA_DIR

router = APIRouter(prefix="/signals", tags=["signals"])


def _load_signal(zone_id: str, signal_type: str) -> pd.DataFrame:
    """Load a signal CSV for a given zone."""
    filename = f"{zone_id}_{signal_type}.csv"
    filepath = Path(DATA_DIR) / "signals" / filename
    if not filepath.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Signal file not found: {filename}"
        )
    df = pd.read_csv(filepath, parse_dates=["ds"])
    return df


@router.get("/{zone_id}")
async def get_signals(
    zone_id: str,
    signal: str | None = Query(None, description="Signal type: sst, chl, wind"),
    days: int = Query(30, ge=1, le=180, description="Number of days of history"),
):
    """
    Return time-series signal data for a zone.
    If no signal type specified, returns all available signals.
    """
    signal_types = [signal] if signal else ["sst", "chl", "wind"]
    result: dict = {"zone_id": zone_id, "signals": {}}

    for sig in signal_types:
        try:
            df = _load_signal(zone_id, sig)
        except HTTPException:
            continue

        # Filter to requested day range
        if not df.empty:
            cutoff = df["ds"].max() - pd.Timedelta(days=days)
            df = df[df["ds"] >= cutoff]

        result["signals"][sig] = {
            "dates": df["ds"].dt.strftime("%Y-%m-%d").tolist(),
            "values": df["y"].tolist(),
        }

    if not result["signals"]:
        raise HTTPException(
            status_code=404,
            detail=f"No signal data found for zone {zone_id}"
        )

    return result
