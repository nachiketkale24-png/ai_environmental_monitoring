from ai.ollama_client import call_ollama

def _fallback_narrative(alert: dict) -> str:
    """Synchronous fallback narrative for initial database seeding operations without needing LLM"""
    signals = alert.get("signals", [])
    score = alert.get("score", 0.0)
    return f"Critical signals {signals} exceeded bounds triggering a local anomaly evaluation with computed {score:.1f} score metric."

async def narrate_alert(zone_id: str, signals: dict, z_scores: dict, score: float) -> str:
    """
    Generate a two-sentence narrative via local AI for an alert.
    
    Args:
        zone_id: String id (e.g. mh07)
        signals: Dict of raw/firing signals
        z_scores: Dict of z-scores
        score: Priority score float
        
    Returns:
        Generated 2-sentence narrative string.
    """
    prompt = f"""You are an environmental monitoring AI. In 2 sentences, describe this alert \
in plain English for a marine policy analyst. Be specific about the risk and recommend \
one action. Zone: {zone_id}, Signals: {signals}, Z-scores: {z_scores}, \
Priority score: {score}/100"""

    narrative = await call_ollama(prompt=prompt)
    return narrative.strip()
