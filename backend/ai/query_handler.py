import json
from ai.claude_client import call_claude

SYSTEM_PROMPT = """You are NEREID, an AI environmental intelligence assistant. \
You help marine policy analysts understand which environmental zones \
need attention. Always be concise, specific, and action-oriented. \
Format: rank zones by urgency, explain why, recommend one action per zone."""

async def handle_operator_query(query: str, alerts: list[dict]) -> str:
    """
    Handles a query by formatting active alerts as context and querying Claude.
    
    Args:
        query: User NLP query.
        alerts: Top 5 alert context dictionaries.
        
    Returns:
        Structured Claude string response.
    """
    if not alerts:
        context_str = "No active alerts currently reported in the system."
    else:
        context_items = []
        for i, a in enumerate(alerts):
            context_items.append(
                f"[{i+1}] Zone: {a.get('zone_id', 'Unknown')}, "
                f"Score: {float(a.get('score', 0.0)):.2f}, "
                f"Signals: {a.get('signals', [])}, "
                f"Narrative: {a.get('narrative', '')}"
            )
        context_str = "\n".join(context_items)

    user_prompt = (
        f"User Query: {query}\n\n"
        f"Current Top Alerts Context:\n{context_str}\n\n"
        f"Please provide an analysis based on this context and the system instructions."
    )
    
    response_text = await call_claude(prompt=user_prompt, system=SYSTEM_PROMPT)
    return response_text
