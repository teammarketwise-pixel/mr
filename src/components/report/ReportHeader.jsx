import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Wallet, MapPin, Users } from 'lucide-react';

export default function ReportHeader({ criteria, matchCount }) {
  const formatEuro = (v) => {
    if (!v) return '—';
    if (v >= 1000) return `€${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}K`;
    return `€${v}`;
  };

  return (
    <div className="border-b border-border bg-background">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 pt-28 pb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Nieuw rapport
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              ── Uw Strategisch Locatierapport
            </span>
            <h1 className="font-clash font-semibold text-4xl md:text-5xl mt-3 leading-[1]">
              <span className="text-cyber-yellow">{matchCount}</span> locaties
              <br />
              perfect voor uw doelen.
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <Pill icon={Wallet} label="Budget" value={formatEuro(criteria?.budget)} />
            <Pill icon={MapPin} label="Regio" value={criteria?.region || '—'} />
            <Pill icon={Users} label="Doelgroep" value={criteria?.audience || '—'} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Pill({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 bg-concrete rounded-full pl-3 pr-5 py-2.5">
      <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
        <Icon className="w-3.5 h-3.5 text-ink-slate" />
      </div>
      <div>
        <div className="text-[9px] uppercase tracking-wider text-muted-foreground leading-none mb-0.5">{label}</div>
        <div className="text-sm font-semibold leading-none">{value}</div>
      </div>
    </div>
  );
}
