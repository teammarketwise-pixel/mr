import React from 'react';
import { Lightbulb } from 'lucide-react';

export default function Logo({ className = '', dark = false }) {
  const textColor = dark ? 'text-white' : 'text-ink-slate';
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <Lightbulb className="w-7 h-7 text-cyber-yellow" fill="currentColor" strokeWidth={1.5} />
      </div>
      <div className="flex flex-col leading-none">
        <span className={`font-clash font-semibold text-xl tracking-tight ${textColor}`}>
          MarketRise
        </span>
        <span className={`text-[9px] tracking-[0.2em] uppercase ${dark ? 'text-white/60' : 'text-muted-foreground'}`}>
          Out of Home Marketing
        </span>
      </div>
    </div>
  );
}
