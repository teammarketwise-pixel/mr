import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

const HERO_IMAGE = 'https://media.base44.com/images/public/69e13864d740c55bded1c850/1cfb775a4_vinzent-weiskopf-Tavh8gKJQB4-unsplash.jpg';

export default function HeroSection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleScan = () => {
    sessionStorage.setItem('mr_login_next', '/planner');
    if (isAuthenticated) {
      navigate('/planner');
    } else {
      navigate('/toegang');
    }
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex flex-col justify-end pb-24 md:pb-32 pt-20">
      <div className="absolute inset-0 w-full h-full">
        <img src={HERO_IMAGE} alt="Stad bij nacht" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-black/92" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
      </div>

      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
        backgroundSize: '80px 80px'
      }} />

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 bg-white/8 backdrop-blur-md border border-white/15 text-white px-3 py-1.5 rounded-full text-xs font-medium mb-8">
            <Cpu className="w-3 h-3 text-[#FFD700]" />
            <span>AI-Powered OOH Platform</span>
            <span className="text-white/30 mx-1">·</span>
            <span className="text-[#FFD700]">heel België</span>
          </div>

          <h1 className="font-clash font-semibold text-white text-[clamp(2.8rem,7vw,6.5rem)] leading-[0.92] tracking-[-0.03em]">
            Domineer het
            <br />
            Straatbeeld.
            <br />
            <span className="text-[#FFD700]">Claim uw Impact.</span>
          </h1>

          <p className="mt-8 text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed">
            Market Rise combineert AI-precisie met persoonlijke expertise. Vind binnen
            <span className="text-[#FFD700] font-semibold"> 2 minuten</span> de perfecte locatie voor uw merk.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              onClick={handleScan}
              className="group inline-flex items-center gap-2.5 bg-[#FFD700] text-[#0F172A] px-7 py-4 rounded-full text-base font-bold hover:scale-[1.02] transition-transform shadow-[0_8px_30px_rgba(255,215,0,0.3)]"
            >
              <Cpu className="w-4 h-4" />
              Start AI-Locatie Scan
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>


          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/10"
        >
          {[
            { value: '4.218', label: 'OOH locaties' },
            { value: 'heel', label: 'België gedekt' },
            { value: '327', label: 'Gemeenten gedekt' },
            { value: '2 min', label: 'Tot uw rapport' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="font-clash text-3xl md:text-4xl font-semibold text-[#FFD700]">{stat.value}</div>
              <div className="text-xs text-white/40 uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
