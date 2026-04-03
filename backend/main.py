"""
NEREID — Environmental Monitoring System
FastAPI application entry-point.

Neural Environmental Risk Evaluation & Incident Detection
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db.database import close_db
from db.models import init_db
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


# ---------------------------------------------------------------------------
# Health-check
# ---------------------------------------------------------------------------
@app.get("/health", tags=["system"])
async def health_check():
    return {"status": "ok", "service": "NEREID"}


# ---------------------------------------------------------------------------
# Run with:  python main.py   or   uvicorn main:app --reload
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
