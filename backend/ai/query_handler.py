"""
NEREID — AI Query Handler
"What needs attention?" → ranked explanation from Claude.
"""

import json
from ai.claude_client import ask_claude
from db.database import get_db

SYSTEM_PROMPT = """You are NEREID, an environmental monitoring AI assistant.
An operator is asking you a question about the current state of coastal zones.

You have access to the alert store data provided below. Use it to give a
concise, ranked answer. Prioritise the highest-scoring active alerts.

Rules:
- Answer in 3-5 sentences max
- Reference specific zones and scores
- If no alerts match the question, say so clearly
- Never fabricate data — only reference what is provided
- End with a suggested next action
"""


async def handle_query(question: str, context: dict | None = None) -> dict:
    """
    Handle a natural-language query by retrieving relevant alerts
    and asking Claude to synthesise an answer.

    Returns:
        Dict with: answer (str), referenced_alerts (list[int]), confidence (float)
    """
    db = await get_db()

    # Fetch top active alerts as context for Claude
    cursor = await db.execute(
        "SELECT * FROM alerts WHERE status = 'active' ORDER BY score DESC LIMIT 20"
    )
    rows = await cursor.fetchall()
    alerts = [dict(r) for r in rows]

    if not alerts:
        return {
            "answer": "No active alerts at this time. All zones are operating within normal parameters.",
            "referenced_alerts": [],
            "confidence": 1.0,
        }

    # Build context payload
    alert_summary = json.dumps(alerts, indent=2, default=str)
    user_msg = f"""Operator question: {question}

Current active alerts (ranked by priority):
{alert_summary}
"""

    if context:
        user_msg += f"\nAdditional filters: {json.dumps(context)}"

    try:
        answer = await ask_claude(SYSTEM_PROMPT, user_msg, max_tokens=512)
        referenced = [a["id"] for a in alerts[:5]]  # top 5 most relevant
        return {
            "answer": answer.strip(),
            "referenced_alerts": referenced,
            "confidence": 0.85,
        }
    except Exception as e:
        # Fallback: return a summary of top alerts
        top = alerts[:3]
        summary_lines = []
        for a in top:
            summary_lines.append(
                f"Zone {a['zone_id']}: score {a['score']:.2f} — {a.get('status', 'active')}"
            )
        return {
            "answer": (
                f"AI narration unavailable ({str(e)}). "
                f"Top alerts:\n" + "\n".join(summary_lines)
            ),
            "referenced_alerts": [a["id"] for a in top],
            "confidence": 0.5,
        }
