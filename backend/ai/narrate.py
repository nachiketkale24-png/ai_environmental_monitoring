"""
NEREID — AI Narration
Converts alert JSON → plain-English narrative via Claude.
"""

import json
from ai.claude_client import ask_claude

SYSTEM_PROMPT = """You are NEREID, an environmental monitoring AI assistant.
Your role is to translate raw anomaly data into clear, actionable narratives
for coastal management operators.

Rules:
- Write in plain English, 2-3 sentences max
- State the zone, the signals involved, and the severity
- Include a recommended action if severity is high (z-score > 3)
- Be factual — never speculate beyond the data
- Use ISO dates when referencing time
"""


async def narrate_alert(alert: dict) -> str:
    """
    Generate a plain-English narrative for an alert.

    Args:
        alert: Dict with keys: zone_id, score, signals, z_scores, created_at

    Returns:
        Human-readable narrative string.
    """
    user_msg = f"""Generate a brief operator narrative for this environmental alert:

Zone: {alert.get('zone_id', 'unknown')}
Priority Score: {alert.get('score', 0):.2f}
Signals Firing: {json.dumps(alert.get('signals', []))}
Z-Scores: {json.dumps(alert.get('z_scores', {}))}
Detected: {alert.get('created_at', 'unknown')}
"""

    try:
        narrative = await ask_claude(SYSTEM_PROMPT, user_msg, max_tokens=256)
        return narrative.strip()
    except Exception as e:
        # Fallback: deterministic narrative if Claude is unavailable
        return _fallback_narrative(alert)


def _fallback_narrative(alert: dict) -> str:
    """Generate a basic narrative without AI when Claude is unavailable."""
    zone = alert.get("zone_id", "unknown")
    score = alert.get("score", 0)
    signals = alert.get("signals", [])

    severity = "Critical" if score >= 3.0 else "Elevated" if score >= 2.0 else "Minor"
    sig_text = ", ".join(signals) if signals else "multiple signals"

    return (
        f"{severity} anomaly detected in zone {zone} "
        f"(score: {score:.2f}) involving {sig_text}. "
        f"Review recommended."
    )
