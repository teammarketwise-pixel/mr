import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu, ArrowRight, Lock } from 'lucide-react';
import Logo from '@/components/shared/Logo';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

const BG = 'https://media.base44.com/images/public/69e13864d740c55bded1c850/aa33eccff_2KPIBKNTFRFN3C6OKCTM3S5AOEjpg.png';

export default function Toegang() {
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoadingAuth && isAuthenticated) {
      const next = sessionStorage.getItem('mr_login_next') || '/planner';
      sessionStorage.removeItem('mr_login_next');
      navigate(next);
    }
  }, [isAuthenticated, isLoadingAuth, navigate]);

  const handleLogin = () => {
    const next = sessionStorage.getItem('mr_login_next') || '/planner';
    base44.auth.redirectToLogin(window.location.origin + next);
  };

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#0F172A]">
        <div className="w-8 h-8 border-4 border-white/20 border-t-[#FFD700] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={BG} alt="background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/65 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
        backgroundSize: '80px 80px'
      }} />

      {/* Logo */}
      <div className="absolute top-7 left-8 z-20">
        <a href="/"><Logo dark /></a>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center w-full px-6 md:px-16 py-20">
        <div className="w-full max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/8 backdrop-blur-md border border-white/15 text-white px-3 py-1.5 rounded-full text-xs font-medium mb-8">
              <Lock className="w-3 h-3 text-[#FFD700]" />
              <span>Beveiligde toegang · Gratis account</span>
            </div>

            <h1 className="font-clash font-semibold text-white leading-[1.02] mb-4" style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}>
              Start uw campagne<br />
              met <span className="text-[#FFD700]">Market Rise.</span>
            </h1>
            <p className="text-white/60 text-base mb-10 leading-relaxed max-w-sm">
              Maak een gratis account aan of log in om de AI-locatiescan te starten en uw perfecte OOH-borden te vinden.
            </p>

            {/* Card */}
            <div className="bg-white/8 backdrop-blur-2xl border border-white/12 rounded-3xl p-8">
              {/* Benefits */}
              <div className="space-y-3 mb-8">
                {[
                  { text: 'AI-gestuurde locatieselectie op maat', icon: '✦' },
                  { text: 'Toegang tot alle premium OOH-borden in België', icon: '✦' },
                  { text: 'Claims indienen en campagnes beheren', icon: '✦' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-[#FFD700] text-xs">✦</span>
                    <span className="text-white/75 text-sm">{item.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={handleLogin}
                className="w-full group flex items-center justify-center gap-2.5 bg-[#FFD700] text-[#0F172A] py-4 rounded-2xl font-bold text-base hover:scale-[1.02] active:scale-[0.99] transition-all shadow-[0_8px_32px_rgba(255,215,0,0.4)]"
              >
                <Cpu className="w-4 h-4" />
                Inloggen of Registreren
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-center text-white/25 text-xs mt-4">
                Gratis · Geen creditcard vereist · 2 minuten
              </p>
            </div>

            <p className="mt-8 text-center">
              <a href="/" className="text-white/30 text-xs hover:text-white/60 transition-colors underline underline-offset-2">
                ← Terug naar de homepage
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
