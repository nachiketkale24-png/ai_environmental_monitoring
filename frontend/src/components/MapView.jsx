import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const API_BASE = "http://localhost:8000";

const ZONE_COORDS = {
  "mh07": [19.0760, 72.8777],
  "gj03": [21.1702, 72.8311],
  "tn12": [13.0827, 80.2707],
  "wb09": [22.5726, 88.3639],
  "ap05": [17.6868, 83.2185]
};

// Tactical Icon
const createTacticalIcon = (severity) => {
  let color = '#48a665'; // OK
  if (severity >= 5) color = '#d17b38'; // Critical
  else if (severity >= 3) color = '#c34949'; // Elevated

  const html = `
    <div style="position: relative; width: 14px; height: 14px;">
      <div style="width: 100%; height: 100%; background-color: ${color}; border-radius: 50%; border: 2px solid #1e3954; position: relative; z-index: 2;"></div>
      ${severity >= 3 ? `<div class="pulse-ring" style="background-color: ${color}"></div>` : ''}
    </div>
  `;
  return L.divIcon({
    className: 'custom-ring-marker',
    html,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom(), { animate: true, duration: 1.5 });
  }, [center, map]);
  return null;
};

const MapView = ({ zones, onZoneSelect }) => {
  const [center, setCenter] = useState([19.0760, 72.8777]);

  if (!zones) {
    return <div className="w-full h-full skeleton-pulse"></div>;
  }

  const handleMarkerClick = (zoneId) => {
    if (ZONE_COORDS[zoneId]) {
      setCenter(ZONE_COORDS[zoneId]);
    }
    onZoneSelect(zoneId);
  };

  return (
    <div className="relative w-full h-full bg-nereid-bg">
      {/* Tactical Center Crosshair Frame */}
      <div className="absolute inset-0 pointer-events-none z-[400] flex items-center justify-center">
        <div className="w-1/2 h-1/2 border border-nereid-text opacity-20 relative">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-nereid-text"></div>
          <div className="absolute left-1/2 top-0 h-full w-[1px] bg-nereid-text"></div>
        </div>
      </div>
      
      <div className="absolute bottom-2 right-2 z-[400] text-nereid-text font-mono text-[8px] bg-white/50 px-2 py-1 tactical-border backdrop-blur-sm pointer-events-none">
        GEO-CONTEXT: MUMBAI METRO<br/>
        LAT: 48.40WN, 23 8TFIY E
      </div>

      <MapContainer 
        center={center} 
        zoom={6} 
        style={{ height: '100%', width: '100%', backgroundColor: 'transparent' }}
        zoomControl={false}
      >
        <MapUpdater center={center} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        />
        
        {Object.keys(zones).map(zoneId => {
          const zData = zones[zoneId];
          const coords = ZONE_COORDS[zoneId];
          if (!coords) return null;
          
          let severity = 0;
          if (zData.alerts && zData.alerts.length > 0) {
            severity = zData.latest_z_score || 5; 
          }

          return (
            <Marker 
              key={zoneId}
              position={coords}
              icon={createTacticalIcon(severity)}
              eventHandlers={{
                click: () => handleMarkerClick(zoneId),
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
