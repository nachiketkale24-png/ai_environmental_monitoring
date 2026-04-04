<div align="center">
 <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=00f2ff,050505&height=320&section=header&text=N.E.R.E.I.D.&fontSize=90&fontAlign=50&fontAlignY=35&desc=Neural%20Environmental%20Risk%20Evaluation%20%26%20Incident%20Detection&descAlign=50&descAlignY=60&descFontSize=25&animation=fadeIn&stroke=ffffff&fontColor=ffffff" width="100%" />
</div>

<div align="center">
  <a href="https://git.io/typing-svg">
    <img src="https://readme-typing-svg.herokuapp.com?font=Space+Grotesk&size=26&duration=2500&pause=1000&color=00F2FF&center=true&vCenter=true&width=800&height=100&lines=Tactical+Marine+Environmental+Monitoring;AI-Powered+Anomaly+Detection;Real-Time+Telemetry+%26+Risk+Mapping;Offline-Capable+Local+LLM+Integration" alt="Typing SVG" />
  </a>
</div>

---

## <img src="https://user-images.githubusercontent.com/74038190/216122069-5b8169d7-1d8e-4a13-b245-a8e4176c99f8.png" width="30" /> About NEREID

**NEREID (Neural Environmental Risk Evaluation & Incident Detection)** is a military-grade, offline-capable tactical dashboard designed for marine policy analysts and command-center operators. 

It processes raw environmental telemetry (Sea Surface Temperature, Chlorophyll, Wind Stress) using advanced statistical models and **Local Generative AI** (Ollama/Gemma3) to detect, narrate, and rank coastal ecosystem anomalies in real-time. By operating entirely offline without cloud APIs, NEREID ensures maximum security and data privacy.

* <img src="https://user-images.githubusercontent.com/74038190/216122041-518ac897-8d92-4c6b-9b3f-ca01dcaf38ee.png" width="25" /> **Real-Time Anomaly Detection:** Rolling Z-score thresholds and Meta's Prophet baseline forecasting.
* <img src="https://user-images.githubusercontent.com/74038190/216120981-b9507c36-0e04-4469-8e27-c99271b45ba5.png" width="25" /> **Actionable Intelligence:** Automated threat translation from JSON to plain English using LLMs.
* <img src="https://user-images.githubusercontent.com/74038190/216121919-60befe4d-11c6-4227-8992-35221d12ff54.png" width="25" /> **Dynamic Priority Matrix:** Live calculation of risk scores based on multi-signal convergence.

<br clear="all" />

## <img src="https://github.com/Anmol-Baranwal/Cool-GIFs-For-GitHub/assets/74038190/7bb1e704-6026-48f9-8435-2f4d40101348" width="30" /> System Architecture & Tech Stack

<div align="center">

| **Category** | **Technologies** |
| :---: | :--- |
| **Frontend** | <img src="https://skillicons.dev/icons?i=react,vite,tailwind,html,css&theme=dark" /> <br/> *React, Vite, Tailwind CSS, Recharts, React-Leaflet*|
| **Backend** | <img src="https://skillicons.dev/icons?i=python,fastapi,sqlite&theme=dark" /> <br/> *Python 3.11, FastAPI, SQLite (aiosqlite)*|
| **AI / Machine Learning** | <img src="https://skillicons.dev/icons?i=sklearn,pandas&theme=dark" /> <br/> *Ollama (Gemma3:4b), Scikit-Learn, Prophet, Numpy* |

</div>

<br/>

## <img src="https://user-images.githubusercontent.com/74038190/216127913-88de86d3-8437-45b9-a3b6-e746b47f655a.gif" width="30" /> Dashboard Interface Highlights

NEREID features a beautifully crafted, tactical heads-up display (HUD) providing comprehensive situational awareness at a glance.

### 1. Global Exploration & Telemetry 
> **Focused Exploration View:** Visualizes real-time map plots along the coastline (e.g., Versova). Displays satellite thermal overlays, real-time z-score peaks for Sea Surface Temperature (SST), wind stress vectors, and an AI threat assessment suggesting reconnaissance deployment.
<img src="doc-images/exploration.jpg" width="100%" alt="Focused Exploration View" />

### 2. Live Risk Matrix Queue 
> **Risk Highlighting & Ranking:** A dedicated screen sorting active sector threats by their priority Z-Score index. It separates zones into **Critical** (Sector MB-04 Versova), **Elevated** (Sector MB-02 Worli), and **Stable** (Sector MB-09 Colaba) blocks dynamically, alongside high-entropy proximity threat visualizations.
<img src="doc-images/risk-matrix.jpg" width="100%" alt="Risk Matrix Queue" />

### 3. Coastal Impact & AI Explanation
> **Insight & Explanation (High Risk):** Deep-dive analysis of a potential coastal flooding event. An AI analysis panel correlates abnormal SST with sustained wind patterns, rendering predictive inundation depth models and calculating the probability of urban infrastructure failure alongside estimated physical hydro-force strain.
<img src="doc-images/impact-explanation.jpg" width="100%" alt="Insight and AI Explanation" />

### 4. Command & Tactical Action Protocol
> **Fog Decision & Action Dashboard:** The ultimate operator command center. Shows a real-time protocol log, specific impact radius maps for critically failing zones (e.g., Alpha-7), asset readiness metrics, and direct action triggers spanning from issuing regional alerts to deploying emergency response teams.
<img src="doc-images/command-protocol.jpg" width="100%" alt="Tactical Action Protocol" />

---

## 🚀 Getting Started

### 1. Install & Boot Local AI (Ollama)
```bash
# Install Ollama (https://ollama.ai/)
curl -fsSL https://ollama.ai/install.sh | sh

# Pull the Gemma3 model for fast, lightweight inference
ollama pull gemma3:4b
ollama serve
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt

# Generate synthetic historical data and build models
python data/generate_data.py  

# Start the FastApi Server
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit **`http://localhost:5173`** to access the tactical dashboard.

---

<div align="center">
<h3><img src="https://github.com/Anmol-Baranwal/Cool-GIFs-For-GitHub/assets/74038190/7d484dc9-68a9-4ee6-a767-aea59035c12d" width="25" /> *"Data is the new compass; AI points the way."* <img src="https://github.com/Anmol-Baranwal/Cool-GIFs-For-GitHub/assets/74038190/7d484dc9-68a9-4ee6-a767-aea59035c12d" width="25" /></h3>

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=20&duration=3000&pause=2000&color=00F2FF&center=true&vCenter=true&width=600&lines=Thank+you+for+exploring+NEREID!;Built+for+the+Future+of+Marine+Intelligence." alt="Footer Animation" />
</div>
