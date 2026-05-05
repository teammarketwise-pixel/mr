import React from 'react';
import { MapPin, TrendingUp, Zap } from 'lucide-react';

export default function NetworkShowcase() {
  return (
    <section id="network" className="py-24 md:py-32">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-6">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
              ── Het netwerk
            </span>
            <h2 className="font-clash font-semibold text-4xl md:text-6xl mt-6 leading-[1]">
              Eén platform.
              <br />
              <span className="text-muted-foreground">Alle exploitanten.</span>
            </h2>
            <p className="mt-8 text-lg text-muted-foreground max-w-lg leading-relaxed">
              We zijn onafhankelijk. Dat betekent dat we u koppelen aan het volledige
              Europese OOH-aanbod — van JCDecaux tot lokale specialisten.
              Niet wat wij willen verkopen, maar wat voor u werkt.
            </p>

            <div className="mt-12 space-y-6">
              {[
                { icon: MapPin, stat: '12.000+', label: 'OOH locaties door heel Europa' },
                { icon: TrendingUp, stat: '98%', label: 'Doelgroep match accuracy' },
                { icon: Zap, stat: '< 2 min', label: 'Gemiddelde tijd tot rapport' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6 py-4 border-b border-border">
                  <div className="w-12 h-12 rounded-full bg-concrete flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-ink-slate" />
                  </div>
                  <div className="flex-1">
                    <div className="font-clash text-3xl font-semibold">{item.stat}</div>
                    <div className="text-sm text-muted-foreground">{item.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative bg-ink-slate rounded-3xl overflow-hidden aspect-[4/5] p-8">
              {/* Grid background */}
              <div className="absolute inset-0 opacity-[0.05]" style={{
                backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }} />

              {/* Pins */}
              {[
                { top: '18%', left: '25%', delay: 0 },
                { top: '35%', left: '55%', delay: 0.5 },
                { top: '52%', left: '30%', delay: 1 },
                { top: '68%', left: '70%', delay: 1.5 },
                { top: '25%', left: '75%', delay: 0.8 },
              ].map((pin, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{ top: pin.top, left: pin.left }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 w-4 h-4 rounded-full bg-cyber-yellow pulse-ring" style={{ animationDelay: `${pin.delay}s` }} />
                    <div className="relative w-4 h-4 rounded-full bg-cyber-yellow border-2 border-ink-slate" />
                  </div>
                </div>
              ))}

              {/* Connecting lines */}
              <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                <line x1="25%" y1="18%" x2="55%" y2="35%" stroke="#FFD200" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
                <line x1="55%" y1="35%" x2="30%" y2="52%" stroke="#FFD200" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
                <line x1="30%" y1="52%" x2="70%" y2="68%" stroke="#FFD200" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
              </svg>

              {/* Labels */}
              <div className="absolute bottom-8 left-8 right-8">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-white/60 uppercase tracking-wider">Live netwerk</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyber-yellow animate-pulse" />
                      <span className="text-xs text-white/80">Actief</span>
                    </div>
                  </div>
                  <div className="font-clash text-3xl font-semibold text-white">Europa</div>
                  <div className="text-xs text-white/60 mt-1">Amsterdam · Berlin · Paris · London · Madrid</div>
                </div>
              </div>

              {/* Top corner stat */}
              <div className="absolute top-8 right-8 text-right">
                <div className="text-xs text-white/40 uppercase tracking-wider">Matched</div>
                <div className="font-clash text-4xl font-semibold text-cyber-yellow">92%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
