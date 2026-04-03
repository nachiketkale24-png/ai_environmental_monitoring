from fastapi import APIRouter, Query, HTTPException
from pathlib import Path
import pandas as pd
from ml.baseline import fit_baseline
from ml.zscore import compute_zscore

router = APIRouter(prefix="/signals", tags=["signals"])

@router.get("/{zone_id}")
async def get_signals(
    zone_id: str,
    days: int = Query(30, ge=1, le=180),
    signal: str = Query("sst", description="Signal CSV type e.g. sst, chl, wind")
):
    """
    Reads the associated zone CSV file and returns 
    {dates: [...], values: [...], baseline: [...], z_scores: [...]}
    """
    csv_path = Path(__file__).resolve().parent.parent / "data" / "signals" / f"{zone_id}_{signal}.csv"
    
    if not csv_path.exists():
        raise HTTPException(status_code=404, detail=f"Signal Data '{zone_id}_{signal}.csv' not found.")
        
    df = pd.read_csv(csv_path)
    
    # Check if df has generic ds/y cols from older generator and map them
    if "ds" in df.columns and "y" in df.columns:
        df = df.rename(columns={"ds": "date", "y": "value"})
        
    # Trim to days (Assuming dates are ordered ascending in generated CSVs)
    df = df.tail(days).copy()
    
    # Rerun ML logic for realtime graphing limits
    df = fit_baseline(df, "date", "value")
    df = compute_zscore(df, "value", window=14)
    
    return {
        "dates": df["date"].astype(str).tolist(),
        "values": [round(v, 4) for v in df["value"].tolist()],
        "baseline": [round(b, 4) for b in df["baseline"].tolist()],
        "z_scores": [round(z, 4) for z in df["z_score"].tolist()]
    }
