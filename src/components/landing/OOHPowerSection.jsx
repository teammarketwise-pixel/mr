import React from 'react';
import { motion } from 'framer-motion';
import { Eye, TrendingUp, Cpu } from 'lucide-react';

const SECTIONS = [
  {
    icon: Eye,
    tag: 'De Onverslaanbare Kracht van OOH',
    text: 'In een wereld vol digitale ruis is Out-of-Home marketing het laatste medium dat niet genegeerd kan worden. Terwijl online advertenties worden weggeklikt of geblokkeerd, is een fysieke uiting in de stad onvermijdelijk. Het bouwt onbewust aan autoriteit en vertrouwen. Wanneer mensen uw merk op straat zien, wordt u onderdeel van hun dagelijkse realiteit.',
  },
  {
    icon: TrendingUp,
    tag: 'Maximale Zichtbaarheid, 24/7',
    text: 'Uw merk slaapt nooit. Of het nu gaat om monumentale billboards langs de snelweg of flitsende digitale schermen in het hart van de stad: u bent aanwezig op de momenten dat het telt. Wij ontsluiten een netwerk dat zorgt voor een constante herkenning, dag en nacht.',
  },
  {
    icon: Cpu,
    tag: 'Data-Driven Dominantie',
    text: 'Stop met gokken op locaties. Onze AI scant realtime passantenstromen en zichtbaarheidsdata. U krijgt de hoogste ROI voor uw budget door onze persoonlijke selectie en algoritmische matching.',
  },
];

export default function OOHPowerSection() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {SECTIONS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="w-10 h-10 rounded-xl bg-[#FFD700] flex items-center justify-center mb-5">
                <s.icon className="w-5 h-5 text-[#0F172A]" />
              </div>
              <h3 className="font-clash text-xl font-semibold text-[#0F172A] mb-3">{s.tag}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
