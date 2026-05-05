import React, { useState } from 'react';
import { Send, CheckCircle, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function MiniContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await base44.integrations.Core.SendEmail({
      to: 'Team.MarketRise@hotmail.com',
      subject: `Contactformulier van ${form.name}`,
      body: `Naam: ${form.name}\nE-mail: ${form.email}\n\nBericht:\n${form.message}`,
    });
    setSending(false);
    setSent(true);
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-[#0F172A]">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-white/30 font-medium">Contact</span>
          <h2 className="font-clash font-semibold text-4xl md:text-5xl mt-4 text-white leading-tight">
            Nog vragen over uw<br />specifieke campagne?
          </h2>
          <p className="mt-4 text-white/50">Laat het ons weten. Een specialist reageert binnen 24 uur.</p>
        </div>

        <div className="max-w-xl mx-auto">
          {sent ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 bg-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-[#0F172A]" strokeWidth={2.5} />
              </div>
              <h3 className="font-clash text-2xl font-semibold text-white mb-2">Verzonden!</h3>
              <p className="text-white/50 text-sm">Wij nemen snel contact met u op.</p>
              <button
                onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }); }}
                className="mt-6 text-sm text-white/30 hover:text-white transition-colors underline"
              >
                Nieuw bericht
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-white/30 block mb-1.5">Naam</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Uw naam"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700] placeholder:text-white/20"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-white/30 block mb-1.5">E-mail</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="u@bedrijf.nl"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700] placeholder:text-white/20"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-white/30 block mb-1.5">Bericht</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Vertel ons over uw campagne..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700] placeholder:text-white/20 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full flex items-center justify-center gap-2 bg-[#FFD700] text-[#0F172A] py-4 rounded-full font-bold text-sm hover:scale-[1.01] transition-all disabled:opacity-60"
              >
                {sending ? <><Loader2 className="w-4 h-4 animate-spin" />Versturen...</> : <><Send className="w-4 h-4" />Verstuur</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
