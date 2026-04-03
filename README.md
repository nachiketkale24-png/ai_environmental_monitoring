# NEREID 🌊

> **Neural Environmental Risk Evaluation & Incident Detection**

Real-time environmental monitoring system for Indian coastal zones.
AI-powered anomaly detection with Claude-driven narrative explanations.

## Tech Stack

| Layer | Tool | Why |
|-------|------|-----|
| Frontend | React + Vite | Fast setup, component-based |
| Map | Leaflet.js | Free, no API key needed |
| Charts | Recharts | Simple, React-native |
| Backend | FastAPI (Python) | 10 min setup, async |
| ML | scikit-learn + Prophet | No GPU needed, hackathon safe |
| Data | Pre-cached CSVs | No API rate limit risk |
| AI | Claude API (claude-sonnet-4-20250514) | Differentiator |
| Storage | SQLite | Zero config |

## Quick Start

### Backend

```bash
cd backend
pip install -r requirements.txt

# Generate synthetic signal data
python data/generate_signals.py

# Seed initial alerts
python -m data.seed_alerts

# Start server
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/alerts` | Ranked alert list |
| GET | `/alerts/{id}` | Single alert detail |
| GET | `/zones` | GeoJSON zone data with status |
| GET | `/signals/{zone_id}` | Time-series signal data |
| POST | `/query` | Claude NL query handler |
| POST | `/feedback` | Validate/dismiss alert |

## Project Structure

```
nereid/
├── frontend/          React + Vite
├── backend/           FastAPI
│   ├── routes/        API endpoints
│   ├── ml/            ML pipeline (Prophet, z-score, scorer)
│   ├── ai/            Claude integration
│   ├── data/          GeoJSON + signal CSVs
│   └── db/            SQLite
├── notebooks/         Exploratory analysis
└── .env               API keys
```

## ML Pipeline

1. **Baseline** — Prophet fits seasonal curve per zone
2. **Z-Score** — Rolling z-score on deviation from baseline
3. **Scorer** — `score = magnitude_z × trend_slope × recency_weight`
4. **Convergence** — Alert only if ≥2 signals score > 2σ simultaneously
5. **Bayesian** — Sensitivity weight updates on operator feedback

## License

MIT
