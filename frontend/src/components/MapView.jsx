import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/theme.css'; // ensure pulses are loaded

export default function MapView({ zones, onZoneSelect }) {
  // Mumbai coast roughly [18.9, 72.8]
  const center = [18.0, 71.0];

  const features = zones?.features || [];

  return (
    <div className="map-area">
      <MapContainer 
        center={center} 
        zoom={6} 
        style={{ height: '100%', width: '100%', background: 'var(--bg)' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
        />

        {features.map((feature) => {
          const coords = feature.geometry.coordinates; // [lng, lat]
          // Leaflet expects [lat, lng] for markers
          const latlng = [coords[1], coords[0]];
          
          const status = feature.properties.status_color || 'green'; // red | amber | green
          const score = feature.properties.current_score || 0;
          
          let colorVar = 'var(--green)';
          if (status === 'red') colorVar = 'var(--red)';
          if (status === 'amber') colorVar = 'var(--amber)';

          // If red, we add a special class defined in theme.css that creates a pulsing effect
          // Note: React-Leaflet CircleMarker passes className to the SVG <path>
          const pathClass = status === 'red' ? 'pulse-ring-path' : '';

          return (
            <CircleMarker
              key={feature.properties.zone_id}
              center={latlng}
              radius={status === 'red' ? 24 : 16}
              fillColor={colorVar}
              color={colorVar}
              weight={2}
              fillOpacity={0.4}
              className={pathClass}
              eventHandlers={{
                click: () => {
                  if (onZoneSelect) onZoneSelect(feature.properties.zone_id);
                },
              }}
            >
              <Tooltip sticky>
                <div style={{ fontFamily: 'sans-serif', padding: '4px' }}>
                  <strong>{feature.properties.name}</strong>
                  <br />
                  <span>Zone ID: {feature.properties.zone_id}</span>
                  <br />
                  <span>Risk Score: {score.toFixed(1)}/100</span>
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Legend */}
      <div style={styles.legend}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: 'var(--text-dim)' }}>RISK LEGEND</h4>
        <div style={styles.legendRow}>
          <div style={{...styles.colorBox, backgroundColor: 'var(--red)'}}></div>
          <span>Critical (&ge;60)</span>
        </div>
        <div style={styles.legendRow}>
          <div style={{...styles.colorBox, backgroundColor: 'var(--amber)'}}></div>
          <span>Watch (35-59)</span>
        </div>
        <div style={styles.legendRow}>
          <div style={{...styles.colorBox, backgroundColor: 'var(--green)'}}></div>
          <span>Nominal (&lt;35)</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  legend: {
    position: 'absolute',
    bottom: '24px',
    left: '24px',
    backgroundColor: 'var(--surface)',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    zIndex: 1000,
    minWidth: '140px'
  },
  legendRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '6px',
    fontSize: '0.85rem'
  },
  colorBox: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    marginRight: '8px'
  }
};
