import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

function useCountUp(end, duration = 1600, decimals = 0) {
  const [count, setCount] = useState(0);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (!triggered) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = end * eased;
      setCount(decimals > 0 ? Number(current.toFixed(decimals)) : Math.floor(current));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [triggered, end, duration, decimals]);

  return [count, setTriggered];
}

function CountStat({ value, suffix = '', prefix = '', label, delay = 0, decimals = 0 }) {
  const ref = useRef(null);
  const [count, setTriggered] = useCountUp(value, 1600, decimals);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !seen) {
          setSeen(true);
          setTimeout(() => setTriggered(true), delay);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [seen, delay, setTriggered]);

  const display = value >= 1000
    ? count.toLocaleString('nl-NL')
    : decimals > 0 ? count.toFixed(decimals) : count;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className="text-center"
    >
      <div className="font-clash text-4xl md:text-5xl font-semibold text-[#0F172A]">
        {prefix}<span className="text-[#FFD700]">{display}</span>{suffix}
      </div>
      <div className="text-xs text-gray-400 uppercase tracking-wider mt-2">{label}</div>
    </motion.div>
  );
}

export default function CountUpStats() {
  return (
    <section className="py-16 md:py-24 bg-white border-y border-gray-100">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
          <CountStat value={4218} label="OOH locaties" delay={0} />
          <CountStat value={500} suffix="+" label="Tevreden klanten" delay={150} />
          <CountStat value={327} label="Gemeenten gedekt" delay={300} />
          <CountStat value={2} suffix=" min" label="Tot rapport" delay={450} />
        </div>
      </div>
    </section>
  );
}
