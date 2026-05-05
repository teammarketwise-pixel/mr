import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ScanAnimation from '@/components/report/ScanAnimation';
import MapView from '@/components/report/MapView';
import LocationCard from '@/components/report/LocationCard';
import InquiryDrawer from '@/components/report/InquiryDrawer';
import ReportHeader from '@/components/report/ReportHeader';
import { filterAndScoreLocations } from '@/lib/matching';
import { motion } from 'framer-motion';
import { MessageSquare, Loader2, Inbox } from 'lucide-react';

export default function Report() {
  const [scanning, setScanning] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [drawerLocation, setDrawerLocation] = useState(null);

  const params = new URLSearchParams(window.location.search);
  const criteria = {
    budget: Number(params.get('budget')) || 10000,
    region: params.get('region') || '',
    audience: params.get('audience') || '',
  };

  const { data: allLocations = [], isLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: () => base44.entities.Location.list(),
  });

  const matched = useMemo(
    () => filterAndScoreLocations(allLocations, criteria).slice(0, 5),
    [allLocations, criteria.budget, criteria.region, criteria.audience]
  );

  useEffect(() => {
    if (matched.length > 0 && !selectedId) {
      setSelectedId(matched[0].id);
    }
  }, [matched, selectedId]);

  return (
    <div className="min-h-screen bg-background">
      {scanning && <ScanAnimation onComplete={() => setScanning(false)} />}
      <Navbar />

      <ReportHeader criteria={criteria} matchCount={matched.length} />

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-40">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : matched.length === 0 ? (
          <EmptyState criteria={criteria} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Map */}
            <div className="lg:col-span-7 lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]">
              <MapView
                locations={matched}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </div>

            {/* Cards */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-clash text-xl font-semibold">Top {matched.length} matches</h2>
                <span className="text-xs text-muted-foreground">Gesorteerd op match-score</span>
              </div>

              {matched.map((loc, i) => (
                <LocationCard
                  key={loc.id}
                  location={loc}
                  matchScore={loc.matchScore}
                  isSelected={selectedId === loc.id}
                  onSelect={() => setSelectedId(loc.id)}
                  onInquire={(l) => setDrawerLocation(l)}
                  index={i}
                />
              ))}

              {/* Specialist CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-ink-slate rounded-2xl p-6 mt-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-yellow/20 rounded-full blur-3xl" />
                <div className="relative">
                  <MessageSquare className="w-6 h-6 text-cyber-yellow mb-3" />
                  <h3 className="font-clash text-xl font-semibold text-white mb-2">
                    Nog vragen over dit plan?
                  </h3>
                  <p className="text-white/60 text-sm mb-5">
                    Een van onze OOH specialisten reviewed uw rapport gratis en persoonlijk.
                  </p>
                  <button
                    onClick={() => setDrawerLocation(matched[0])}
                    className="bg-cyber-yellow text-ink-slate px-5 py-3 rounded-full text-sm font-semibold hover:scale-[1.02] transition-all"
                  >
                    Bespreek Dit Plan met een Specialist
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      <InquiryDrawer
        open={!!drawerLocation}
        location={drawerLocation}
        criteria={criteria}
        onClose={() => setDrawerLocation(null)}
      />

      <Footer />
    </div>
  );
}

function EmptyState({ criteria }) {
  return (
    <div className="text-center py-24 max-w-xl mx-auto">
      <div className="w-16 h-16 bg-concrete rounded-full flex items-center justify-center mx-auto mb-6">
        <Inbox className="w-6 h-6 text-muted-foreground" />
      </div>
      <h3 className="font-clash text-2xl font-semibold mb-3">Geen directe matches gevonden</h3>
      <p className="text-muted-foreground mb-6">
        Met een budget van €{criteria.budget?.toLocaleString('nl-NL')} in {criteria.region || 'uw regio'} zijn er geen locaties in ons huidig aanbod.
        Vergroot uw budget of regio, of vraag persoonlijk advies aan.
      </p>
      <a href="/" className="inline-flex items-center gap-2 bg-cyber-yellow text-ink-slate px-5 py-3 rounded-full text-sm font-semibold">
        Nieuw rapport maken
      </a>
    </div>
  );
}
