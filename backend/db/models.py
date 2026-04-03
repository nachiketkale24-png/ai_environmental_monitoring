"""
NEREID — Database Models / Schema
Defines and initialises the SQLite tables used by the system.
"""

from db.database import get_db

SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS alerts (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    zone_id     TEXT    NOT NULL,
    score       REAL    NOT NULL,
    signals     TEXT,
    z_scores    TEXT,
    narrative   TEXT,
    status      TEXT    NOT NULL DEFAULT 'active',
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS feedback (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    alert_id    INTEGER NOT NULL REFERENCES alerts(id),
    verdict     TEXT    NOT NULL,
    timestamp   TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS zone_sensitivity (
    zone_id     TEXT    PRIMARY KEY,
    weight      REAL    NOT NULL DEFAULT 1.0
);
"""


async def init_db() -> None:
    """Create all tables if they do not already exist."""
    db = await get_db()
    await db.executescript(SCHEMA_SQL)
    await db.commit()
    print("✅ NEREID database initialised.")
