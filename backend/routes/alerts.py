import json
from fastapi import APIRouter, Query
from db.database import get_db

router = APIRouter(prefix="/alerts", tags=["alerts"])

@router.get("")
async def list_alerts(
    limit: int = Query(20, description="Max alerts to return"),
    status: str = Query("active", description="Filter by status (e.g. active)")
):
    """
    Returns list of alerts sorted by score DESC.
    Returns: list of {id, zone_id, score, signals, z_scores, narrative, status, created_at}
    """
    db = await get_db()
    cursor = await db.execute(
        "SELECT id, zone_id, score, signals, z_scores, narrative, status, created_at "
        "FROM alerts WHERE status = ? ORDER BY score DESC LIMIT ?", 
        (status, limit)
    )
    rows = await cursor.fetchall()
    
    results = []
    for r in rows:
        alert_dict = dict(r)
        # Parse JSON fields securely
        for key in ["signals", "z_scores"]:
            try:
                alert_dict[key] = json.loads(alert_dict[key])
            except (TypeError, json.JSONDecodeError):
                pass
        results.append(alert_dict)
        
    return {"alerts": results}
