import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function FitBounds({ locations }) {
  const map = useMap();
  React.useEffect(() => {
    if (locations.length > 0) {
      const bounds = locations.map(l => [l.latitude, l.longitude]);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 11 });
    }
  }, [locations, map]);
  return null;
}

export default function MapView({ locations, selectedId, onSelect }) {
  const center = locations.length > 0
    ? [locations[0].latitude, locations[0].longitude]
    : [52.1326, 5.2913];

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden bg-concrete border border-border">
      <style>{`
        .leaflet-container {
          background: #F1F5F9;
          font-family: var(--font-inter);
        }
        .leaflet-tile {
          filter: grayscale(100%) contrast(0.95) brightness(1.05);
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.12);
        }
        .leaflet-popup-content {
          margin: 12px 16px;
          font-size: 13px;
        }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important;
        }
        .leaflet-control-zoom a {
          background: white !important;
          color: #0F172A !important;
          border: none !important;
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
        }
      `}</style>

      <MapContainer
        center={center}
        zoom={8}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <FitBounds locations={locations} />
        {locations.map((loc) => {
          const isSelected = selectedId === loc.id;
          return (
            <React.Fragment key={loc.id}>
              {/* Pulse ring */}
              <CircleMarker
                center={[loc.latitude, loc.longitude]}
                radius={isSelected ? 20 : 14}
                pathOptions={{
                  color: '#FFD200',
                  fillColor: '#FFD200',
                  fillOpacity: 0.15,
                  weight: 0,
                }}
              />
              {/* Core pin */}
              <CircleMarker
                center={[loc.latitude, loc.longitude]}
                radius={isSelected ? 9 : 7}
                pathOptions={{
                  color: '#0F172A',
                  fillColor: '#FFD200',
                  fillOpacity: 1,
                  weight: 2,
                }}
                eventHandlers={{
                  click: () => onSelect?.(loc.id),
                }}
              >
                <Popup>
                  <div>
                    <div className="font-semibold text-ink-slate">{loc.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{loc.city} · €{loc.price_per_week}/week</div>
                  </div>
                </Popup>
              </CircleMarker>
            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* Map legend overlay */}
      <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md border border-border rounded-2xl px-4 py-3 z-[400] shadow-sm">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Strategic Map</div>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-2 h-2 rounded-full bg-cyber-yellow" />
          <span className="text-sm font-semibold">{locations.length} matches gevonden</span>
        </div>
      </div>
    </div>
  );
}
