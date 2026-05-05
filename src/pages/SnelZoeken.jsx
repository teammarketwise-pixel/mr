import React, { useState, useMemo, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/shared/Navbar';
import NewClaimModal from '@/components/planner/NewClaimModal';
import { MapPin, Loader2, CheckSquare, Square, Search } from 'lucide-react';
import { useEffect } from 'react';

const PROVINCIE_POSTCODE = {
  'Antwerpen': [[2000, 2999]],
  'Oost-Vlaanderen': [[9000, 9999]],
  'West-Vlaanderen': [[8000, 8999]],
  'Vlaams-Brabant': [[1500, 1999], [3000, 3499]],
  'Limburg': [[3500, 3999]],
  'Brussel': [[1000, 1299]],
  'Henegouwen': [[6000, 6599], [7000, 7999]],
  'Luik': [[4000, 4999]],
  'Namen': [[5000, 5999]],
  'Luxemburg': [[6600, 6999]],
  'Waals-Brabant': [[1300, 1499]],
};

const LOCATIETYPES = [
  'Kruispunt', 'Hoofdweg', 'Ring', 'Rotonde', 'Station', 'Winkelstraat',
  'Stadscentrum', 'Park', 'School of Campus', 'Industriezone', 'Parking',
  'Sportcentrum', 'Ziekenhuis', 'Luchthaven', 'Horecabuurt', 'Kust', 'Woonwijk',
];

function postcodeInProvincie(postcode, provincie) {
  const ranges = PROVINCIE_POSTCODE[provincie] || [];
  return ranges.some(([min, max]) => postcode >= min && postcode <= max);
}

function countPanels(panelStr) {
  if (!panelStr) return 0;
  return panelStr.split(',').map(s => s.trim()).filter(Boolean).length;
}

function populariteitBadge(loc) {
  const n = countPanels(loc.panel_nummers);
  if (n >= 6) return { label: 'Toplocatie', color: 'bg-purple-600 text-white' };
  if (n >= 4) return { label: 'Hot spot', color: 'bg-red-500 text-white' };
  if (n >= 2) return { label: 'Populair', color: 'bg-[#FFD700] text-[#0F172A]' };
  return { label: 'Uniek', color: 'bg-white text-[#0F172A] border border-gray-200' };
}

const CLIENT_PRICE = 418;

function postcodeToCoords(pc) {
  const n = Number(pc);
  if (n >= 1000 && n <= 1299) return [50.850, 4.352];
  if (n >= 1300 && n <= 1499) return [50.620, 4.570];
  if (n >= 1500 && n <= 1999) return [50.720, 4.530];
  if (n >= 2000 && n <= 2999) return [51.220, 4.400];
  if (n >= 3000 && n <= 3499) return [50.880, 4.700];
  if (n >= 3500 && n <= 3999) return [50.930, 5.350];
  if (n >= 4000 && n <= 4999) return [50.640, 5.570];
  if (n >= 5000 && n <= 5999) return [50.460, 4.860];
  if (n >= 6000 && n <= 6599) return [50.410, 4.450];
  if (n >= 6600 && n <= 6999) return [49.930, 5.320];
  if (n >= 7000 && n <= 7999) return [50.500, 3.650];
  if (n >= 8000 && n <= 8999) return [51.050, 3.100];
  if (n >= 9000 && n <= 9999) return [51.050, 3.720];
  return [50.85, 4.35];
}

function getLocCoords(loc) {
  const lat = Number(loc.latitude);
  const lng = Number(loc.longitude);
  if (isFinite(lat) && isFinite(lng) && lat > 49 && lat < 52 && lng > 2 && lng < 7) return [lat, lng];
  return postcodeToCoords(loc.post_code);
}

function AutoFitBounds({ locations }) {
  const map = useMap();
  const prevKey = React.useRef('');
  useEffect(() => {
    if (!locations || locations.length === 0) return;
    const key = locations.map(l => l.id).join(',');
    if (key === prevKey.current) return;
    prevKey.current = key;
    const coords = locations.map(getLocCoords);
    if (coords.length === 1) { map.setView(coords[0], 14); return; }
    const lats = coords.map(c => c[0]);
    const lngs = coords.map(c => c[1]);
    map.fitBounds([[Math.min(...lats) - 0.02, Math.min(...lngs) - 0.02], [Math.max(...lats) + 0.02, Math.max(...lngs) + 0.02]], { padding: [40, 40], maxZoom: 13 });
  }, [locations, map]);
  return null;
}

function MapController({ flyTo }) {
  const map = useMap();
  useEffect(() => {
    if (!flyTo) return;
    try { map.flyTo(getLocCoords(flyTo), 15, { duration: 0.8 }); } catch (e) {}
  }, [flyTo, map]);
  return null;
}

export default function SnelZoeken() {
  const [provincie, setProvincie] = useState('');
  const [locatietype, setLocatietype] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [flyTo, setFlyTo] = useState(null);
  const [showClaim, setShowClaim] = useState(false);
  const cardRefs = useRef({});

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: () => base44.entities.Location.list('-id', 5000),
  });

  const filtered = useMemo(() => {
    return locations.filter(loc => {
      if (provincie) {
        const pc = Number(loc.post_code);
        if (!postcodeInProvincie(pc, provincie)) return false;
      }
      if (locatietype) {
        const vals = (loc.locatietype || '').split(',').map(s => s.trim()).filter(Boolean);
        if (!vals.includes(locatietype)) return false;
      }
      return true;
    });
  }, [locations, provincie, locatietype]);

  const isValidCoord = (loc) => {
    const lat = Number(loc.latitude), lng = Number(loc.longitude);
    return isFinite(lat) && isFinite(lng) && lat > 49 && lat < 52 && lng > 2 && lng < 7;
  };

  const toggleSelect = useCallback((id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const handlePinClick = useCallback((loc) => {
    toggleSelect(loc.id);
    if (isValidCoord(loc)) setFlyTo(loc);
    const el = cardRefs.current[loc.id];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [toggleSelect]);

  const selectedLocations = filtered.filter(l => selectedIds.includes(l.id));

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ height: '100vh', overflow: 'hidden' }}>
      <Navbar />

      {/* Header + filters */}
      <div className="flex-shrink-0 border-b border-gray-100 bg-white px-6 md:px-10 pt-20 pb-4">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-0.5">Snel zoeken</p>
              <h1 className="font-clash text-2xl md:text-3xl font-semibold text-[#0F172A]">
                <span className="text-[#FFD700]">{isLoading ? '...' : filtered.length}</span> locaties
              </h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <select
                value={provincie}
                onChange={e => setProvincie(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
              >
                <option value="">Alle provincies</option>
                {Object.keys(PROVINCIE_POSTCODE).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <select
                value={locatietype}
                onChange={e => setLocatietype(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
              >
                <option value="">Alle locatietypes</option>
                {LOCATIETYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {(provincie || locatietype) && (
                <button
                  onClick={() => { setProvincie(''); setLocatietype(''); }}
                  className="px-4 py-2.5 text-sm text-gray-400 hover:text-gray-700 border border-gray-200 rounded-xl transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Split view */}
      <div className="flex-1 hidden md:flex overflow-hidden max-w-[1600px] w-full mx-auto">
        <div className="w-[60%] flex flex-col border-r border-gray-100 overflow-hidden">
          <div className="flex-shrink-0 px-6 py-3 border-b border-gray-100 bg-white">
            <p className="text-xs text-gray-400">Vink locaties aan en klik de gele knop om te reserveren · Prijs excl. BTW</p>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 bg-[#F8F9FA]">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-5 h-5 animate-spin text-[#FFD700]" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <MapPin className="w-8 h-8 mx-auto mb-3 opacity-40" />
                <p className="text-sm">Geen locaties gevonden.</p>
              </div>
            ) : (
              filtered.map((loc, i) => (
                <LocCard
                  key={loc.id}
                  loc={loc}
                  isSelected={selectedIds.includes(loc.id)}
                  ref={(el) => { cardRefs.current[loc.id] = el; }}
                  onToggle={() => toggleSelect(loc.id)}
                  onHover={() => { if (isValidCoord(loc)) setFlyTo(loc); }}
                  index={i}
                />
              ))
            )}
          </div>
        </div>
        <div className="w-[40%] flex flex-col p-3 bg-[#F8F9FA]">
          <div className="flex-1 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            <MapView flyTo={flyTo} filtered={filtered} selectedIds={selectedIds} onPinClick={handlePinClick} isLoading={isLoading} />
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex flex-col md:hidden flex-1 overflow-hidden">
        <div className="flex-shrink-0 h-[260px] border-b border-gray-100">
          <MapView flyTo={flyTo} filtered={filtered} selectedIds={selectedIds} onPinClick={handlePinClick} isLoading={isLoading} />
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#F8F9FA]">
          {isLoading ? <div className="flex items-center justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-[#FFD700]" /></div>
            : filtered.map((loc, i) => (
              <LocCard key={loc.id} loc={loc} isSelected={selectedIds.includes(loc.id)}
                ref={(el) => { cardRefs.current[loc.id] = el; }}
                onToggle={() => toggleSelect(loc.id)}
                onHover={() => { if (isValidCoord(loc)) setFlyTo(loc); }}
                index={i} />
            ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[400]">
            <button onClick={() => setShowClaim(true)}
              className="flex items-center gap-3 bg-[#FFD700] text-[#0F172A] px-8 py-4 rounded-full font-bold text-base hover:scale-[1.03] transition-all"
              style={{ boxShadow: '0 8px 30px rgba(255,215,0,0.5), 0 2px 8px rgba(0,0,0,0.2), inset 0 -3px 0 rgba(0,0,0,0.15)' }}>
              <CheckSquare className="w-5 h-5" />
              Claim {selectedIds.length} {selectedIds.length === 1 ? 'locatie' : 'locaties'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <NewClaimModal open={showClaim} onClose={() => setShowClaim(false)} selectedLocations={selectedLocations} />
    </div>
  );
}

function MapView({ flyTo, filtered, selectedIds, onPinClick, isLoading }) {
  return (
    <>
      <style>{`.leaflet-container{background:#F1F5F9}.leaflet-control-zoom{border:none!important;box-shadow:0 2px 12px rgba(0,0,0,.08)!important;border-radius:10px!important;overflow:hidden}.leaflet-control-zoom a{background:white!important;color:#0F172A!important;border:none!important;width:32px!important;height:32px!important;line-height:32px!important}.leaflet-popup-content-wrapper{border-radius:14px;background:white;border:1px solid #E2E8F0;box-shadow:0 8px 30px rgba(0,0,0,.1)}.leaflet-popup-content{margin:10px 14px}.leaflet-popup-tip{background:white}`}</style>
      {isLoading ? <div className="h-full flex items-center justify-center bg-[#F8F9FA]"><Loader2 className="w-5 h-5 animate-spin text-[#FFD700]" /></div> : (
        <MapContainer center={[50.85, 4.35]} zoom={8} scrollWheelZoom className="w-full h-full">
          <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
          <AutoFitBounds locations={filtered} />
          <MapController flyTo={flyTo} />
          {filtered.map(loc => {
            const isSelected = selectedIds.includes(loc.id);
            const badge = populariteitBadge(loc);
            const coords = getLocCoords(loc);
            return (
              <CircleMarker key={loc.id} center={coords}
                radius={isSelected ? 10 : 7}
                pathOptions={{ color: isSelected ? '#0F172A' : '#FFD700', fillColor: '#FFD700', fillOpacity: 1, weight: isSelected ? 3 : 1.5 }}
                eventHandlers={{ click: () => onPinClick(loc) }}>
                <Popup>
                  <div className="min-w-[180px]">
                    <div className="font-semibold text-sm text-[#0F172A] leading-snug">{loc.adres}</div>
                    <div className="text-gray-400 text-xs mt-0.5">{loc.post_code}{loc.stad ? ` — ${loc.stad}` : ''}</div>
                    <div className="text-gray-400 text-xs mt-0.5">Panels: {loc.panel_nummers}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${badge.color}`}>{badge.label}</span>
                      <span className="font-bold text-xs text-[#0F172A]">€{CLIENT_PRICE}/week</span>
                    </div>
                    <div className="text-[9px] text-gray-400 mt-0.5">Excl. BTW</div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      )}
    </>
  );
}

const LocCard = React.forwardRef(function LocCard({ loc, isSelected, onToggle, onHover, index }, ref) {
  const badge = populariteitBadge(loc);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.5) }}
      onMouseEnter={onHover} onClick={onToggle}
      className={`bg-white rounded-xl cursor-pointer transition-all duration-150 select-none ${isSelected ? 'ring-2 ring-[#FFD700] shadow-[0_4px_20px_rgba(255,215,0,0.2)]' : 'shadow-sm hover:shadow-md'}`}>
      <div className="flex items-start gap-3 p-4">
        <div className="flex-shrink-0 mt-0.5">
          {isSelected ? <CheckSquare className="w-5 h-5 text-[#FFD700]" /> : <Square className="w-5 h-5 text-gray-300" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <p className="font-semibold text-[#0F172A] text-sm leading-snug">{loc.adres}</p>
              <p className="text-xs text-gray-400 mt-0.5">{loc.post_code}{loc.stad ? ` — ${loc.stad}` : ''}</p>
            </div>
            <span className={`flex-shrink-0 text-[9px] font-bold px-2 py-1 rounded-full ${badge.color}`}>{badge.label}</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1 truncate">Panels: {loc.panel_nummers}</p>
          <div className="flex items-center gap-3 mt-2">
            <div className="inline-flex items-baseline gap-1 bg-[#FFD700]/15 px-2.5 py-1 rounded-lg">
              <span className="font-clash font-bold text-[#0F172A] text-base leading-none">€{CLIENT_PRICE}</span>
              <span className="text-[#0F172A]/50 text-[10px]">/week</span>
            </div>
            <span className="text-[10px] text-gray-400">Excl. BTW</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
