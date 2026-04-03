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
      // Parallel fetch for speed
      const [alertRes, zoneRes] = await Promise.all([
        axios.get(`${API_BASE}/alerts`),
        axios.get(`${API_BASE}/zones`)
      ]);
      setAlerts(alertRes.data.alerts || []);
      setZones(zoneRes.data);
    } catch (err) {
      console.error("Failed to fetch initial NEREID data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="app-container">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <MapView 
        zones={zones} 
        onZoneSelect={setSelectedZone} 
      />
      
      <AlertFeed 
        alerts={alerts} 
        refreshAlerts={fetchData} 
      />

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
