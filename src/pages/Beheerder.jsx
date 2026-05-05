import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import Navbar from '@/components/shared/Navbar';
import { motion } from 'framer-motion';
import { Loader2, ChevronDown, CheckCircle, Clock, AlertCircle, Settings, Zap, Archive, Download, Eye } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';

const STATUSES = ['Alle', 'In behandeling', 'Actie vereist', 'In verwerking', 'Bevestigd', 'Actief', 'Afgelopen'];

const STATUS_COLORS = {
  'In behandeling': 'bg-yellow-100 text-yellow-700',
  'Actie vereist': 'bg-orange-100 text-orange-700',
  'In verwerking': 'bg-blue-100 text-blue-700',
  'Bevestigd': 'bg-green-100 text-green-700',
  'Actief': 'bg-purple-100 text-purple-700',
  'Afgelopen': 'bg-gray-100 text-gray-600',
};

const NEXT_STATUS = {
  'In behandeling': 'Actie vereist',
  'Actie vereist': 'In verwerking',
  'In verwerking': 'Bevestigd',
  'Bevestigd': 'Actief',
  'Actief': 'Afgelopen',
};

const STATUS_MAIL_SUBJECTS = {
  'Actie vereist': 'Uw factuur staat klaar — Market Rise',
  'In verwerking': 'Alles ontvangen — Market Rise',
  'Bevestigd': 'Uw campagne is bevestigd — Market Rise',
  'Actief': 'Uw campagne is gestart — Market Rise',
  'Afgelopen': 'Uw campagne is afgelopen — Market Rise',
};

const STATUS_MAIL_BODY = {
  'Actie vereist': (c) => `Beste ${c.client_name},\n\nUw factuur staat klaar. Upload uw campagneafbeelding en betaal de factuur om uw boeking te bevestigen.\n\nTotaal excl. BTW: €${c.prijs_excl_btw}\nBTW 21%: €${c.btw_bedrag}\nTotaal incl. BTW: €${c.prijs_incl_btw}\n\nLog in op uw dashboard om verder te gaan.\n\nMet vriendelijke groeten,\nHet Market Rise Team`,
  'In verwerking': (c) => `Beste ${c.client_name},\n\nWij hebben uw betaling en afbeelding goed ontvangen. Wij regelen alles, u hoort spoedig van ons.\n\nMet vriendelijke groeten,\nHet Market Rise Team`,
  'Bevestigd': (c) => `Beste ${c.client_name},\n\nGoed nieuws! Uw campagne is bevestigd.\n\nStartdatum: ${c.bevestigde_startdatum || c.start_datum}\nEinddatum: ${c.bevestigde_einddatum || c.eind_datum}\n\nMet vriendelijke groeten,\nHet Market Rise Team`,
  'Actief': (c) => `Beste ${c.client_name},\n\nUw campagne is vandaag gestart! U kunt de voortgang volgen via uw dashboard.\n\nMet vriendelijke groeten,\nHet Market Rise Team`,
  'Afgelopen': (c) => `Beste ${c.client_name},\n\nUw campagne is afgelopen. Bedankt voor uw vertrouwen in Market Rise.\n\nWilt u opnieuw adverteren? Log in op uw dashboard voor meer opties.\n\nMet vriendelijke groeten,\nHet Market Rise Team`,
};

export default function Beheerder() {
  const [statusFilter, setStatusFilter] = useState('Alle');
  const [expanded, setExpanded] = useState(null);
  const [startDateInputs, setStartDateInputs] = useState({});
  const [updatingId, setUpdatingId] = useState(null);
  const qc = useQueryClient();

  const { data: claims = [], isLoading } = useQuery({
    queryKey: ['admin-claims'],
    queryFn: () => base44.entities.Claim.list('-created_date', 200),
  });

  const filtered = statusFilter === 'Alle' ? claims : claims.filter(c => c.status === statusFilter);

  const updateStatus = async (claim, newStatus) => {
    setUpdatingId(claim.id);
    const updateData = { status: newStatus };

    if (newStatus === 'Bevestigd' && startDateInputs[claim.id]) {
      const startD = new Date(startDateInputs[claim.id]);
      const endD = new Date(startD);
      endD.setDate(endD.getDate() + (claim.aantal_weken || 1) * 7);
      updateData.bevestigde_startdatum = startDateInputs[claim.id];
      updateData.bevestigde_einddatum = format(endD, 'yyyy-MM-dd');
    }

    await base44.entities.Claim.update(claim.id, updateData);

    // Send automatic email
    const mailSubject = STATUS_MAIL_SUBJECTS[newStatus];
    const mailBody = STATUS_MAIL_BODY[newStatus];
    if (mailSubject && mailBody && claim.email) {
      await base44.integrations.Core.SendEmail({
        to: claim.email,
        subject: mailSubject,
        body: mailBody({ ...claim, ...updateData }),
      });
    }

    qc.invalidateQueries({ queryKey: ['admin-claims'] });
    setUpdatingId(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-28">
        <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">Beheerder</p>
            <h1 className="font-clash text-3xl font-semibold text-[#0F172A]">Claims Overzicht</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${statusFilter === s ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}>
                {s} {s !== 'Alle' && `(${claims.filter(c => c.status === s).length})`}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[#FFD700]" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 text-gray-400">Geen claims gevonden.</div>
        ) : (
          <div className="space-y-3">
            {filtered.map(claim => (
              <AdminClaimCard
                key={claim.id}
                claim={claim}
                expanded={expanded === claim.id}
                onToggle={() => setExpanded(expanded === claim.id ? null : claim.id)}
                onUpdateStatus={updateStatus}
                updating={updatingId === claim.id}
                startDateInput={startDateInputs[claim.id] || ''}
                onStartDateChange={v => setStartDateInputs(prev => ({ ...prev, [claim.id]: v }))}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminClaimCard({ claim, expanded, onToggle, onUpdateStatus, updating, startDateInput, onStartDateChange }) {
  const statusColor = STATUS_COLORS[claim.status] || 'bg-gray-100 text-gray-600';
  const nextStatus = NEXT_STATUS[claim.status];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Row */}
      <div className="px-5 py-4 flex items-center gap-4 cursor-pointer" onClick={onToggle}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <p className="font-semibold text-[#0F172A]">{claim.company_name || claim.client_name}</p>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor}`}>{claim.status}</span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{claim.email} · {claim.phone}</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="font-semibold text-[#0F172A]">€{claim.prijs_excl_btw?.toLocaleString('nl-NL')} excl.</p>
          <p className="text-xs text-gray-400">{claim.aantal_weken} {claim.aantal_weken === 1 ? 'week' : 'weken'}</p>
        </div>
        <p className="text-xs text-gray-400 hidden md:block">
          {claim.created_date ? format(parseISO(claim.created_date), 'd MMM yyyy', { locale: nl }) : ''}
        </p>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${expanded ? 'rotate-180' : ''}`} />
      </div>

      {/* Expanded */}
      {expanded && (
        <div className="border-t border-gray-100 px-5 py-4 space-y-4 bg-gray-50">
          {/* Locations */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Locaties</p>
            <pre className="text-xs text-[#0F172A] whitespace-pre-wrap font-sans bg-white rounded-lg p-3 border border-gray-100">{claim.selected_locations_summary}</pre>
          </div>

          {/* Klantinfo */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <Info label="Bedrijf" value={claim.company_name} />
            <Info label="Contact" value={claim.client_name} />
            <Info label="E-mail" value={claim.email} />
            <Info label="Telefoon" value={claim.phone} />
            <Info label="BTW-nr" value={claim.btw_nummer} />
            <Info label="Facturatieadres" value={claim.facturatie_adres} />
          </div>

          {/* Prijs */}
          <div className="grid grid-cols-3 gap-3 text-sm">
            <Info label="Excl. BTW" value={`€${claim.prijs_excl_btw?.toLocaleString('nl-NL')}`} />
            <Info label="BTW 21%" value={`€${claim.btw_bedrag?.toLocaleString('nl-NL')}`} />
            <Info label="Incl. BTW" value={`€${claim.prijs_incl_btw?.toLocaleString('nl-NL')}`} />
          </div>

          {/* Opmerking */}
          {claim.opmerking && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Opmerking</p>
              <p className="text-sm text-[#0F172A] bg-white rounded-lg p-3 border border-gray-100">{claim.opmerking}</p>
            </div>
          )}

          {/* Afbeelding */}
          {claim.campagne_afbeelding_url && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Campagneafbeelding</p>
              <a href={claim.campagne_afbeelding_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
                <Eye className="w-4 h-4" /> Bekijken / Downloaden
              </a>
            </div>
          )}

          {/* Startdatum voor Bevestigd */}
          {claim.status === 'In verwerking' && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Startdatum instellen (verplicht voor Bevestigd)</p>
              <input
                type="date"
                value={startDateInput}
                onChange={e => onStartDateChange(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
              />
            </div>
          )}

          {/* Status update */}
          {nextStatus && (
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              <button
                onClick={() => onUpdateStatus(claim, nextStatus)}
                disabled={updating || (nextStatus === 'Bevestigd' && !startDateInput)}
                className="flex items-center gap-2 bg-[#FFD700] text-[#0F172A] px-5 py-2.5 rounded-full font-bold text-sm hover:scale-[1.02] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Zet naar: {nextStatus}
              </button>
              <p className="text-xs text-gray-400">Stuurt automatisch een mail naar de klant</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Info({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-gray-400">{label}</p>
      <p className="text-sm text-[#0F172A] font-medium">{value}</p>
    </div>
  );
}
