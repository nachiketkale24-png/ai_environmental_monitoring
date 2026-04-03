"""
NEREID — Claude API Client
Anthropic API wrapper with retry logic.
"""

import anthropic
from config import ANTHROPIC_API_KEY, ANTHROPIC_MODEL

_client: anthropic.AsyncAnthropic | None = None


def get_client() -> anthropic.AsyncAnthropic:
    """Return a singleton async Anthropic client."""
    global _client
    if _client is None:
        if not ANTHROPIC_API_KEY:
            raise RuntimeError(
                "ANTHROPIC_API_KEY not configured. "
                "Set it in the .env file at the project root."
            )
        _client = anthropic.AsyncAnthropic(api_key=ANTHROPIC_API_KEY)
    return _client


async def ask_claude(
    system_prompt: str,
    user_message: str,
    max_tokens: int = 1024,
    temperature: float = 0.3,
) -> str:
    """
    Send a message to Claude and return the text response.

    Args:
        system_prompt: System-level instruction for Claude.
        user_message: The user's query or data payload.
        max_tokens: Maximum response length.
        temperature: Creativity control (lower = more deterministic).

    Returns:
        Claude's text response.
    """
    client = get_client()
    response = await client.messages.create(
        model=ANTHROPIC_MODEL,
        max_tokens=max_tokens,
        system=system_prompt,
        messages=[{"role": "user", "content": user_message}],
        temperature=temperature,
    )
    return response.content[0].text
