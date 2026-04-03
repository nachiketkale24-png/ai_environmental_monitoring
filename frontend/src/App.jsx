import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import MapView from './components/MapView';
import AlertFeed from './components/AlertFeed';
import ZonePopup from './components/ZonePopup';
import './styles/theme.css';

const API_BASE = "http://localhost:8000";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [zones, setZones] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [demoSliderValue, setDemoSliderValue] = useState(null); // External control for demo

  // Sync dark mode class on body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
  }, [darkMode]);

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

  // 60-second polling
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const triggerDemoMode = async () => {
    console.log("Starting Demo Sequence...");
    // 1. Clear selection
    setSelectedZone(null);
    await new Promise(r => setTimeout(r, 2000));
    
    // 2. Open mh07
    setSelectedZone("mh07");
    setDemoSliderValue(20); // 20 days ago
    
    // 3. Advance time scrubber automatically every 1.5s
    for(let i=20; i>=0; i-=4) {
      await new Promise(r => setTimeout(r, 1500));
      setDemoSliderValue(i);
    }
    
    // 4. Pivot to another zone
    await new Promise(r => setTimeout(r, 3000));
    setSelectedZone("gj03");
    setDemoSliderValue(0);
    
    // 5. Complete
    await new Promise(r => setTimeout(r, 3000));
    console.log("Demo Sequence Finished");
    setDemoSliderValue(null);
  };

  return (
    <div className="app-container">
      <Navbar 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        onZoneSelect={setSelectedZone}
        triggerDemoMode={triggerDemoMode}
      />
      
      <MapView 
        zones={zones} 
        onZoneSelect={setSelectedZone} 
      />
      
      <AlertFeed 
        alerts={alerts} 
        refreshAlerts={fetchData} 
        isInitialLoading={isInitialLoading}
      />

      {selectedZone && (
        <ZonePopup 
          zoneId={selectedZone}
          alerts={alerts}
          onClose={() => setSelectedZone(null)}
          forceSliderValue={demoSliderValue}
        />
      )}
    </div>
  );
}

export default App;
