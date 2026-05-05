import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

const STEPS = [
  {
    number: '01',
    title: 'Initialiseer uw parameters.',
    desc: 'Voer uw gewenste bereik en doelregio in onze AI-interface in. De interface verwerkt uw input en bereidt de algoritmische selectie voor.',
  },
  {
    number: '02',
    title: 'Algoritmische Selectie.',
    desc: 'Onze motor filtert het volledige netwerk op maximale impact binnen uw bereik. Elke locatie wordt gescoord op zichtbaarheid, passantenstromen en doelgroep-match.',
  },
  {
    number: '03',
    title: 'Persoonlijke Afhandeling.',
    desc: 'Kies uw spots op de kaart en ons team regelt de volledige plaatsing en opvolging voor u. Transparant, snel en met gegarandeerde impact.',
  },
];

export default function HowItWorksSection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleScan = () => {
    sessionStorage.setItem('mr_login_next', '/planner');
    if (isAuthenticated) navigate('/planner');
    else navigate('/toegang');
  };

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-[#F1F5F9]">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium">Hoe het Werkt</span>
          <h2 className="font-clash font-semibold text-4xl md:text-6xl mt-4 leading-[1] text-[#0F172A]">
            Van kaart naar
            <br />
            <span className="italic text-gray-400">campagne</span> in drie stappen.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group bg-white rounded-3xl p-8 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#FFD700] flex items-center justify-center">
                  <span className="font-clash font-bold text-[#0F172A] text-sm">{step.number}</span>
                </div>
                <span className="font-clash text-5xl font-semibold text-[#F1F5F9] group-hover:text-[#FFD700] transition-colors">
                  {step.number}
                </span>
              </div>
              <h3 className="font-clash text-xl font-semibold mb-3 text-[#0F172A]">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleScan}
            className="inline-flex items-center gap-2 bg-[#FFD700] text-[#0F172A] px-7 py-4 rounded-full font-bold text-base hover:scale-[1.02] transition-all shadow-[0_4px_20px_rgba(255,215,0,0.25)]"
          >
            Start Nu de AI-Scan
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
