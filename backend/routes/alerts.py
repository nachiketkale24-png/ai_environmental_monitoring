"""
NEREID — Alerts Route
GET /alerts  →  ranked alert list sorted by priority score DESC
"""

import json
from fastapi import APIRouter, Query
from db.database import get_db

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.get("")
async def get_alerts(
    status: str | None = Query(None, description="Filter by status: active, dismissed, validated"),
    zone_id: str | None = Query(None, description="Filter by zone ID"),
    limit: int = Query(50, ge=1, le=200),
):
    """Return alerts ranked by priority score (descending)."""
    db = await get_db()

    query = "SELECT * FROM alerts WHERE 1=1"
    params: list = []

    if status:
        query += " AND status = ?"
        params.append(status)
    if zone_id:
        query += " AND zone_id = ?"
        params.append(zone_id)

    query += " ORDER BY score DESC LIMIT ?"
    params.append(limit)

    cursor = await db.execute(query, params)
    rows = await cursor.fetchall()

    alerts = []
    for row in rows:
        alert = dict(row)
        # Parse JSON strings back to lists
        for field in ("signals", "z_scores"):
            if alert.get(field):
                try:
                    alert[field] = json.loads(alert[field])
                except (json.JSONDecodeError, TypeError):
                    pass
        alerts.append(alert)

    return {"alerts": alerts, "count": len(alerts)}


@router.get("/{alert_id}")
async def get_alert(alert_id: int):
    """Return a single alert by ID."""
    db = await get_db()
    cursor = await db.execute("SELECT * FROM alerts WHERE id = ?", [alert_id])
    row = await cursor.fetchone()

    if not row:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Alert not found")

    alert = dict(row)
    for field in ("signals", "z_scores"):
        if alert.get(field):
            try:
                alert[field] = json.loads(alert[field])
            except (json.JSONDecodeError, TypeError):
                pass

    return alert
