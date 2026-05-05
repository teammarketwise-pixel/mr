import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Loader2, Activity } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function InquiryDrawer({ open, location, onClose, criteria }) {
  const [form, setForm] = useState({ client_name: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await base44.entities.Inquiry.create({
      client_name: form.client_name,
      email: form.email,
      phone: form.phone,
      selected_location_ids: location?.id || '',
      budget: criteria?.budget,
      region: criteria?.region,
      target_audience: criteria?.audience,
      status: 'Nieuw',
    });
    setSubmitting(false);
    setDone(true);
    setTimeout(() => {
      setDone(false);
      setForm({ client_name: '', email: '', phone: '' });
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink-slate/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full md:w-[480px] bg-background z-[70] overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Beschikbaarheid aanvragen
                </span>
                <button onClick={onClose} className="p-2 hover:bg-concrete rounded-full transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {location && (
                <>
                  <div className="rounded-2xl overflow-hidden bg-concrete mb-6">
                    <img src={location.photo_url} alt={location.name} className="w-full h-48 object-cover" />
                  </div>

                  <h2 className="font-clash text-3xl font-semibold leading-tight mb-2">
                    {location.name}
                  </h2>
                  <p className="text-muted-foreground text-sm mb-6">
                    {location.city} · {location.subtype}
                  </p>

                  <div className="flex items-center gap-2 bg-cyber-yellow/10 border border-cyber-yellow/30 rounded-xl px-4 py-3 mb-8">
                    <Activity className="w-4 h-4 text-ink-slate" />
                    <span className="text-xs font-medium">
                      High Demand: 4 inquiries in de laatste 24h
                    </span>
                  </div>

                  {done ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-cyber-yellow mx-auto flex items-center justify-center mb-4">
                        <Check className="w-7 h-7 text-ink-slate" strokeWidth={3} />
                      </div>
                      <h3 className="font-clash text-2xl font-semibold mb-2">Aanvraag ontvangen</h3>
                      <p className="text-muted-foreground text-sm">
                        Een specialist neemt binnen 24 uur contact met u op.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-2">
                          Naam
                        </label>
                        <input
                          type="text"
                          required
                          value={form.client_name}
                          onChange={(e) => setForm({...form, client_name: e.target.value})}
                          className="w-full bg-concrete border-0 rounded-xl px-4 py-3.5 font-medium focus:outline-none focus:ring-2 focus:ring-cyber-yellow"
                          placeholder="Uw volledige naam"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-2">
                          E-mail
                        </label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({...form, email: e.target.value})}
                          className="w-full bg-concrete border-0 rounded-xl px-4 py-3.5 font-medium focus:outline-none focus:ring-2 focus:ring-cyber-yellow"
                          placeholder="u@bedrijf.nl"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-2">
                          Telefoon <span className="text-muted-foreground/60 normal-case">(optioneel)</span>
                        </label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({...form, phone: e.target.value})}
                          className="w-full bg-concrete border-0 rounded-xl px-4 py-3.5 font-medium focus:outline-none focus:ring-2 focus:ring-cyber-yellow"
                          placeholder="+31 6 ..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full mt-6 bg-cyber-yellow text-ink-slate py-4 rounded-full font-semibold hover:scale-[1.01] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Versturen...</>
                        ) : (
                          'Lock in this Location'
                        )}
                      </button>

                      <p className="text-[11px] text-muted-foreground text-center pt-2">
                        Geen commitment. Een specialist helpt u binnen 24 uur verder.
                      </p>
                    </form>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
