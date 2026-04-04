import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const API_BASE = "http://localhost:8000";

const ZonePopup = ({ zoneId, alerts, onClose }) => {
  const [telemetry, setTelemetry] = useState(null);
  const [aiInsight, setAiInsight] = useState("");
  const [loading, setLoading] = useState(true);

  const zoneAlerts = alerts.filter(a => a.zone_id === zoneId);
  const highestZ = zoneAlerts.length > 0 ? Math.max(...zoneAlerts.map(a => a.highest_z)) : 0;
  
  useEffect(() => {
    const fetchZoneData = async () => {
      setLoading(true);
      try {
        const [telRes, aiRes] = await Promise.all([
          axios.get(`${API_BASE}/zones/${zoneId}/telemetry`),
          axios.post(`${API_BASE}/ai/query`, {
            zone_id: zoneId,
            context: `User is drilling down into sector ${zoneId}. Provide a short tactical threat analysis.`
          })
        ]);
        
        const telData = telRes.data.history.map(item => ({
          timestamp: new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          sst: item.signals.sst,
          wind: item.signals.wind_stress,
          chloro: item.signals.chlorophyll,
          z_score: item.z_score || 0
        }));
        
        setTelemetry(telData);
        setAiInsight(aiRes.data.response || "No AI insight generated. System Offline.");
      } catch (err) {
        console.error("Failed to fetch zone details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchZoneData();
  }, [zoneId]);

  return (
    <div className="fixed inset-0 bg-nereid-text/20 backdrop-blur-sm z-[5000] flex justify-end">
      {/* Off-canvas panel mimicking INSIGHT & EXPLANATION */}
      <div className="w-[80vw] h-full bg-nereid-bg border-l border-nereid-border p-8 overflow-y-auto flex flex-col font-sans slide-in shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 material-symbols-outlined text-nereid-text hover:text-nereid-red transition-colors"
        >
          close
        </button>

        <div className="mb-6 border-b-2 border-nereid-text pb-4">
          <p className="font-mono text-xs font-bold text-nereid-textMuted tracking-wider mb-1">TERMINAL ACCESS // SECTOR {zoneId}</p>
          <h2 className="font-display font-bold text-4xl text-nereid-text uppercase tracking-tighter flex items-center gap-4">
            INSIGHT & EXPLANATION
            <span className={`text-sm px-3 py-1 tactical-border tracking-widest ${highestZ >= 5 ? 'bg-nereid-text text-nereid-bg' : 'bg-nereid-surface text-nereid-text'}`}>
              {highestZ >= 5 ? 'HIGH RISK' : highestZ >= 3 ? 'ELEVATED RISK' : 'NOMINAL'}
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="flex-1 skeleton-pulse rounded-sm"></div>
        ) : (

          <div className="flex gap-6 h-full">
            
            {/* AI Analysis Panel */}
            <div className="w-1/2 tactical-border bg-nereid-panel p-6 flex flex-col relative">
              <div className="absolute top-4 right-4 font-mono text-[10px] text-nereid-textMuted">SEIGMA_78_SYSTEM_CORE</div>
              <div className="flex items-center gap-2 font-mono text-xs text-nereid-textMuted mb-6">
                <div className="w-2 h-2 rounded-full bg-nereid-text"></div> ANALYSIS PANEL
              </div>

              <div className="flex-1 font-mono text-[13px] leading-relaxed text-nereid-text whitespace-pre-wrap overflow-y-auto pr-4 mb-4">
                <span className="text-nereid-textMuted">{'> INITIALIZING HYDROMETRIC SCAN...'}</span><br/><br/>
                {aiInsight}
              </div>

              <div className="mt-auto border-t border-nereid-border pt-4">
                <div className="flex justify-between font-mono text-[10px] text-nereid-textMuted mb-2">
                  <span>CONFIDENCE_RATING</span>
                  <span>94.2% ACCURACY</span>
                </div>
                <div className="h-2 w-full bg-nereid-surface tactical-border mb-4">
                  <div className="h-full bg-nereid-green w-[94%]"></div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 tactical-border bg-nereid-surface p-3">
                    <p className="font-mono text-[10px] text-nereid-textMuted uppercase mb-1">Highest Z-Score</p>
                    <p className={`font-display text-2xl font-bold ${highestZ >= 5 ? 'text-nereid-red' : 'text-nereid-text'}`}>
                      +{highestZ.toFixed(2)}z
                    </p>
                  </div>
                  <div className="flex-1 tactical-border bg-nereid-surface p-3">
                    <p className="font-mono text-[10px] text-nereid-textMuted uppercase mb-1">Evacuation Prob.</p>
                    <p className={`font-display text-2xl font-bold ${highestZ >= 5 ? 'text-nereid-red' : 'text-nereid-text'}`}>
                      {highestZ >= 5 ? '88%' : '12%'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Telemetry and Impact Modeling */}
            <div className="w-1/2 flex flex-col gap-6">
              
              <div className="h-1/2 tactical-border bg-nereid-panel p-6 relative">
                 <div className="font-display font-bold text-xl text-nereid-text uppercase tracking-tight mb-1">IMPACT MODELING</div>
                 <div className="font-mono text-[10px] text-nereid-textMuted mb-4">LOW-LYING URBAN SECTORS</div>
                 
                 <div className="h-[200px] w-full mt-4 bg-nereid-surface">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={telemetry} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorZ" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={highestZ >= 5 ? "#d9534f" : "#1a2b3c"} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={highestZ >= 5 ? "#d9534f" : "#1a2b3c"} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="timestamp" hide />
                        <YAxis hide domain={['auto', 'auto']} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#cbd5e1', borderColor: '#a2b1c4', fontFamily: 'JetBrains Mono', fontSize: '10px' }}
                          itemStyle={{ color: '#1a2b3c' }}
                        />
                        <Area type="monotone" dataKey="z_score" stroke={highestZ >= 5 ? "#d9534f" : "#1a2b3c"} strokeWidth={2} fillOpacity={1} fill="url(#colorZ)" />
                      </AreaChart>
                   </ResponsiveContainer>
                 </div>

                 <div className="absolute bottom-6 right-6 text-right">
                    <p className="font-mono text-[10px] text-nereid-textMuted">COORDINATES</p>
                    <p className="font-mono font-bold text-nereid-text text-sm">34.0522° N, 118.2437° W</p>
                 </div>
              </div>
              
              <div className="flex gap-4">
                 <div className="flex-1 tactical-border bg-nereid-panel p-4 flex flex-col">
                    <div className="font-mono text-xs font-bold text-nereid-text mb-2 flex items-center gap-2">
                       <span className="material-symbols-outlined text-[14px]">water_drop</span> HYDRO-FORCE
                    </div>
                    <p className="font-mono text-[10px] text-nereid-textMuted leading-relaxed">
                      Increased kinetic energy from SST rise amplifies storm surge height by 42%.
                    </p>
                 </div>
                 <div className="flex-1 tactical-border bg-nereid-panel p-4 flex flex-col">
                    <div className="font-mono text-xs font-bold text-nereid-text mb-2 flex items-center gap-2">
                       <span className="material-symbols-outlined text-[14px]">bolt</span> INFRA-STRAIN
                    </div>
                    <p className="font-mono text-[10px] text-nereid-textMuted leading-relaxed">
                      Critical failure threshold projected for coastal substation within 72 hours.
                    </p>
                 </div>
                 <div className="flex-1 tactical-border bg-nereid-panel p-4 flex flex-col">
                    <div className="font-mono text-xs font-bold text-nereid-text mb-2 flex items-center gap-2">
                       <span className="material-symbols-outlined text-[14px]">groups</span> SOCIO-IMPACT
                    </div>
                    <p className="font-mono text-[10px] text-nereid-textMuted leading-relaxed">
                      Evacuation protocols recommended for Zones immediately.
                    </p>
                 </div>
              </div>

            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default ZonePopup;
