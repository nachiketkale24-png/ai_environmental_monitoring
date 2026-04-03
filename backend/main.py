"""
NEREID — Environmental Monitoring System
FastAPI application entry-point.

Neural Environmental Risk Evaluation & Incident Detection
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from db.database import close_db, get_db
from db.models import init_db
from data.seed_alerts import seed
from routes.alerts import router as alerts_router
from routes.zones import router as zones_router
from routes.signals import router as signals_router
from routes.query import router as query_router
from routes.feedback import router as feedback_router


# ---------------------------------------------------------------------------
# Lifespan: startup / shutdown hooks
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── Startup ──
    await init_db()
    
    db = await get_db()
    cursor = await db.execute("SELECT COUNT(*) as cnt FROM alerts")
    row = await cursor.fetchone()
    if row and row['cnt'] == 0:
        import threading
        t = threading.Thread(target=seed)
        t.start()
        t.join()
        
    yield
    # ── Shutdown ──
    await close_db()


# ---------------------------------------------------------------------------
# Application
# ---------------------------------------------------------------------------
app = FastAPI(
    title="NEREID",
    description="Neural Environmental Risk Evaluation & Incident Detection",
    version="0.1.0",
    lifespan=lifespan,
)

# ── CORS ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register Routes ──
app.include_router(alerts_router)
app.include_router(zones_router)
app.include_router(signals_router)
app.include_router(query_router)
app.include_router(feedback_router)

# ── Mount Static Files ──
static_path = os.path.join(os.path.dirname(__file__), "data", "signals")
if os.path.exists(static_path):
    app.mount("/data/signals", StaticFiles(directory=static_path), name="signals")


# ---------------------------------------------------------------------------
# Health-check
# ---------------------------------------------------------------------------
@app.get("/health", tags=["system"])
async def health_check():
    db = await get_db()
    cursor = await db.execute("SELECT COUNT(*) as cnt FROM alerts")
    row = await cursor.fetchone()
    return {"status": "ok", "service": "NEREID", "alerts_count": row['cnt'] if row else 0}


# ---------------------------------------------------------------------------
# Run with:  python main.py   or   uvicorn main:app --reload
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
