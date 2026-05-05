import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScanAnimation({ onComplete }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onComplete?.(), 400);
    }, 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] bg-ink-slate flex items-center justify-center overflow-hidden"
        >
          {/* Scanning yellow bar */}
          <motion.div
            initial={{ top: '0%' }}
            animate={{ top: '100%' }}
            transition={{ duration: 1.6, ease: 'easeInOut' }}
            className="absolute left-0 right-0 h-[3px] bg-cyber-yellow shadow-[0_0_40px_#FFD200]"
            style={{ boxShadow: '0 0 60px #FFD200, 0 0 120px #FFD200' }}
          />

          {/* Grid */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />

          {/* Central text */}
          <div className="text-center relative z-10">
            <div className="text-xs uppercase tracking-[0.3em] text-cyber-yellow mb-4 animate-pulse">
              ── Scanning Network ──
            </div>
            <div className="font-clash text-3xl md:text-5xl font-semibold text-white">
              Uw rapport wordt opgebouwd
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-white/50 text-sm">
              <span>Matching locations</span>
              <span className="animate-pulse">·</span>
              <span>Calculating reach</span>
              <span className="animate-pulse">·</span>
              <span>Checking availability</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
