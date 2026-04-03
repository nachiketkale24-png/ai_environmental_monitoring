import React, { useState } from 'react';
import MapView from '../components/MapView';
import AlertFeed from '../components/AlertFeed';
import QueryPanel from '../components/QueryPanel';
import TimeSlider from '../components/TimeSlider';
import useAlerts from '../hooks/useAlerts';
import useZones from '../hooks/useZones';

export default function Dashboard() {
  const { alerts, loading: alertsLoading } = useAlerts();
  const { zones, loading: zonesLoading } = useZones();
  const [days, setDays] = useState(30);

  return (
    <div className="dashboard" id="dashboard-page">
      <div className="dashboard__map-section">
        <MapView zones={zones} />
        <TimeSlider value={days} onChange={setDays} />
      </div>
      <div className="dashboard__sidebar">
        <AlertFeed alerts={alerts} />
        <QueryPanel />
      </div>

      <style>{`
        .dashboard {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 1rem;
          padding: 1rem;
          height: calc(100vh - 60px);
        }
        .dashboard__map-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .dashboard__sidebar {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          overflow-y: auto;
        }
        @media (max-width: 900px) {
          .dashboard {
            grid-template-columns: 1fr;
            height: auto;
          }
        }
      `}</style>
    </div>
  );
}
