import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Eye, TrendingUp, ShieldCheck } from 'lucide-react';

const REASONS = [
  {
    icon: Zap,
    title: 'Razendsnel',
    desc: 'Geen wachttijd. Geen salesgesprekken. Onze kaart toont live beschikbaarheid en prijzen — u heeft een rapport in 2 minuten.',
  },
  {
    icon: Eye,
    title: 'Volledig Transparant',
    desc: 'Elke prijs die u ziet is de echte prijs. Geen verborgen kosten, geen verrassingen achteraf. Wij zijn onafhankelijk en verdienen niets aan opslag.',
  },
  {
    icon: TrendingUp,
    title: 'Data-gedreven Keuzes',
    desc: 'Elke locatie heeft een wekelijks bereik, doelgroep-match en beschikbaarheidscore. U kiest op basis van feiten, niet op gevoel.',
  },
  {
    icon: ShieldCheck,
    title: 'Gemaakt voor het MKB',
    desc: 'OOH advertising was ooit alleen voor grote merken. Market Rise maakt het toegankelijk voor elk budget, vanaf €500 per week.',
  },
];

export default function WhyMarketRise() {
  return (
    <section className="py-24 md:py-32 bg-[#0F172A] overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5">
            <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-medium">── Waarom Market Rise?</span>
            <h2 className="font-clash font-semibold text-4xl md:text-6xl mt-4 leading-[1] text-white">
              OOH advertising
              <br />
              <span className="text-[#FFD700]">zonder de</span>
              <br />
              ruis.
            </h2>
            <p className="mt-6 text-white/50 text-lg leading-relaxed max-w-md">
              Market Rise is opgericht om Out-of-Home advertising eerlijk, snel en
              toegankelijk te maken voor elke ondernemer in België en Nederland.
            </p>
            <a
              href="#contact"
              className="mt-8 inline-flex items-center gap-2 bg-[#FFD700] text-[#0F172A] px-6 py-3.5 rounded-full font-semibold text-sm hover:scale-[1.02] transition-all"
            >
              Gratis Adviesgesprek
            </a>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {REASONS.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 hover:border-white/20 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FFD700]/10 flex items-center justify-center mb-4">
                  <r.icon className="w-5 h-5 text-[#FFD700]" />
                </div>
                <h3 className="font-clash text-lg font-semibold text-white mb-2">{r.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
