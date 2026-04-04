import React from 'react';

const AlertFeed = ({ alerts, refreshAlerts, isInitialLoading, onSelectZone }) => {
  if (isInitialLoading) {
    return (
      <div className="flex flex-col gap-4 mt-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 skeleton-pulse tactical-border rounded-sm"></div>
        ))}
      </div>
    );
  }

  // Sort alerts by severity & z-score
  const sortedAlerts = [...alerts].sort((a, b) => b.highest_z - a.highest_z);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-end mb-4 font-mono text-[10px] text-nereid-textMuted tracking-wider">
        <span>LIVE PRIORITY QUEUE // SORTED BY Z-SCORE</span>
        <span>LAST UPDATE: T+00:00:42</span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {sortedAlerts.length === 0 ? (
          <div className="tactical-border bg-nereid-surface p-6 text-center font-mono text-nereid-textMuted text-sm">
            NO ANOMALIES DETECTED IN OPERATIONAL RADIUS
          </div>
        ) : (
          sortedAlerts.map(alert => {
            const isCritical = alert.highest_z >= 5.0;
            const isElevated = alert.highest_z >= 3.0 && alert.highest_z < 5.0;
            const isStable = alert.highest_z < 3.0;
            
            let severityBlockStyle = "bg-nereid-border text-white";
            let severityLabel = "STABLE";
            let borderColor = "border-nereid-border";
            let healthLabel = "NOMINAL";
            
            if (isCritical) {
              severityBlockStyle = "bg-nereid-amber text-white";
              severityLabel = "CRITICAL";
              healthLabel = "ACTIVE_BROADCAST";
              borderColor = "border-nereid-amber";
            } else if (isElevated) {
              severityBlockStyle = "bg-nereid-red text-white";
              severityLabel = "ELEVATED";
              healthLabel = "NOMINAL_DEGRADED";
              borderColor = "border-nereid-red";
            }

            return (
              <div 
                key={alert.zone_id}
                className={`tactical-border bg-nereid-surface hover:bg-nereid-panel transition-colors cursor-pointer relative overflow-hidden group shadow-sm`}
                onClick={() => onSelectZone(alert.zone_id)}
              >
                {/* Left accent line */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${borderColor}`}></div>
                
                {/* Internal borders decorative */}
                <div className="absolute top-1 left-2 w-2 border-t border-nereid-border opacity-50"></div>
                <div className="absolute top-1 left-2 h-2 border-l border-nereid-border opacity-50"></div>
                <div className="absolute bottom-1 right-2 w-2 border-b border-nereid-border opacity-50"></div>
                <div className="absolute bottom-1 right-2 h-2 border-r border-nereid-border opacity-50"></div>

                <div className="p-4 pl-6 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-2 py-0.5 text-[10px] font-bold tracking-widest ${severityBlockStyle}`}>
                        {severityLabel}
                      </span>
                      <h3 className="font-display font-semibold text-lg text-nereid-text uppercase tracking-wide">
                        SECTOR {alert.zone_id}
                      </h3>
                    </div>
                    
                    <div className="flex gap-8 font-mono text-[10px]">
                      <div>
                        <p className="text-nereid-textMuted mb-1">FIRING SIGNALS</p>
                        <div className="flex gap-1 text-nereid-amber">
                          <span className="material-symbols-outlined text-[14px]">warning</span>
                          <span className="material-symbols-outlined text-[14px]">sensors</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-nereid-textMuted mb-1">SYSTEM HEALTH</p>
                        <p className="font-semibold text-nereid-text">{healthLabel}</p>
                      </div>
                    </div>
                  </div>

                  {/* Z-Score Ring */}
                  <div className="flex flex-col items-center justify-center p-2 rounded-full border border-dashed border-nereid-border w-24 h-24">
                    <span className={`font-display text-2xl font-bold tracking-tighter ${isCritical ? 'text-nereid-amber' : isElevated ? 'text-nereid-red' : 'text-nereid-text'}`}>
                      {alert.highest_z.toFixed(2)}
                    </span>
                    <span className="font-mono text-[8px] text-nereid-textMuted mt-1">Z-SCORE INDEX</span>
                  </div>
                </div>

                {/* Bottom decorative line */}
                <div className="h-[2px] w-full bg-repeating-linear-gradient-to-r from-transparent to-nereid-border" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #a2b1c4, #a2b1c4 2px, transparent 2px, transparent 4px)'}}></div>
              </div>
            );
          })
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-nereid-border flex justify-between">
        <button className="flex items-center gap-2 px-4 py-2 bg-nereid-surface tactical-border text-nereid-text hover:bg-nereid-panel font-mono text-xs font-semibold">
          <span className="material-symbols-outlined text-[16px]">download</span> EXPORT DATASET
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-nereid-surface tactical-border text-nereid-text hover:bg-nereid-panel font-mono text-xs font-semibold">
          <span className="material-symbols-outlined text-[16px]">emergency</span> ESCALATE PRIORITY
        </button>
      </div>
    </div>
  );
};

export default AlertFeed;
