from pydantic import BaseModel
from fastapi import APIRouter
import json
from db.database import get_db
from ai.query_handler import handle_operator_query

router = APIRouter(prefix="/query", tags=["query"])

class QueryRequest(BaseModel):
    query: str

@router.post("")
async def submit_query(body: QueryRequest):
    """
    Receives NLP `query`, extracts top 5 active DB alerts as context,
    runs them through Claude via `query_handler`, and returns text natively. 
    """
    db = await get_db()
    cursor = await db.execute(
        "SELECT zone_id, score, signals, narrative "
        "FROM alerts WHERE status = 'active' ORDER BY score DESC LIMIT 5"
    )
    rows = await cursor.fetchall()
    
    # Format out rows into clean dicts to serialize context properly
    alerts = []
    for r in rows:
        a_dict = dict(r)
        if isinstance(a_dict.get('signals'), str):
            try:
                a_dict['signals'] = json.loads(a_dict['signals'])
            except json.JSONDecodeError:
                pass
        alerts.append(a_dict)
        
    response_text = await handle_operator_query(body.query, alerts)
    
    return {"response": response_text}
