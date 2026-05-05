import React from 'react';

const REACH_STEPS = [10000, 100000, 500000, 1000000, 5000000];

function formatReach(v) {
  if (v >= 1000000) return `${(v / 1000000).toFixed(v % 1000000 === 0 ? 0 : 1)}M`;
  if (v >= 1000) return `${Math.round(v / 1000)}K`;
  return String(v);
}

// value = index into REACH_STEPS, onChange(index)
export default function BudgetSlider({ value, onChange }) {
  const idx = typeof value === 'number' && value < REACH_STEPS.length ? value : 1;
  const reach = REACH_STEPS[idx];
  const percentage = (idx / (REACH_STEPS.length - 1)) * 100;
  const barHeight = 24 + (percentage / 100) * 48;

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Gewenst Bereik</p>
          <div className="font-clash text-4xl md:text-5xl font-semibold text-ink-slate mt-1">
            {formatReach(reach)}{idx === REACH_STEPS.length - 1 && <span className="text-cyber-yellow">+</span>}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Weergaven</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Dominantie</p>
          <p className="font-clash text-xl font-medium">
            {Math.round(percentage)}% <span className="text-muted-foreground text-sm">dominant</span>
          </p>
        </div>
      </div>

      {/* Chunky tactile slider */}
      <div className="relative">
        <div
          className="w-full relative bg-concrete rounded-xl overflow-hidden transition-all duration-300"
          style={{ height: `${barHeight}px` }}
        >
          <div
            className="absolute top-0 left-0 h-full bg-cyber-yellow transition-all duration-200 rounded-xl"
            style={{ width: `${percentage}%` }}
          >
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,0,0,0.1) 8px, rgba(0,0,0,0.1) 10px)'
            }} />
          </div>

          <input
            type="range"
            min={0}
            max={REACH_STEPS.length - 1}
            step={1}
            value={idx}
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        <div className="flex justify-between mt-3 text-[10px] text-muted-foreground/70 font-medium">
          <span>10K</span>
          <span>100K</span>
          <span>500K</span>
          <span>1M</span>
          <span>5M+</span>
        </div>
      </div>
    </div>
  );
}
