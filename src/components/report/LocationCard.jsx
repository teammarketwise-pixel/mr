import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, TrendingUp, Flame, ArrowRight } from 'lucide-react';

export default function LocationCard({ location, matchScore, isSelected, onSelect, onInquire, index }) {
  const isLowStock = location.available_slots <= 2;

  const formatReach = (n) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${Math.round(n / 1000)}K`;
    return n;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onClick={onSelect}
      className={`group relative bg-card rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
        isSelected
          ? 'shadow-[0_8px_40px_rgba(0,0,0,0.1)] ring-2 ring-cyber-yellow'
          : 'shadow-[0_1px_2px_rgba(0,0,0,0.02),0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_30px_rgba(0,0,0,0.08)]'
      }`}
    >
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative md:w-[220px] h-48 md:h-auto flex-shrink-0 overflow-hidden bg-concrete">
          <img
            src={location.photo_url}
            alt={location.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {location.popular && (
            <div className="absolute top-3 left-3 bg-ink-slate/90 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Flame className="w-3 h-3 text-cyber-yellow" />
              POPULAIR
            </div>
          )}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-ink-slate text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
            {location.type}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 md:p-6 flex flex-col">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <MapPin className="w-3 h-3" />
                <span>{location.city}, {location.region}</span>
              </div>
              <h3 className="font-clash font-semibold text-lg leading-tight text-ink-slate truncate">
                {location.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">{location.subtype}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Match</div>
              <div className="font-clash font-semibold text-3xl text-cyber-yellow leading-none">
                {matchScore}%
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="flex gap-6 py-3 border-t border-b border-border my-3">
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-muted-foreground" />
              <div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Bereik/wk</div>
                <div className="text-sm font-semibold text-ink-slate">{formatReach(location.weekly_reach)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
              <div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Slots</div>
                <div className="text-sm font-semibold text-ink-slate">{location.available_slots}</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto gap-3">
            <div>
              {isLowStock && (
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                  <span className="text-[10px] font-semibold text-destructive uppercase tracking-wider">
                    Nog {location.available_slots} slot{location.available_slots === 1 ? '' : 's'}
                  </span>
                </div>
              )}
              <div className="inline-flex items-baseline gap-1 bg-cyber-yellow px-2.5 py-1 rounded-md">
                <span className="font-clash font-semibold text-ink-slate text-lg leading-none">
                  €{location.price_per_week.toLocaleString('nl-NL')}
                </span>
                <span className="text-xs text-ink-slate/70">/week</span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onInquire?.(location);
              }}
              className="group/btn inline-flex items-center gap-1.5 bg-ink-slate text-white text-xs font-semibold px-4 py-2.5 rounded-full hover:bg-ink-slate/90 transition-all"
            >
              Beschikbaarheid
              <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
