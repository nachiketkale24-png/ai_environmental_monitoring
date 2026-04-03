"""
NEREID — Zones Route
GET /zones  →  GeoJSON zone data with current status color
"""

import json
from pathlib import Path
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from db.database import get_db
from config import DATA_DIR

router = APIRouter(prefix="/zones", tags=["zones"])

_geojson_cache: dict | None = None


def _load_geojson() -> dict:
    """Load zones.geojson from the data directory (cached)."""
    global _geojson_cache
    if _geojson_cache is None:
        geojson_path = Path(DATA_DIR) / "zones.geojson"
        with open(geojson_path, "r") as f:
            _geojson_cache = json.load(f)
    return _geojson_cache


@router.get("")
async def get_zones():
    """
    Return GeoJSON FeatureCollection with each zone's latest status
    derived from the most recent alert score.
    """
    geojson = _load_geojson()
    db = await get_db()

    # Get latest alert score per zone for status colouring
    cursor = await db.execute("""
        SELECT zone_id, score, status
        FROM alerts
        WHERE id IN (
            SELECT MAX(id) FROM alerts GROUP BY zone_id
        )
    """)
    latest = {row["zone_id"]: dict(row) for row in await cursor.fetchall()}

    # Enrich each feature with current status
    for feature in geojson.get("features", []):
        zone_id = feature["properties"].get("zone_id", "")
        alert_info = latest.get(zone_id, {})
        score = alert_info.get("score", 0)

        # Derive colour: green < 2σ, amber 2-3σ, red > 3σ
        if score >= 3.0:
            color = "red"
        elif score >= 2.0:
            color = "amber"
        else:
            color = "green"

        feature["properties"]["current_score"] = score
        feature["properties"]["current_status"] = alert_info.get("status", "normal")
        feature["properties"]["color"] = color

    return JSONResponse(content=geojson)
