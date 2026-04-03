from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from db.database import get_db

router = APIRouter(prefix="/feedback", tags=["feedback"])

class FeedbackRequest(BaseModel):
    alert_id: int
    verdict: str  # 'validated' or 'false_positive'

@router.post("")
async def provide_feedback(body: FeedbackRequest):
    """
    Submits operator feedback on a specific alert, logs it into the feedback db table,
    and intelligently tweaks the `zone_sensitivity` algorithmic weight up/down by capped thresholds.
    """
    if body.verdict not in ('validated', 'false_positive'):
        raise HTTPException(status_code=400, detail="Verdict must be 'validated' or 'false_positive'")
        
    db = await get_db()
    
    # Grab the alert
    c = await db.execute("SELECT zone_id FROM alerts WHERE id = ?", (body.alert_id,))
    row = await c.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Alert not found")
        
    zone_id = row['zone_id']
    
    # 1. Update the alert to mark action completed
    await db.execute("UPDATE alerts SET status = 'resolved' WHERE id = ?", (body.alert_id,))
    
    # 2. Insert into the feedback log
    await db.execute(
        "INSERT INTO feedback (alert_id, verdict) VALUES (?, ?)", 
        (body.alert_id, body.verdict)
    )
    
    # 3. Update the zone's sensitivity ML multiplier safely
    # Query current weight or 1.0 default
    c_weight = await db.execute("SELECT weight FROM zone_sensitivity WHERE zone_id = ?", (zone_id,))
    weight_row = await c_weight.fetchone()
    current_weight = float(weight_row['weight']) if weight_row else 1.0
    
    if body.verdict == 'false_positive':
        new_weight = current_weight * 0.85
        # floor cap 0.3
        if new_weight < 0.3:
            new_weight = 0.3
    else:
        new_weight = current_weight * 1.1
        # ceiling cap 2.0
        if new_weight > 2.0:
            new_weight = 2.0
            
    await db.execute(
        "INSERT OR REPLACE INTO zone_sensitivity (zone_id, weight) VALUES (?, ?)",
        (zone_id, new_weight)
    )
    
    await db.commit()
    
    return {
        "success": True, 
        "new_weight": round(new_weight, 4)
    }
