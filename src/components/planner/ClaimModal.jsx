import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle, Cpu } from 'lucide-react';
import { base44 } from '@/api/base44Client';

function formatPrice(p) {
  return `€${Math.round(p * 1.25).toLocaleString('nl-NL')}`;
}

export default function ClaimModal({ location, onClose }) {
  const [form, setForm] = useState({ company: '', contact: '', phone: '', email: '' });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await base44.integrations.Core.SendEmail({
      to: 'Team.MarketRise@hotmail.com',
      subject: `CLAIM AANVRAAG: ${location.name} — ${form.company}`,
      body: `Nieuwe claim via de AI-Kaart\n\nLocatie: ${location.name}\nStad: ${location.city}\nPrijs: ${formatPrice(location.price_per_week)}/week\n\nBedrijfsnaam: ${form.company}\nContactpersoon: ${form.contact}\nTelefoon: ${form.phone}\nE-mail: ${form.email}`,
    });
    await base44.entities.Inquiry.create({
      client_name: form.contact,
      email: form.email,
      phone: form.phone,
      selected_location_ids: location.id,
      budget: Math.round(location.price_per_week * 1.25),
      region: location.region,
      status: 'Nieuw',
    });
    setSending(false);
    setDone(true);
  };

  const handleClose = () => {
    setDone(false);
    setForm({ company: '', contact: '', phone: '', email: '' });
    onClose();
  };

  return (
    <AnimatePresence>
      {location && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[500]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[510] flex items-center justify-center p-4"
          >
            <div className="bg-[#0F172A] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="relative p-6 border-b border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Cpu className="w-4 h-4 text-[#FFD700]" />
                  <span className="text-[#FFD700] text-xs uppercase tracking-widest font-medium">AI Selectie Bevestigd</span>
                </div>
                <h2 className="font-clash text-2xl font-semibold text-white">{location.name}</h2>
                <p className="text-white/40 text-sm mt-0.5">{location.city} · {formatPrice(location.price_per_week)}/week</p>
                <button onClick={handleClose} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="p-6">
                {done ? (
                  <div className="text-center py-8">
                    <div className="w-14 h-14 bg-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-7 h-7 text-[#0F172A]" strokeWidth={2.5} />
                    </div>
                    <h3 className="font-clash text-2xl font-semibold text-white mb-2">Claim Ontvangen</h3>
                    <p className="text-white/50 text-sm max-w-sm mx-auto">
                      Ons team neemt binnen 24 uur persoonlijk contact met u op om de details door te nemen en de plaatsing definitief te maken.
                    </p>
                    <button onClick={handleClose} className="mt-6 text-sm text-white/40 hover:text-white transition-colors underline">Sluiten</button>
                  </div>
                ) : (
                  <>
                    <p className="text-white/50 text-sm mb-6">
                      Onze AI heeft deze plek voor u geselecteerd. Ons team neemt binnen 24 uur persoonlijk contact met u op om de details door te nemen en de plaatsing definitief te maken.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-white/40 block mb-1.5">Bedrijfsnaam *</label>
                          <input
                            required
                            value={form.company}
                            onChange={(e) => setForm({ ...form, company: e.target.value })}
                            placeholder="Uw bedrijf"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700] placeholder:text-white/20"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-white/40 block mb-1.5">Contactpersoon *</label>
                          <input
                            required
                            value={form.contact}
                            onChange={(e) => setForm({ ...form, contact: e.target.value })}
                            placeholder="Uw naam"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700] placeholder:text-white/20"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-white/40 block mb-1.5">Telefoon *</label>
                          <input
                            required
                            type="tel"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            placeholder="+32 4..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700] placeholder:text-white/20"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-white/40 block mb-1.5">E-mail *</label>
                          <input
                            required
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="u@bedrijf.nl"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700] placeholder:text-white/20"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={sending}
                        className="w-full mt-2 bg-[#FFD700] text-[#0F172A] py-3.5 rounded-full font-bold text-sm hover:scale-[1.01] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {sending ? <><Loader2 className="w-4 h-4 animate-spin" />Versturen...</> : 'Bevestig Mijn Claim'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
