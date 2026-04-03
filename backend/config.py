"""
NEREID — Configuration
Loads environment variables from .env file.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from project root (one level up from backend/)
_env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(_env_path)

ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
ANTHROPIC_MODEL: str = os.getenv("ANTHROPIC_MODEL", "claude-sonnet-4-20250514")
DATABASE_URL: str = os.getenv("DATABASE_URL", "db/nereid.db")
DATA_DIR: str = os.getenv("DATA_DIR", str(Path(__file__).resolve().parent / "data"))

if not ANTHROPIC_API_KEY:
    print("⚠️  WARNING: ANTHROPIC_API_KEY is not set. AI features will be unavailable.")
