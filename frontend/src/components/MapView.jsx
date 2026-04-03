import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MUMBAI_CENTER = [19.076, 72.877];

function getZoneStyle(feature) {
  const color = feature.properties?.color || 'green';
  const colorMap = {
    red: '#ef4444',
    amber: '#f59e0b',
    green: '#22c55e',
  };
  return {
    fillColor: colorMap[color] || colorMap.green,
    fillOpacity: 0.25,
    color: colorMap[color] || colorMap.green,
    weight: 2,
    opacity: 0.8,
  };
}

function onEachFeature(feature, layer) {
  if (feature.properties) {
    const { name, zone_id, current_score, color } = feature.properties;
    layer.bindPopup(`
      <div style="font-family: Inter, sans-serif;">
        <strong>${name || zone_id}</strong><br/>
        Score: ${(current_score || 0).toFixed(2)}<br/>
        Status: <span style="text-transform:uppercase;font-weight:600;">${color || 'green'}</span>
      </div>
    `);
  }
}

export default function MapView({ zones }) {
  return (
    <div className="map-container" id="map-view">
      <MapContainer
        center={MUMBAI_CENTER}
        zoom={6}
        style={{ height: '100%', width: '100%', borderRadius: 'var(--radius-md)' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; CartoDB'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {zones && (
          <GeoJSON
            data={zones}
            style={getZoneStyle}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>

      <style>{`
        .map-container {
          height: 500px;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid var(--border-color);
        }
      `}</style>
    </div>
  );
}
