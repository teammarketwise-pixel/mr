import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle, ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { format, addWeeks } from 'date-fns';
import { nl } from 'date-fns/locale';

const CLIENT_PRICE = 418; // excl. BTW per week per locatie

function countPanels(panelStr) {
  if (!panelStr) return 0;
  return panelStr.split(',').map(s => s.trim()).filter(Boolean).length;
}

function populariteitLabel(loc) {
  const n = countPanels(loc.panel_nummers);
  if (n >= 6) return 'Toplocatie';
  if (n >= 4) return 'Hot spot';
  if (n >= 2) return 'Populair';
  return 'Uniek';
}

function CalendarPicker({ selected, onChange }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const startOffset = (firstDay + 6) % 7;

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(viewYear, viewMonth, d));

  const monthNames = ['Januari','Februari','Maart','April','Mei','Juni','Juli','Augustus','September','Oktober','November','December'];

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
          <ChevronLeft className="w-4 h-4 text-white/60" />
        </button>
        <span className="text-white font-semibold text-sm">{monthNames[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
          <ChevronRight className="w-4 h-4 text-white/60" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['Ma','Di','Wo','Do','Vr','Za','Zo'].map(d => (
          <div key={d} className="text-center text-[10px] text-white/30 font-medium py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) return <div key={`e-${i}`} />;
          const isPast = date < today;
          const isSelected = selected && date.toDateString() === selected.toDateString();
          return (
            <button
              key={date.getDate()}
              disabled={isPast}
              onClick={() => onChange(date)}
              className={`text-center text-xs py-1.5 rounded-lg transition-all ${
                isSelected ? 'bg-[#FFD700] text-[#0F172A] font-bold'
                : isPast ? 'text-white/20 cursor-not-allowed'
                : 'text-white/70 hover:bg-white/10'
              }`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function NewClaimModal({ open, onClose, selectedLocations }) {
  const [step, setStep] = useState(1);
  const [weken, setWeken] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [form, setForm] = useState({
    company: '', contact: '', phone: '', email: '',
    btw: '', adres: '', opmerking: ''
  });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const totalExcl = CLIENT_PRICE * weken * selectedLocations.length;
  const btwBedrag = Math.round(totalExcl * 0.21 * 100) / 100;
  const totalIncl = Math.round((totalExcl + btwBedrag) * 100) / 100;
  const endDate = startDate ? addWeeks(startDate, weken) : null;

  const handleClose = () => {
    setStep(1); setWeken(1); setStartDate(null);
    setForm({ company: '', contact: '', phone: '', email: '', btw: '', adres: '', opmerking: '' });
    setDone(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    const locationsSummary = selectedLocations.map(l =>
      `${l.adres} (${l.post_code}) — Panels: ${l.panel_nummers}`
    ).join('\n');

    // Save claim to database
    await base44.entities.Claim.create({
      client_name: form.contact,
      company_name: form.company,
      btw_nummer: form.btw,
      facturatie_adres: form.adres,
      email: form.email,
      phone: form.phone,
      selected_location_ids: selectedLocations.map(l => l.id).join(','),
      selected_locations_summary: locationsSummary,
      aantal_weken: weken,
      start_datum: startDate ? format(startDate, 'yyyy-MM-dd') : null,
      eind_datum: endDate ? format(endDate, 'yyyy-MM-dd') : null,
      opmerking: form.opmerking,
      prijs_excl_btw: totalExcl,
      btw_bedrag: btwBedrag,
      prijs_incl_btw: totalIncl,
      status: 'In behandeling',
    });

    // Send confirmation emails
    await base44.integrations.Core.SendEmail({
      to: form.email,
      subject: `Uw aanvraag bij Market Rise is ontvangen`,
      body: `Beste ${form.contact},\n\nWij hebben uw aanvraag goed ontvangen.\n\nGeselecteerde locaties:\n${locationsSummary}\n\nAantal weken: ${weken}\nStartdatum: ${startDate ? format(startDate, 'd MMMM yyyy', { locale: nl }) : 'Niet opgegeven'}\nTotaal excl. BTW: €${totalExcl.toLocaleString('nl-NL')}\nBTW (21%): €${btwBedrag.toLocaleString('nl-NL')}\nTotaal incl. BTW: €${totalIncl.toLocaleString('nl-NL')}\n\nOns team bekijkt uw aanvraag en neemt spoedig contact met u op.\n\nMet vriendelijke groeten,\nHet Market Rise Team`,
    });

    await base44.integrations.Core.SendEmail({
      to: 'Team.MarketRise@hotmail.com',
      subject: `NIEUWE CLAIM — ${form.company} — ${selectedLocations.length} locatie(s)`,
      body: `Nieuwe claim via de website\n\nBedrijf: ${form.company}\nContact: ${form.contact}\nTelefoon: ${form.phone}\nE-mail: ${form.email}\nBTW: ${form.btw}\nFacturatieadres: ${form.adres}\n\nLocaties:\n${locationsSummary}\n\nAantal weken: ${weken}\nStartdatum: ${startDate ? format(startDate, 'd MMMM yyyy', { locale: nl }) : 'Niet opgegeven'}\nEinddatum: ${endDate ? format(endDate, 'd MMMM yyyy', { locale: nl }) : ''}\nTotaal excl. BTW: €${totalExcl}\nBTW: €${btwBedrag}\nTotaal incl. BTW: €${totalIncl}\n\nOpmerking: ${form.opmerking || '—'}`,
    });

    setSending(false);
    setDone(true);
  };

  const step3Valid = startDate !== null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[500]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[510] flex items-center justify-center p-4"
          >
            <div className="bg-[#0F172A] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex-shrink-0 p-6 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="font-clash text-xl font-semibold text-white">
                    {done ? 'Claim Ontvangen' : ['', 'Geselecteerde Locaties', 'Kies Duur', 'Kies Startdatum', 'Uw Gegevens'][step]}
                  </h2>
                  {!done && <p className="text-white/40 text-xs mt-0.5">Stap {step} van 4</p>}
                </div>
                <button onClick={handleClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {done ? (
                  <div className="text-center py-6">
                    <div className="w-14 h-14 bg-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-7 h-7 text-[#0F172A]" strokeWidth={2.5} />
                    </div>
                    <h3 className="font-clash text-2xl font-semibold text-white mb-2">Aanvraag Verstuurd!</h3>
                    <p className="text-white/50 text-sm max-w-sm mx-auto">
                      U ontvangt een bevestigingsmail. Ons team neemt binnen 24 uur contact met u op.
                    </p>
                    <button onClick={handleClose} className="mt-6 text-sm text-white/40 hover:text-white underline">Sluiten</button>
                  </div>
                ) : step === 1 ? (
                  <div className="space-y-3">
                    {selectedLocations.map(loc => (
                      <div key={loc.id} className="bg-white/5 border border-white/10 rounded-xl p-3">
                        <p className="text-white font-semibold text-sm">{loc.adres}</p>
                        <p className="text-white/40 text-xs mt-0.5">{loc.post_code}{loc.stad ? ` — ${loc.stad}` : ''}</p>
                        <p className="text-white/40 text-xs">Panels: {loc.panel_nummers}</p>
                        <span className="mt-1 inline-block text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#FFD700] text-[#0F172A]">
                          {populariteitLabel(loc)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : step === 2 ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-center gap-6">
                      <button onClick={() => setWeken(w => Math.max(1, w - 1))}
                        className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                        <Minus className="w-5 h-5 text-white" />
                      </button>
                      <div className="text-center">
                        <div className="font-clash text-5xl font-semibold text-[#FFD700]">{weken}</div>
                        <div className="text-white/40 text-sm">{weken === 1 ? 'week' : 'weken'}</div>
                      </div>
                      <button onClick={() => setWeken(w => Math.min(12, w + 1))}
                        className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                        <Plus className="w-5 h-5 text-white" />
                      </button>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                      <p className="text-white/50 text-xs text-center">{selectedLocations.length} locatie(s) × {weken} week(en) × €{CLIENT_PRICE}</p>
                      <p className="font-clash text-3xl font-semibold text-white text-center">€{totalExcl.toLocaleString('nl-NL')}</p>
                      <div className="border-t border-white/10 pt-2 space-y-1">
                        <div className="flex justify-between text-xs text-white/40">
                          <span>BTW 21%</span><span>€{btwBedrag.toLocaleString('nl-NL')}</span>
                        </div>
                        <div className="flex justify-between text-sm text-white/70 font-semibold">
                          <span>Totaal incl. BTW</span><span>€{totalIncl.toLocaleString('nl-NL')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : step === 3 ? (
                  <div className="space-y-4">
                    <CalendarPicker selected={startDate} onChange={setStartDate} />
                    {startDate && endDate && (
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between text-sm">
                        <div>
                          <p className="text-white/40 text-xs">Start</p>
                          <p className="text-white font-semibold">{format(startDate, 'd MMM yyyy', { locale: nl })}</p>
                        </div>
                        <div className="text-white/20">→</div>
                        <div>
                          <p className="text-white/40 text-xs">Einde</p>
                          <p className="text-white font-semibold">{format(endDate, 'd MMM yyyy', { locale: nl })}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <form id="claim-form" onSubmit={handleSubmit} className="space-y-3">
                    {/* Price summary */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 mb-4 space-y-1">
                      <p className="text-white/40 text-xs">{selectedLocations.length} locatie(s) · {weken} week(en)</p>
                      {startDate && <p className="text-white/40 text-xs">Start: {format(startDate, 'd MMM yyyy', { locale: nl })} · Einde: {endDate ? format(endDate, 'd MMM yyyy', { locale: nl }) : ''}</p>}
                      <p className="text-[#FFD700] font-semibold text-sm">€{totalExcl.toLocaleString('nl-NL')} excl. BTW · €{totalIncl.toLocaleString('nl-NL')} incl. BTW</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Bedrijfsnaam *" value={form.company} onChange={v => setForm({...form, company: v})} placeholder="Uw bedrijf" required />
                      <Field label="Contactpersoon *" value={form.contact} onChange={v => setForm({...form, contact: v})} placeholder="Uw naam" required />
                    </div>
                    <Field label="BTW-nummer *" value={form.btw} onChange={v => setForm({...form, btw: v})} placeholder="BE 0xxx.xxx.xxx" required />
                    <Field label="Facturatieadres *" value={form.adres} onChange={v => setForm({...form, adres: v})} placeholder="Straat, nr, postcode, stad" required />
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Telefoon *" value={form.phone} onChange={v => setForm({...form, phone: v})} placeholder="+32 4..." required type="tel" />
                      <Field label="E-mail *" value={form.email} onChange={v => setForm({...form, email: v})} placeholder="u@bedrijf.be" required type="email" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-white/40 block mb-1.5">Opmerking (optioneel)</label>
                      <textarea
                        value={form.opmerking}
                        onChange={e => setForm({...form, opmerking: e.target.value})}
                        placeholder="Speciale wensen of opmerkingen..."
                        rows={2}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700] placeholder:text-white/20 resize-none"
                      />
                    </div>
                  </form>
                )}
              </div>

              {/* Footer nav */}
              {!done && (
                <div className="flex-shrink-0 p-6 border-t border-white/10 flex gap-3">
                  {step > 1 && (
                    <button onClick={() => setStep(s => s - 1)}
                      className="px-5 py-3 rounded-full border border-white/20 text-white/60 text-sm hover:bg-white/10 transition-colors">
                      Terug
                    </button>
                  )}
                  {step < 4 ? (
                    <button
                      onClick={() => setStep(s => s + 1)}
                      disabled={step === 3 && !step3Valid}
                      className="flex-1 bg-[#FFD700] text-[#0F172A] py-3 rounded-full font-bold text-sm hover:scale-[1.01] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Volgende
                    </button>
                  ) : (
                    <button
                      type="submit"
                      form="claim-form"
                      disabled={sending}
                      className="flex-1 bg-[#FFD700] text-[#0F172A] py-3 rounded-full font-bold text-sm hover:scale-[1.01] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {sending ? <><Loader2 className="w-4 h-4 animate-spin" />Versturen...</> : 'Claim Indienen'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Field({ label, value, onChange, placeholder, required, type = 'text' }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-wider text-white/40 block mb-1.5">{label}</label>
      <input
        required={required}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700] placeholder:text-white/20"
      />
    </div>
  );
}
