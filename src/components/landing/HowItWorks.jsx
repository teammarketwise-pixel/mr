import React from 'react';
import { Target, Map, Handshake } from 'lucide-react';

const STEPS = [
  {
    icon: Target,
    number: '01',
    title: 'Definieer uw doel',
    desc: 'Vertel ons uw budget, regio en doelgroep. Onze AI matcht u direct met de beste locaties in ons netwerk van 12.000+ borden.',
  },
  {
    icon: Map,
    number: '02',
    title: 'Ontvang uw rapport',
    desc: 'Binnen 2 minuten krijgt u een dynamisch overzicht met match-scores, bereik, prijzen en beschikbaarheid per locatie.',
  },
  {
    icon: Handshake,
    number: '03',
    title: 'Boek uw campagne',
    desc: 'Selecteer uw favorieten en wij regelen de boeking met de eigenaren. Geen verborgen kosten, altijd transparant.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-concrete/50">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-20">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
            ── Hoe het werkt
          </span>
          <h2 className="font-clash font-semibold text-4xl md:text-6xl mt-6 leading-[1]">
            Van idee naar <span className="italic text-muted-foreground">straatbeeld</span>
            <br />in drie stappen.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {STEPS.map((step, i) => (
            <div key={i} className="group relative">
              <div className="bg-background border border-border rounded-3xl p-8 h-full transition-all hover:border-ink-slate hover:-translate-y-1 duration-300">
                <div className="flex items-start justify-between mb-8">
                  <div className="w-12 h-12 rounded-full bg-cyber-yellow flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-ink-slate" strokeWidth={2} />
                  </div>
                  <span className="font-clash text-5xl font-semibold text-concrete group-hover:text-cyber-yellow transition-colors">
                    {step.number}
                  </span>
                </div>
                <h3 className="font-clash text-2xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>

              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-5 z-10">
                  <div className="w-10 h-[2px] vector-path" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
