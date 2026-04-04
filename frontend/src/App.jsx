import { useState, useEffect } from 'react';
import axios from 'axios';
import MapView from './components/MapView';
import AlertFeed from './components/AlertFeed';
import ZonePopup from './components/ZonePopup';
import './styles/theme.css';

const API_BASE = "http://localhost:8000";

function App() {
  const [alerts, setAlerts] = useState([]);
  const [zones, setZones] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [alertRes, zoneRes] = await Promise.all([
        axios.get(`${API_BASE}/alerts`),
        axios.get(`${API_BASE}/zones`)
      ]);
      setAlerts(alertRes.data.alerts || []);
      setZones(zoneRes.data);
    } catch (err) {
      console.error("Failed to fetch NEREID data:", err);
    } finally {
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col font-sans">
      
      {/* TOP NAVBAR */}
      <header className="h-14 border-b border-nereid-border bg-nereid-bg flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-nereid-text rounded-full flex items-center justify-center">
            <span className="font-bold text-xs">N</span>
          </div>
          <h1 className="text-xl font-display font-semibold tracking-wide text-nereid-text">
            NEREID TACTICAL
          </h1>
        </div>
        
        <nav className="flex items-center gap-8 text-sm font-semibold text-nereid-textMuted tracking-wider font-display">
          <button className="hover:text-nereid-text transition-colors">SITUATION</button>
          <button className="text-nereid-text border-b-2 border-nereid-text pb-[18px] translate-y-[10px]">RISK MATRIX</button>
          <button className="hover:text-nereid-text transition-colors">TELEMETRY</button>
          <button className="hover:text-nereid-text transition-colors">ANALYSIS</button>
          <button className="hover:text-nereid-text transition-colors">COMMAND</button>
        </nav>

        <div className="flex items-center gap-4 text-nereid-textMuted">
          <span className="material-symbols-outlined cursor-pointer hover:text-nereid-text">notifications</span>
          <span className="material-symbols-outlined cursor-pointer hover:text-nereid-text">tune</span>
          <span className="material-symbols-outlined cursor-pointer hover:text-nereid-text">account_circle</span>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDE BAR */}
        <aside className="w-60 border-r border-nereid-border bg-nereid-bg flex flex-col pt-6 shrink-0 z-40">
          <div className="px-6 mb-8">
            <h2 className="font-display font-bold text-nereid-text text-lg">MISSION CONTROL</h2>
            <p className="font-mono text-xs text-nereid-textMuted mt-1">OP-LEVEL: TERMINAL</p>
          </div>
          
          <div className="flex flex-col font-mono text-sm">
            <button className="py-3 px-6 flex items-center gap-3 text-nereid-textMuted hover:bg-[#d0dae5] hover:text-nereid-text transition-colors text-left">
              <span className="material-symbols-outlined text-[18px]">public</span> Global Overview
            </button>
            <button className="py-3 px-6 flex items-center gap-3 text-nereid-text font-semibold bg-[#dcdfe6] border-l-4 border-nereid-text text-left">
              <span className="material-symbols-outlined text-[18px]">warning</span> Anomaly Feed
            </button>
            <button className="py-3 px-6 flex items-center gap-3 text-nereid-textMuted hover:bg-[#d0dae5] hover:text-nereid-text transition-colors text-left">
              <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span> Sector Drilldown
            </button>
            <button className="py-3 px-6 flex items-center gap-3 text-nereid-textMuted hover:bg-[#d0dae5] hover:text-nereid-text transition-colors text-left">
              <span className="material-symbols-outlined text-[18px]">memory</span> AI Insights
            </button>
            <button className="py-3 px-6 flex items-center gap-3 text-nereid-textMuted hover:bg-[#d0dae5] hover:text-nereid-text transition-colors text-left">
              <span className="material-symbols-outlined text-[18px]">gavel</span> Action Protocol
            </button>
          </div>
          
          <div className="mt-auto p-6 font-mono text-xs text-nereid-textMuted border-t border-nereid-border opacity-80">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[16px]">settings</span> System Diagnostics
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">lock</span> Secure Uplink
            </div>
            <div className="mt-4 pt-4 border-t border-nereid-border flex justify-between items-center text-[10px]">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-nereid-text"></div> SYSTEM_NOMINAL</span>
              <span>UPLINK: 99%</span>
            </div>
          </div>
        </aside>

        {/* WORKSPACE AREA */}
        <main className="flex-1 relative overflow-hidden flex flex-col">
          {/* Internal Dashboard View (Risk Highlighting & Map) */}
          <div className="flex-1 overflow-hidden p-8 flex gap-8">
            
            {/* Left Column: Risk Highlight Board */}
            <div className="w-1/2 flex flex-col h-full gap-4">
              <div className="flex justify-between items-end border-b-2 border-nereid-text pb-2 mb-2">
                <div>
                  <h2 className="font-display font-bold italic text-3xl text-nereid-text tracking-tighter">RISK HIGHLIGHTING</h2>
                  <p className="font-mono text-xs text-nereid-textMuted tracking-widest mt-1">AUTOMATED ANOMALY DETECTION & RANKING SUITE</p>
                </div>
              </div>
              <AlertFeed 
                alerts={alerts} 
                refreshAlerts={fetchData} 
                isInitialLoading={isInitialLoading}
                onSelectZone={setSelectedZone}
              />
            </div>
            
            {/* Right Column: Threats Proximity and Map */}
            <div className="w-1/2 flex flex-col h-full gap-6">
              <div className="flex justify-end border-b-2 border-nereid-text pb-2 mb-2">
                <div className="text-right">
                  <p className="font-mono text-[10px] text-nereid-textMuted">GLOBAL STATUS</p>
                  <p className="font-mono font-bold text-sm tracking-widest text-nereid-text">CRITICAL_THREAT_DETECTED</p>
                </div>
              </div>
              
              <div className="flex-1 tactical-border bg-nereid-panel p-2 relative shadow-sm">
                <div className="absolute top-0 right-0 p-2 text-[10px] font-mono text-nereid-textMuted z-[400] bg-white/50 backdrop-blur-sm pointer-events-none">
                  THREAT PROXIMITY VISUALIZATION // R-84
                </div>
                <MapView 
                  zones={zones} 
                  onZoneSelect={setSelectedZone} 
                />
              </div>

              <div className="tactical-border bg-nereid-panel p-4 flex gap-4 shadow-sm items-center">
                 <div className="flex-1">
                   <p className="font-mono text-xs font-bold text-nereid-text mb-3">RISK MODEL PARAMETERS</p>
                   <div className="flex justify-between font-mono text-[10px] mb-1">
                     <span className="text-nereid-textMuted">NEURAL WEIGHTS</span>
                     <span className="font-bold">0.992</span>
                   </div>
                   <div className="h-1 bg-nereid-surface w-full mb-3"><div className="h-full bg-nereid-text w-[99%]"></div></div>

                   <div className="flex justify-between font-mono text-[10px] mb-1">
                     <span className="text-nereid-textMuted">ENTROPY LEVEL</span>
                     <span className="font-bold text-nereid-amber">HIGH (0.84)</span>
                   </div>
                   <div className="h-1 bg-nereid-surface w-full"><div className="h-full bg-nereid-amber w-[84%]"></div></div>
                 </div>
              </div>

            </div>

          </div>
        </main>
      </div>
      
      {/* MODAL / ZONEDETAIL VIEW overlay */}
      {selectedZone && (
        <ZonePopup 
          zoneId={selectedZone}
          alerts={alerts}
          onClose={() => setSelectedZone(null)}
        />
      )}

    </div>
  );
}

export default App;
