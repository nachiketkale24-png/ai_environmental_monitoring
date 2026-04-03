"""
NEREID — Synthetic Signal Data Generator
Generates 90-day CSV files per zone × signal for demo purposes.
Simulates Sentinel-3 / MODIS style data with injected anomalies.
"""

import os
import numpy as np
import pandas as pd
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent
SIGNALS_DIR = DATA_DIR / "signals"

ZONES = ["mh07", "mh12", "mh15", "gj03", "gj08", "ka02"]

# Signal parameters: (base_value, seasonal_amplitude, noise_std, unit)
SIGNAL_PARAMS = {
    "sst": (28.0, 2.5, 0.4, "°C"),      # Sea Surface Temp
    "chl": (1.5, 0.8, 0.2, "mg/m³"),     # Chlorophyll-a
    "wind": (5.0, 1.5, 0.8, "m/s"),      # Wind stress
}

# Anomaly injection config: (zone, signal, day_start, day_end, magnitude)
ANOMALIES = [
    ("mh07", "sst", 70, 85, 3.5),    # Thermal anomaly in Mumbai
    ("mh07", "chl", 72, 88, 2.8),    # Algal bloom
    ("gj03", "sst", 60, 75, 2.5),    # Gulf of Kutch warming
    ("gj03", "wind", 65, 78, -2.0),  # Wind drop (stagnation)
    ("mh12", "chl", 80, 90, 3.2),    # Thane Creek bloom
    ("ka02", "sst", 55, 65, 2.0),    # Karwar mild thermal
    ("mh15", "sst", 40, 50, 1.5),    # Ratnagiri mild (sub-threshold)
]


def generate_signal(
    zone_id: str,
    signal_type: str,
    days: int = 90,
    seed: int | None = None,
) -> pd.DataFrame:
    """Generate synthetic time series for a zone/signal combination."""
    if seed is not None:
        np.random.seed(seed)

    params = SIGNAL_PARAMS[signal_type]
    base, amplitude, noise_std, _ = params

    dates = pd.date_range(end=pd.Timestamp.now().normalize(), periods=days, freq="D")
    t = np.arange(days)

    # Seasonal component (annual cycle approximation over 90 days)
    seasonal = amplitude * np.sin(2 * np.pi * t / 365)

    # Random noise
    noise = np.random.normal(0, noise_std, days)

    values = base + seasonal + noise

    # Inject anomalies for this zone/signal
    for z, sig, start, end, mag in ANOMALIES:
        if z == zone_id and sig == signal_type:
            anomaly_len = min(end, days) - max(start, 0)
            if anomaly_len > 0:
                s = max(start, 0)
                e = min(end, days)
                # Gradual onset + plateau + decay
                ramp = np.concatenate([
                    np.linspace(0, mag, (e - s) // 2),
                    np.linspace(mag, mag * 0.7, (e - s) - (e - s) // 2),
                ])
                values[s:e] += ramp[:e - s]

    df = pd.DataFrame({"ds": dates, "y": np.round(values, 3)})
    return df


def generate_all():
    """Generate all 18 CSV files (6 zones × 3 signals)."""
    SIGNALS_DIR.mkdir(parents=True, exist_ok=True)

    seed_base = 42
    for i, zone in enumerate(ZONES):
        for j, signal in enumerate(SIGNAL_PARAMS.keys()):
            df = generate_signal(zone, signal, seed=seed_base + i * 10 + j)
            filepath = SIGNALS_DIR / f"{zone}_{signal}.csv"
            df.to_csv(filepath, index=False)
            print(f"  📊 Generated {filepath.name} ({len(df)} rows)")

    print(f"\n✅ Generated {len(ZONES) * len(SIGNAL_PARAMS)} signal CSVs in {SIGNALS_DIR}")


if __name__ == "__main__":
    generate_all()
