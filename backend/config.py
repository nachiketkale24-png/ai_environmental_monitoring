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

OLLAMA_URL: str = os.getenv("OLLAMA_URL", "http://localhost:11434")
OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "gemma:2b")
DATABASE_URL: str = os.getenv("DATABASE_URL", "db/nereid.db")
DATA_DIR: str = os.getenv("DATA_DIR", str(Path(__file__).resolve().parent / "data"))

