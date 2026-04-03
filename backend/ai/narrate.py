from ai.claude_client import call_claude

async def narrate_alert(zone_id: str, signals: dict, z_scores: dict, score: float) -> str:
    """
    Generate a two-sentence narrative via Claude for an alert.
    
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

    narrative = await call_claude(prompt=prompt)
    return narrative.strip()
