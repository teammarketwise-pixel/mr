import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { SlidersHorizontal, MapPin, X, TrendingUp, Users, Euro, Flame, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function formatReach(n) {
  if (!n) return '—';
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return String(n);
}

export default function LiveMapTool() {
  const [cityFilter, setCityFilter] = useState('');
  const [budget, setBudget] = useState(10000);
  const [selected, setSelected] = useState(null);

  const { data: locations = [] } = useQuery({
    queryKey: ['locations'],
    queryFn: () => base44.entities.Location.list(),
  });

  const filtered = useMemo(() => {
    return locations.filter(loc => {
      const budgetOk = loc.price_per_week <= budget;
      const cityOk = !cityFilter || loc.city.toLowerCase().includes(cityFilter.toLowerCase()) || loc.region.toLowerCase().includes(cityFilter.toLowerCase());
      return budgetOk && cityOk;
    });
  }, [locations, budget, cityFilter]);

  const budgetPct = ((budget - 500) / (10000 - 500)) * 100;

  return (
    <section id="live-kaart" className="relative w-full" style={{ height: '85vh', minHeight: '600px' }}>
      {/* Map */}
      <div className="absolute inset-0">
        <style>{`
          .leaflet-container { background: #E8EEF4; }
          .leaflet-tile { filter: grayscale(85%) contrast(0.92) brightness(1.06); }
          .leaflet-control-zoom { border: none !important; box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important; border-radius: 12px !important; overflow: hidden; }
          .leaflet-control-zoom a { background: white !important; color: #0F172A !important; border: none !important; width: 36px !important; height: 36px !important; line-height: 36px !important; }
          .leaflet-popup-content-wrapper { border-radius: 16px; box-shadow: 0 8px 40px rgba(0,0,0,0.15); border: none; }
          .leaflet-popup-tip { display: none; }
        `}</style>
        <MapContainer
          center={[50.9990, 4.3800]}
          zoom={9}
          scrollWheelZoom={true}
          className="w-full h-full"
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          {filtered.map((loc) => (
            <React.Fragment key={loc.id}>
              <CircleMarker
                center={[loc.latitude, loc.longitude]}
                radius={selected?.id === loc.id ? 22 : 15}
                pathOptions={{ color: '#FFD700', fillColor: '#FFD700', fillOpacity: 0.2, weight: 0 }}
              />
              <CircleMarker
                center={[loc.latitude, loc.longitude]}
                radius={selected?.id === loc.id ? 10 : 7}
                pathOptions={{ color: '#0F172A', fillColor: '#FFD700', fillOpacity: 1, weight: 2.5 }}
                eventHandlers={{ click: () => setSelected(loc) }}
              >
                <Popup>
                  <div className="p-1 min-w-[180px]">
                    <div className="font-semibold text-sm text-[#0F172A]">{loc.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{loc.city}</div>
                    <div className="mt-2 inline-flex items-center gap-1 bg-[#FFD700] px-2 py-1 rounded-md text-xs font-bold text-[#0F172A]">
                      €{loc.price_per_week.toLocaleString('nl-NL')}/week
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            </React.Fragment>
          ))}
          {/* Grey-out markers for filtered-out locations */}
          {locations.filter(loc => !filtered.find(f => f.id === loc.id)).map((loc) => (
            <CircleMarker
              key={`grey-${loc.id}`}
              center={[loc.latitude, loc.longitude]}
              radius={5}
              pathOptions={{ color: '#94a3b8', fillColor: '#94a3b8', fillOpacity: 0.4, weight: 1 }}
            />
          ))}
        </MapContainer>
      </div>

      {/* Floating Filter Panel */}
      <div className="absolute top-6 left-6 z-[400] w-full max-w-[320px]">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.15)] border border-white/60 p-5">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="w-4 h-4 text-[#0F172A]" />
            <span className="font-clash font-semibold text-sm">Filter Locaties</span>
            <div className="ml-auto flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-pulse" />
              <span className="text-[10px] text-gray-500 font-medium">{filtered.length} actief</span>
            </div>
          </div>

          {/* City input */}
          <div className="mb-4">
            <label className="text-[10px] uppercase tracking-wider text-gray-400 font-medium block mb-1.5">Stad / Locatie</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                placeholder="Antwerpen, Brussel..."
                className="w-full bg-[#F1F5F9] border-0 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700] font-medium"
              />
              {cityFilter && (
                <button onClick={() => setCityFilter('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-3.5 h-3.5 text-gray-400" />
                </button>
              )}
            </div>
            <div className="flex gap-2 mt-2">
              {['Antwerpen', 'Brussel'].map(c => (
                <button
                  key={c}
                  onClick={() => setCityFilter(c === cityFilter ? '' : c)}
                  className={`text-[10px] px-2.5 py-1 rounded-full border font-medium transition-all ${
                    cityFilter === c ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Budget slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Max. Budget</label>
              <span className="font-clash font-semibold text-sm text-[#0F172A]">
                €{budget.toLocaleString('nl-NL')}<span className="text-[#FFD700]">/wk</span>
              </span>
            </div>
            {/* Chunky yellow slider */}
            <div className="relative h-8 flex items-center">
              <div className="absolute inset-0 flex items-center">
                <div className="relative w-full h-5 bg-[#F1F5F9] rounded-xl overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-[#FFD700] rounded-xl transition-all"
                    style={{ width: `${budgetPct}%` }}
                  >
                    <div className="absolute inset-0 opacity-20" style={{
                      backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(0,0,0,0.1) 6px, rgba(0,0,0,0.1) 8px)'
                    }} />
                  </div>
                </div>
              </div>
              <input
                type="range"
                min={500}
                max={10000}
                step={100}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="relative w-full opacity-0 h-8 cursor-pointer"
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>€500</span>
              <span>€5K</span>
              <span>€10K+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Side panel for selected location */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="absolute top-0 right-0 bottom-0 z-[400] w-full max-w-[360px] bg-white shadow-[-8px_0_40px_rgba(0,0,0,0.12)] overflow-y-auto"
          >
            <div className="relative">
              <img
                src={selected.photo_url}
                alt={selected.name}
                className="w-full h-52 object-cover"
              />
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md"
              >
                <X className="w-4 h-4" />
              </button>
              {selected.popular && (
                <div className="absolute top-4 left-4 flex items-center gap-1 bg-[#0F172A]/90 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                  <Flame className="w-3 h-3 text-[#FFD700]" /> POPULAIR
                </div>
              )}
              <div className="absolute bottom-4 left-4">
                <span className="bg-[#FFD700] text-[#0F172A] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                  {selected.type}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start gap-1 text-xs text-gray-400 mb-1">
                <MapPin className="w-3 h-3 mt-0.5" />
                {selected.city}, {selected.region}
              </div>
              <h3 className="font-clash text-2xl font-semibold text-[#0F172A] leading-tight mb-1">
                {selected.name}
              </h3>
              <p className="text-xs text-gray-400 mb-5">{selected.subtype}</p>

              {selected.available_slots <= 2 && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-semibold text-red-600">
                    Nog maar {selected.available_slots} slot{selected.available_slots === 1 ? '' : 's'} beschikbaar!
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-[#F1F5F9] rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Euro className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-[10px] uppercase tracking-wider text-gray-400">Prijs/week</span>
                  </div>
                  <div className="font-clash font-semibold text-lg text-[#0F172A]">
                    €{selected.price_per_week.toLocaleString('nl-NL')}
                  </div>
                </div>
                <div className="bg-[#F1F5F9] rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-[10px] uppercase tracking-wider text-gray-400">Bereik/week</span>
                  </div>
                  <div className="font-clash font-semibold text-lg text-[#0F172A]">
                    {formatReach(selected.weekly_reach)}
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <div className="flex items-center gap-1.5 mb-2">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[10px] uppercase tracking-wider text-gray-400">Doelgroep</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(selected.target_audience_tags || '').split(',').map(tag => (
                    <span key={tag} className="text-[10px] bg-[#FFD700]/20 text-[#0F172A] font-medium px-2.5 py-1 rounded-full">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <a
                href={`#contact`}
                className="w-full flex items-center justify-center gap-2 bg-[#FFD700] text-[#0F172A] py-3.5 rounded-full font-semibold text-sm hover:scale-[1.01] transition-all"
                onClick={() => setSelected(null)}
              >
                Vraag Beschikbaarheid Aan
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                onClick={() => setSelected(null)}
                className="w-full mt-2 text-xs text-gray-400 hover:text-gray-600 py-2 transition-colors"
              >
                Sluiten
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom count bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[400]">
        <div className="bg-[#0F172A]/90 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-sm flex items-center gap-3 shadow-xl">
          <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" />
          <span className="font-medium"><span className="text-[#FFD700] font-bold">{filtered.length}</span> locaties binnen budget</span>
          <span className="text-white/30">·</span>
          <span className="text-white/60 text-xs">{locations.length - filtered.length} buiten filter</span>
        </div>
      </div>
    </section>
  );
}
