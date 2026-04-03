"""
NEREID — Feedback Route
POST /feedback  →  operator validates or dismisses an alert
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db.database import get_db
from ml.bayesian import update_sensitivity

router = APIRouter(prefix="/feedback", tags=["feedback"])


class FeedbackRequest(BaseModel):
    alert_id: int
    verdict: str  # "validated" or "false_positive"


@router.post("")
async def submit_feedback(request: FeedbackRequest):
    """
    Record operator feedback on an alert.
    Updates the alert status and triggers Bayesian sensitivity weight update.
    """
    if request.verdict not in ("validated", "false_positive"):
        raise HTTPException(
            status_code=400,
            detail="Verdict must be 'validated' or 'false_positive'"
        )

    db = await get_db()

    # Verify alert exists
    cursor = await db.execute(
        "SELECT zone_id FROM alerts WHERE id = ?", [request.alert_id]
    )
    row = await cursor.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Alert not found")

    zone_id = row["zone_id"]

    # Store feedback
    await db.execute(
        "INSERT INTO feedback (alert_id, verdict) VALUES (?, ?)",
        [request.alert_id, request.verdict],
    )

    # Update alert status
    new_status = "validated" if request.verdict == "validated" else "dismissed"
    await db.execute(
        "UPDATE alerts SET status = ? WHERE id = ?",
        [new_status, request.alert_id],
    )

    await db.commit()

    # Trigger Bayesian sensitivity update
    await update_sensitivity(zone_id, request.verdict)

    return {
        "message": f"Feedback recorded for alert {request.alert_id}",
        "new_status": new_status,
    }
