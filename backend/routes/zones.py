import json
from pathlib import Path
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from db.database import get_db

router = APIRouter(prefix="/zones", tags=["zones"])

@router.get("")
async def get_zones():
    """
    Reads zones.geojson and binds the highest scoring active alert status 
    color per zone.
    """
    # Load GeoJSON purely for static physical geometries
    data_path = Path(__file__).resolve().parent.parent / "data" / "zones.geojson"
    if not data_path.exists():
        return JSONResponse({"error": "GeoJSON missing"}, status_code=500)
        
    with open(data_path, "r", encoding="utf-8") as f:
        geojson = json.load(f)
        
    db = await get_db()
    
    # Extract only the active highest score per zone
    cursor = await db.execute("""
        SELECT zone_id, MAX(score) as max_score
        FROM alerts
        WHERE status = 'active'
        GROUP BY zone_id
    """)
    rows = await cursor.fetchall()
    zone_scores = {row["zone_id"]: float(row["max_score"]) for row in rows}
    
    for feature in geojson.get("features", []):
        z_id = feature["properties"]["zone_id"]
        score = zone_scores.get(z_id, 0.0)
        
        # 'red'|'amber'|'green'
        if score >= 60.0:
            status_color = 'red'
        elif score >= 35.0:
            status_color = 'amber'
        else:
            status_color = 'green'
            
        feature["properties"]["current_score"] = score
        feature["properties"]["status_color"] = status_color
        
    return JSONResponse(content=geojson)
