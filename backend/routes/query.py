"""
NEREID — Query Route
POST /query  →  Claude NL query handler ("What needs attention?")
"""

from fastapi import APIRouter
from pydantic import BaseModel
from ai.query_handler import handle_query

router = APIRouter(prefix="/query", tags=["query"])


class QueryRequest(BaseModel):
    question: str
    context: dict | None = None  # optional zone/time filters


class QueryResponse(BaseModel):
    answer: str
    referenced_alerts: list[int] = []
    confidence: float = 0.0


@router.post("", response_model=QueryResponse)
async def query_claude(request: QueryRequest):
    """
    Accept a natural-language question from the operator,
    run it through Claude with context from the alert store,
    and return a ranked explanation.
    """
    result = await handle_query(request.question, request.context)
    return result
