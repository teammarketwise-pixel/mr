import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MapPin, Users, Wallet, Check } from 'lucide-react';
import BudgetSlider from './BudgetSlider';

const REGIONS = [
  'Amsterdam', 'Rotterdam', 'Den Haag', 'Utrecht', 'Eindhoven',
  'Groningen', 'Maastricht', 'Nijmegen', 'Noord-Holland',
  'Zuid-Holland', 'Noord-Brabant', 'Limburg', 'Gelderland'
];

const AUDIENCES = [
  { value: 'Zakelijke Beslissers', label: 'Zakelijke Beslissers', desc: 'C-level, managers, professionals' },
  { value: 'Shoppers', label: 'Shoppers', desc: 'Winkelpubliek, retail consumers' },
  { value: 'Studenten', label: 'Studenten', desc: 'Young adults, universities' },
  { value: 'Dagjesmensen', label: 'Dagjesmensen', desc: 'Toeristen, families, vrije tijd' },
];

export default function OnboardingWidget() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [budget, setBudget] = useState(1); // index into REACH_STEPS
  const [region, setRegion] = useState('');
  const [regionInput, setRegionInput] = useState('');
  const [audience, setAudience] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filtered = REGIONS.filter(r => r.toLowerCase().includes(regionInput.toLowerCase()));

  const canProceed = () => {
    if (step === 1) return budget > 0;
    if (step === 2) return region !== '';
    if (step === 3) return audience !== '';
    return false;
  };

  const handleGenerate = () => {
    navigate('/planner');
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else handleGenerate();
  };

  return (
    <section id="onboarding" className="relative py-24 md:py-32 bg-background">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Context */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
              ── Start gratis rapport
            </span>
            <h2 className="font-clash font-semibold text-4xl md:text-6xl mt-6 leading-[1]">
              In 3 stappen
              <br />
              naar uw perfecte
              <br />
              <span className="bg-cyber-yellow px-2">OOH plan.</span>
            </h2>
            <p className="mt-6 text-muted-foreground text-lg max-w-md leading-relaxed">
              Geen salesgesprek. Geen commitment. Alleen data-gedreven aanbevelingen
              op basis van uw gewenste bereik, regio en doelgroep.
            </p>

            {/* Progress indicator */}
            <div className="mt-10 flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    s < step ? 'bg-ink-slate text-white' :
                    s === step ? 'bg-cyber-yellow text-ink-slate' :
                    'bg-concrete text-muted-foreground'
                  }`}>
                    {s < step ? <Check className="w-4 h-4" /> : s}
                  </div>
                  {s < 3 && <div className={`w-12 h-[2px] ${s < step ? 'bg-ink-slate' : 'bg-concrete'}`} />}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Widget */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-border rounded-3xl p-8 md:p-10 shadow-[0_1px_2px_rgba(0,0,0,0.02),0_8px_40px_rgba(0,0,0,0.06)]">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-concrete flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-ink-slate" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Stap 01</p>
                        <h3 className="font-clash text-2xl font-semibold">Wat is uw gewenste bereik?</h3>
                      </div>
                    </div>
                    <BudgetSlider value={budget} onChange={setBudget} />
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-concrete flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-ink-slate" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Stap 02</p>
                        <h3 className="font-clash text-2xl font-semibold">In welke regio wilt u zichtbaar zijn?</h3>
                      </div>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        value={regionInput}
                        onChange={(e) => {
                          setRegionInput(e.target.value);
                          setRegion('');
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        placeholder="Bijv. Amsterdam, Rotterdam..."
                        className="w-full bg-concrete border-0 rounded-2xl px-6 py-5 text-lg font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyber-yellow"
                      />
                      {showSuggestions && regionInput && filtered.length > 0 && (
                        <div className="absolute top-full mt-2 left-0 right-0 bg-card border border-border rounded-2xl shadow-lg overflow-hidden z-20 max-h-60 overflow-y-auto">
                          {filtered.slice(0, 6).map((r) => (
                            <button
                              key={r}
                              type="button"
                              onMouseDown={() => {
                                setRegion(r);
                                setRegionInput(r);
                                setShowSuggestions(false);
                              }}
                              className="w-full text-left px-5 py-3 hover:bg-concrete transition-colors flex items-center gap-3 text-sm"
                            >
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              {r}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs text-muted-foreground mr-2 self-center">Populair:</span>
                      {['Amsterdam', 'Rotterdam', 'Utrecht', 'Den Haag'].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => {
                            setRegion(r);
                            setRegionInput(r);
                          }}
                          className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                            region === r
                              ? 'bg-ink-slate text-white border-ink-slate'
                              : 'bg-transparent text-foreground border-border hover:border-ink-slate'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-concrete flex items-center justify-center">
                        <Users className="w-5 h-5 text-ink-slate" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Stap 03</p>
                        <h3 className="font-clash text-2xl font-semibold">Wie is uw doelgroep?</h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {AUDIENCES.map((a) => (
                        <button
                          key={a.value}
                          type="button"
                          onClick={() => setAudience(a.value)}
                          className={`text-left p-5 rounded-2xl border-2 transition-all ${
                            audience === a.value
                              ? 'border-cyber-yellow bg-cyber-yellow/5'
                              : 'border-border bg-background hover:border-muted-foreground/30'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className="font-semibold text-ink-slate">{a.label}</span>
                            {audience === a.value && (
                              <div className="w-5 h-5 rounded-full bg-cyber-yellow flex items-center justify-center">
                                <Check className="w-3 h-3 text-ink-slate" strokeWidth={3} />
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{a.desc}</p>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer navigation */}
              <div className="mt-10 pt-6 border-t border-border flex items-center justify-between">
                {step > 1 ? (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← Vorige
                  </button>
                ) : <div />}

                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="group inline-flex items-center gap-2 bg-cyber-yellow text-ink-slate px-6 py-3.5 rounded-full text-sm font-semibold hover:scale-[1.02] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {step === 3 ? 'Genereer Mijn Gratis Rapport' : 'Volgende stap'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
