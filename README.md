# NEREID: Neural Environmental Risk Evaluation & Incident Detection 🌊

> Full-stack local-GPU environmental intelligence platform tracking oceanic phenomena via pre-cached anomalies utilizing Bayesian ranking matrices.

This architecture handles realtime CSV digestion dynamically pushing through an anomaly evaluation pipeline bounded by `Prophet` seasonal baseline evaluations paired to an offline, hyper-local AI logic core relying exclusively upon local `ollama` endpoints.

## 🚀 Setup & Launch

You require two terminal windows running in parallel to launch the application.

### 1. Database & Backend API Engine
Runs natively on Fast API caching onto a local SQLite container orchestrating all background ML jobs.
```bash
# Verify Python version (requires Python 3.10+)
cd backend

# Create Virtual Environment (Optional)
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# Install requirements
pip install -r requirements.txt

# Run the backend Application server
uvicorn main:app --reload
```
*Note: The system dynamically seeds the database via `data/seed_alerts.py` automatically utilizing historical CSVs natively cached alongside the DB module if empty upon first boot. Ensure Ollama is running (`ollama run gemma:2b` or similar) locally.*

### 2. Frontend React Visualization UI
Runs a highly reactive custom dashboard powered via standard Vite/React ecosystems parsing geospatial components natively against the Leaflet infrastructure.
```bash
cd frontend

# Install Node requirements
npm install 

# Launch development UI
npm run dev
```

Navigate to `http://localhost:5173` to interact with NEREID securely!

## 🎙️ Hackathon Demo Sequence
We've integrated a powerful one-click Demo sequence tailored specifically to convey our application's scalability and responsiveness dynamically to the judging panel.
- At the top right of the navigation, click the **DEMO** badge. 
- The system will systematically emulate the `MH-07` and `GJ-03` incident timelines smoothly rolling backwards in history exposing the raw anomalies and bounding intervals gracefully.

## ✨ AI Integration
Instead of burning through API credits on cloud models, NEREID securely proxies natural language contexts entirely through extreme low-latency `Ollama` sockets natively attached to `/query`. Ask the NEREID pipeline contextual questions (Hotkey Focus: `/`). Examples:
- *"Are there any blooming instances around Mumbai?"*
- *"Which zones are firing the most Critical flags?"* 
- Clicking specific actionable zone chips within the output seamlessly invokes the detail visualizer.
