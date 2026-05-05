import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/shared/Navbar';
import { MapPin, ArrowRight, Cpu } from 'lucide-react';

const BG = 'https://media.base44.com/images/public/69e13864d740c55bded1c850/10ddbf30d_nelson-ndongala-6VBVp-V0txQ-unsplash.jpg';

const REGIONS = [
  'Antwerpen', 'Brussel', 'Amsterdam', 'Rotterdam', 'Den Haag',
  'Utrecht', 'Gent', 'Luik', 'Eindhoven', 'Groningen'
];

export default function Regio() {
  const navigate = useNavigate();
  const [region, setRegion] = useState('');
  const [input, setInput] = useState('');
  const [showSugg, setShowSugg] = useState(false);

  const filtered = REGIONS.filter(r => r.toLowerCase().includes(input.toLowerCase()) && input.length > 0);

  const handleGenerate = () => {
    if (!region) return;
    sessionStorage.setItem('mr_region', region);
    navigate('/kaart');
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background */}
      <div className="absolute inset-0 w-full h-full">
        <img src={BG} alt="background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <Navbar />

      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-32">
        <div className="w-full max-w-xl">
          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-2">
              {[1,2,3].map(s => (
                <React.Fragment key={s}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    s < 2 ? 'bg-white/10 border border-[#FFD700]/60 text-white/60' :
                    s === 2 ? 'bg-[#FFD700] text-[#0F172A]' :
                    'bg-white/10 text-white/40 border border-white/20'
                  }`}>{s}</div>
                  {s < 3 && <div className={`w-8 h-[1px] ${s < 2 ? 'bg-[#FFD700]/60' : 'bg-white/20'}`} />}
                </React.Fragment>
              ))}
            </div>
            <span className="text-white/40 text-xs ml-2">Stap 2 van 3</span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <Cpu className="w-4 h-4 text-[#FFD700]" />
            <span className="text-white text-xs font-medium uppercase tracking-widest">Algoritmische Targeting</span>
          </div>
          <h1 className="font-clash text-4xl md:text-5xl font-semibold text-white mb-2 leading-tight">
            Stap 2: Selecteer<br />Regio
          </h1>
          <p className="text-white/60 mb-10 text-sm">
            Onze motor filtert het volledige netwerk op maximale impact in uw geselecteerde regio.
          </p>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-6">
            <div className="relative mb-4">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={input}
                onChange={(e) => { setInput(e.target.value); setRegion(''); setShowSugg(true); }}
                onFocus={() => setShowSugg(true)}
                onBlur={() => setTimeout(() => setShowSugg(false), 200)}
                placeholder="Typ een stad of regio..."
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#FFD700] placeholder:text-white/30 text-lg"
              />
              {region && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#FFD700] rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-[#0F172A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              {showSugg && filtered.length > 0 && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-[#0F172A]/95 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden z-20 shadow-xl">
                  {filtered.slice(0, 5).map(r => (
                    <button
                      key={r}
                      onMouseDown={() => { setRegion(r); setInput(r); setShowSugg(false); }}
                      className="w-full text-left px-4 py-3 hover:bg-white/10 text-white text-sm flex items-center gap-3 transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#FFD700]" />
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-white/40 self-center mr-1">Populair:</span>
              {['Antwerpen', 'Brussel', 'Amsterdam', 'Rotterdam'].map(r => (
                <button
                  key={r}
                  onMouseDown={() => { setRegion(r); setInput(r); }}
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                    region === r
                      ? 'bg-[#FFD700] text-[#0F172A] border-[#FFD700]'
                      : 'border-white/20 text-white/60 hover:border-white/40 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/planner')}
              className="px-5 py-4 rounded-full border border-white/20 text-white/60 text-sm hover:bg-white/10 transition-colors"
            >
              Terug
            </button>
            <button
              onClick={handleGenerate}
              disabled={!region}
              className="flex-1 flex items-center justify-center gap-2 bg-[#FFD700] text-[#0F172A] py-4 rounded-full font-semibold text-base hover:scale-[1.01] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-[0_4px_24px_rgba(255,215,0,0.3)]"
            >
              Genereer AI-Kaart
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
