import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/shared/Navbar';
import { ArrowRight, Cpu, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BG = 'https://media.base44.com/images/public/69e13864d740c55bded1c850/10ddbf30d_nelson-ndongala-6VBVp-V0txQ-unsplash.jpg';

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

const QUESTIONS = [
  {
    id: 'doelgroepen',
    title: 'Wie wilt u bereiken?',
    multi: true,
    options: [
      { value: 'Forensen', desc: 'Mensen die elke dag naar het werk reizen, bv. via trein of auto' },
      { value: 'Shoppers', desc: 'Mensen die actief op zoek zijn naar producten of diensten' },
      { value: 'Studenten', desc: 'Jongeren die studeren in de buurt' },
      { value: 'Passanten', desc: 'Mensen die toevallig voorbijkomen, bv. wandelaars of automobilisten' },
      { value: 'Stadsbewoners', desc: 'Mensen die wonen en leven in de stad' },
    ],
  },
  {
    id: 'taalgebied',
    title: 'In welke taal is uw reclame?',
    multi: true,
    note: "Als u 'Beide' kiest zoeken wij enkel locaties waar zowel Nederlands als Frans gesproken wordt. Wilt u meer bereik? Duid dan Nederlands en Frans apart aan.",
    options: [
      { value: 'NL', label: 'Nederlands' },
      { value: 'FR', label: 'Frans' },
      { value: 'Beide', label: 'Beide' },
    ],
  },
  {
    id: 'vervoersmiddel',
    title: 'Hoe verplaatst uw doelgroep zich?',
    multi: true,
    options: [
      { value: 'Auto' },
      { value: 'Te voet' },
      { value: 'Fiets' },
      { value: 'Openbaar vervoer' },
    ],
  },
  {
    id: 'locatietype',
    title: 'Waar wilt u uw doelgroep bereiken?',
    multi: true,
    options: [
      { value: 'Kruispunt' }, { value: 'Hoofdweg' }, { value: 'Ring' }, { value: 'Rotonde' },
      { value: 'Station' }, { value: 'Winkelstraat' }, { value: 'Stadscentrum' }, { value: 'Park' },
      { value: 'School of Campus' }, { value: 'Industriezone' }, { value: 'Parking' },
      { value: 'Sportcentrum' }, { value: 'Ziekenhuis' }, { value: 'Luchthaven' },
      { value: 'Horecabuurt' }, { value: 'Kust' }, { value: 'Woonwijk' },
    ],
  },
  {
    id: 'sector',
    title: 'In welke sector zit u?',
    multi: true,
    options: [
      { value: 'Retail' }, { value: 'Mode' }, { value: 'Horeca' }, { value: 'Beauty' },
      { value: 'Bank' }, { value: 'Automotive' }, { value: 'Fast Food' }, { value: 'IT' },
      { value: 'Toerisme' }, { value: 'Onderwijs' }, { value: 'Gaming' }, { value: 'Bouw' },
      { value: 'Vastgoed' }, { value: 'Gezondheid' }, { value: 'Apotheek' }, { value: 'Dieren' },
      { value: 'Cultuur' }, { value: 'Cafe en Bar' }, { value: 'Sport' },
    ],
  },
  {
    id: 'doelleeftijd',
    title: 'Welke leeftijdsgroep wilt u bereiken?',
    multi: true,
    options: [
      { value: 'Kinderen' }, { value: 'Tieners' }, { value: 'Jongvolwassenen' },
      { value: 'Volwassenen' }, { value: '50+' },
    ],
  },
  {
    id: 'gezinssamenstelling',
    title: 'Wie is uw doelgroep thuis?',
    multi: true,
    options: [
      { value: 'Gezinnen' }, { value: 'Koppels' }, { value: 'Alleenstaanden' }, { value: 'Gepensioneerden' },
    ],
  },
  {
    id: 'zichtbaarheidsduur',
    title: 'Hoe lang moet uw bord zichtbaar zijn?',
    multi: false,
    options: [
      { value: 'Korte blootstelling', desc: 'Mensen rijden snel voorbij, ideaal voor merkbekendheid' },
      { value: 'Gemiddelde blootstelling', desc: 'Mensen vertragen of stoppen even' },
      { value: 'Lange blootstelling', desc: 'Mensen staan stil of wandelen rustig, ideaal om uw boodschap volledig over te brengen' },
    ],
  },
  {
    id: 'actie',
    title: 'Wat wilt u dat mensen doen na het zien van uw reclame?',
    multi: true,
    options: [
      { value: 'Winkel bezoeken' }, { value: 'Merk onthouden' }, { value: 'Online bestellen' },
      { value: 'Website bezoeken' }, { value: 'Bellen' }, { value: 'Social media volgen' },
      { value: 'Evenement bijwonen' }, { value: 'Advies inwinnen' }, { value: 'Contacteren' },
      { value: 'Mond-tot-mond' },
    ],
  },
  {
    id: 'provincie',
    title: 'In welke provincie wilt u adverteren?',
    multi: true,
    options: Object.keys(PROVINCIE_POSTCODE).map(p => ({ value: p })),
  },
];

export default function Planner() {
  const navigate = useNavigate();
  const [step, setStep] = useState(-1); // -1 = keuze scherm, 0-9 = wizard vragen
  const [answers, setAnswers] = useState({});
  const [keuze, setKeuze] = useState(null); // 'wizard' of 'marc'

  const q = step >= 0 ? QUESTIONS[step] : null;
  const current = q ? (answers[q.id] || []) : [];

  const toggle = (val) => {
    if (!q) return;
    if (q.multi) {
      setAnswers(prev => {
        const arr = prev[q.id] || [];
        return { ...prev, [q.id]: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val] };
      });
    } else {
      setAnswers(prev => ({ ...prev, [q.id]: [val] }));
    }
  };

  const canNext = current.length > 0;

  const handleNext = () => {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      sessionStorage.setItem('mr_wizard', JSON.stringify(answers));
      navigate('/kaart');
    }
  };

  const handleBack = () => {
    if (step === 0) setStep(-1);
    else setStep(step - 1);
  };

  const pct = step >= 0 ? Math.round(((step + 1) / QUESTIONS.length) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="absolute inset-0 w-full h-full">
        <img src={BG} alt="background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/75" />
      </div>

      <Navbar />

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-28">
        <div className="w-full max-w-2xl">

          <AnimatePresence mode="wait">
            {step === -1 ? (
              /* ── Keuze scherm ── */
              <motion.div
                key="keuze"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Cpu className="w-4 h-4 text-[#FFD700]" />
                  <span className="text-white/50 text-xs uppercase tracking-widest">Hoe wilt u zoeken?</span>
                </div>
                <h1 className="font-clash text-4xl md:text-5xl font-semibold text-white mb-10 leading-tight">
                  Kies uw aanpak.
                </h1>

                <div className="space-y-4">
                  {/* Optie 1 — Wizard */}
                  <button
                    onClick={() => setKeuze('wizard')}
                    className={`w-full text-left p-7 rounded-2xl border-2 transition-all relative overflow-hidden ${keuze === 'wizard' ? 'border-[#FFD700] bg-[#FFD700]/10' : 'border-white/20 bg-white/5 hover:border-[#FFD700]/50 hover:bg-[#FFD700]/5'}`}
                  >
                    <div className="absolute top-4 right-5 flex items-center gap-1.5 bg-[#FFD700] text-[#0F172A] px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      Aanbevolen
                    </div>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${keuze === 'wizard' ? 'bg-[#FFD700]' : 'bg-white/10'}`}>
                        <Cpu className={`w-6 h-6 ${keuze === 'wizard' ? 'text-[#0F172A]' : 'text-white/60'}`} />
                      </div>
                      <div>
                        <p className={`font-clash text-2xl font-semibold mb-2 ${keuze === 'wizard' ? 'text-[#FFD700]' : 'text-white/80'}`}>Wizard</p>
                        <p className="text-white/60 text-sm leading-relaxed max-w-md">
                          Beantwoord een aantal korte vragen en ons systeem selecteert automatisch de perfecte locaties voor uw campagne. Snel, slim en zonder gedoe.
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Optie 2 — Chat met MARC */}
                  <button
                    onClick={() => setKeuze('marc')}
                    className={`w-full text-left p-7 rounded-2xl border-2 transition-all relative overflow-hidden ${keuze === 'marc' ? 'border-[#FFD700] bg-[#FFD700]/10' : 'border-white/20 bg-white/5 hover:border-[#FFD700]/50 hover:bg-[#FFD700]/5'}`}
                  >
                    <div className="absolute top-4 right-5 flex items-center gap-1.5 bg-white/10 text-white/60 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      Snelste optie
                    </div>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${keuze === 'marc' ? 'bg-[#FFD700]' : 'bg-[#FFD700]/20'}`}>
                        <span className={`font-clash font-bold text-xl ${keuze === 'marc' ? 'text-[#0F172A]' : 'text-[#FFD700]'}`}>M</span>
                      </div>
                      <div>
                        <p className={`font-clash text-2xl font-semibold mb-2 ${keuze === 'marc' ? 'text-[#FFD700]' : 'text-white/80'}`}>Chat met MARC</p>
                        <p className="text-white/60 text-sm leading-relaxed max-w-md">
                          Vertel gewoon wat u zoekt en MARC vindt in een paar vragen de perfecte locaties. Geen formulieren, gewoon een gesprek.
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Verdergaan knop */}
                  <button
                    disabled={!keuze}
                    onClick={() => keuze === 'wizard' ? setStep(0) : navigate('/marc')}
                    className="w-full flex items-center justify-center gap-2 bg-[#FFD700] text-[#0F172A] py-4 rounded-full font-bold text-base hover:scale-[1.01] transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-[0_4px_24px_rgba(255,215,0,0.3)]"
                  >
                    Verdergaan
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              /* ── Wizard vragen ── */
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25 }}
              >
                {/* Progress bar */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-[#FFD700]" />
                      <span className="text-white/60 text-xs uppercase tracking-widest">Vraag {step + 1} van {QUESTIONS.length}</span>
                    </div>
                    <span className="text-[#FFD700] text-xs font-semibold">{pct}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#FFD700] rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                <h1 className="font-clash text-3xl md:text-4xl font-semibold text-white mb-2 leading-tight">
                  {q.title}
                </h1>
                {q.multi && <p className="text-white/40 text-xs mb-1">Meerdere antwoorden mogelijk</p>}
                {!q.multi && <p className="text-white/40 text-xs mb-1">Kies 1 antwoord</p>}
                {q.note && <p className="text-white/50 text-xs italic mb-4">{q.note}</p>}

                <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-2.5">
                  {q.options.map(opt => {
                    const label = opt.label || opt.value;
                    const selected = current.includes(opt.value);
                    return (
                      <button key={opt.value} onClick={() => toggle(opt.value)}
                        className={`text-left p-4 rounded-xl border-2 transition-all ${selected ? 'border-[#FFD700] bg-[#FFD700]/10' : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'}`}>
                        <div className="flex items-start justify-between gap-2">
                          <span className={`font-semibold text-sm ${selected ? 'text-[#FFD700]' : 'text-white'}`}>{label}</span>
                          {selected && (
                            <div className="flex-shrink-0 w-4 h-4 rounded-full bg-[#FFD700] flex items-center justify-center mt-0.5">
                              <Check className="w-2.5 h-2.5 text-[#0F172A]" strokeWidth={3} />
                            </div>
                          )}
                        </div>
                        {opt.desc && <p className="text-white/40 text-xs mt-1 leading-relaxed">{opt.desc}</p>}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-3 mt-8">
                  <button onClick={handleBack}
                    className="px-5 py-4 rounded-full border border-white/20 text-white/60 text-sm hover:bg-white/10 transition-colors">
                    Terug
                  </button>
                  <button onClick={handleNext} disabled={!canNext}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#FFD700] text-[#0F172A] py-4 rounded-full font-semibold text-base hover:scale-[1.01] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-[0_4px_24px_rgba(255,215,0,0.3)]">
                    {step === QUESTIONS.length - 1 ? 'Toon Mijn Locaties' : 'Volgende'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
