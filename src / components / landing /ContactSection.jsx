import React, { useState } from 'react';
import { Send, CheckCircle, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function ContactSection() {
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await base44.integrations.Core.SendEmail({
      to: 'Team.MarketRise@hotmail.com',
      subject: `Nieuwe aanvraag van ${form.name} - ${form.company}`,
      body: `Naam: ${form.name}\nBedrijf: ${form.company}\nE-mail: ${form.email}\nTelefoon: ${form.phone}\n\nBericht:\n${form.message}`,
    });
    setSending(false);
    setSent(true);
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-[#F1F5F9]">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left */}
          <div className="lg:col-span-5">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
              ── Contact
            </span>
            <h2 className="font-clash font-semibold text-4xl md:text-6xl mt-6 leading-[1]">
              Laten we
              <br />
              samen het
              <br />
              <span className="bg-[#FFD700] px-2">straatbeeld</span>
              <br />
              domineren.
            </h2>
            <p className="mt-6 text-muted-foreground text-lg max-w-md leading-relaxed">
              Stuur ons een bericht en een specialist neemt binnen 24 uur contact met u op voor een persoonlijk OOH-advies.
            </p>

            <div className="mt-10 space-y-5">
              <a
                href="mailto:Team.MarketRise@hotmail.com"
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full bg-[#FFD700] flex items-center justify-center flex-shrink-0">
                  <Send className="w-4 h-4 text-[#0F172A]" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">E-mail</div>
                  <div className="font-medium group-hover:underline">Team.MarketRise@hotmail.com</div>
                </div>
              </a>

              <a href="tel:+32474199408" className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-[#0F172A] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-[#FFD700]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.47 11.47 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.47 11.47 0 00.57 3.57 1 1 0 01-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Telefoon</div>
                  <div className="font-medium group-hover:underline">+32 474 19 94 08</div>
                </div>
              </a>

              <a
                href="https://www.instagram.com/marketrise.team"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Instagram</div>
                  <div className="font-medium group-hover:underline">@marketrise.team</div>
                </div>
              </a>

              <a
                href="https://www.linkedin.com/company/marketrise"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full bg-[#0077B5] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">LinkedIn</div>
                  <div className="font-medium group-hover:underline">MarketRise</div>
                </div>
              </a>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_1px_2px_rgba(0,0,0,0.02),0_8px_40px_rgba(0,0,0,0.06)]">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#FFD700] flex items-center justify-center mb-6">
                    <CheckCircle className="w-7 h-7 text-[#0F172A]" strokeWidth={2.5} />
                  </div>
                  <h3 className="font-clash text-3xl font-semibold mb-3">Bericht verzonden!</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Dank voor uw bericht. Een specialist neemt binnen 24 uur contact met u op.
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: '', company: '', email: '', phone: '', message: '' }); }}
                    className="mt-8 text-sm underline text-muted-foreground hover:text-foreground"
                  >
                    Nieuw bericht sturen
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="font-clash text-2xl font-semibold mb-6">Stuur ons een bericht</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-2">Naam *</label>
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Uw volledige naam"
                        className="w-full bg-[#F1F5F9] border-0 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-2">Bedrijfsnaam</label>
                      <input
                        type="text"
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        placeholder="Uw bedrijf"
                        className="w-full bg-[#F1F5F9] border-0 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-2">E-mail *</label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="u@bedrijf.nl"
                        className="w-full bg-[#F1F5F9] border-0 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-2">Telefoonnummer</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+31 6 ..."
                        className="w-full bg-[#F1F5F9] border-0 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-2">Hoe kunnen we u helpen? *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Vertel ons over uw campagne-idee, budget en doelgroep..."
                      className="w-full bg-[#F1F5F9] border-0 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FFD700] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-[#FFD700] text-[#0F172A] py-4 rounded-full font-semibold text-base hover:scale-[1.01] transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                  >
                    {sending ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Verzenden...</>
                    ) : (
                      <><Send className="w-4 h-4" /> Verstuur Bericht</>
                    )}
                  </button>

                  <p className="text-[11px] text-muted-foreground text-center">
                    Wij reageren binnen 24 uur · Geen verplichtingen
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
